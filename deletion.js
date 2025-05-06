import { useEffect } from 'react';

import {CLEANUP_API_KEY} from "@env"

const useCleanOldFiles = () => {
  useEffect(() => {
    const cleanup = async () => {
      try {
        const resp = await fetch(
          'https://sherlock.expo.app/cleanup',
          {
            method: 'GET',
            headers: {
              'x-api-key': CLEANUP_API_KEY,
            },
          }
        );
        if (!resp.ok) throw new Error(`Status ${resp.status}`);
        const json = await resp.json()
        console.log('Cleanup result:', json);
      } catch (err) {
        console.error('Cleanup failed:', err);
      }
    };

    cleanup();
    const id = setInterval(cleanup, 60 * 60 * 1000);
    return () => clearInterval(id);
  }, []);
};

export default useCleanOldFiles;
