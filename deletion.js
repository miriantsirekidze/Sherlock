import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { KEY } from '@env';

const useCleanOldFiles = () => {
  useEffect(() => {
    const checkAndDeleteOldFiles = async () => {
      try {
        const fetchUrl = 'https://api.imagekit.io/v1/files?fileType=all&limit=100';
        const fetchOptions = {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Basic ${KEY}`
          }
        };
        const response = await fetch(fetchUrl, fetchOptions);
        const data = await response.json();
        const files = Array.isArray(data) ? data : data.data;
        if (!files || files.length === 0) {
          console.log('No files found');
          return;
        }

        const now = Date.now();
        const oneHourInMs = 3600 * 1000;
        const oldFiles = files.filter(file => {
          const createdTime = new Date(file.createdAt).getTime();
          return now - createdTime > oneHourInMs;
        });

        if (oldFiles.length > 0) {
          const fileIds = oldFiles.map(file => file.fileId);
          console.log('Deleting old files:', fileIds);
          const deleteUrl = 'https://api.imagekit.io/v1/files/batch/deleteByFileIds';
          const deleteOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Basic ${KEY}`
            },
            body: JSON.stringify({ fileIds })
          };
          const deleteResponse = await fetch(deleteUrl, deleteOptions);
          const deleteData = await deleteResponse.json();
          console.log('Delete response:', deleteData);
        } else {
          console.log('No files older than one hour found.');
        }
      } catch (error) {
        console.error("Error checking/deleting old files:", error);
        Alert.alert("Error", "There was an error while cleaning up old files.");
      }
    };

    checkAndDeleteOldFiles();

    const intervalId = setInterval(() => {
      checkAndDeleteOldFiles();
    }, 60 * 60 * 1000); 

    return () => clearInterval(intervalId);
  }, []);
};

export default useCleanOldFiles;
