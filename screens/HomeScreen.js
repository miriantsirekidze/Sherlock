// HomeScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Dimensions, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as NavigationBar from 'expo-navigation-bar';

import Button from '../components/Button';
import Tips from '../components/Tips';
import AnimatedSearchButton from '../components/AnimatedSearchButton';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ModalComponent from '../components/ModalComponent';
import AnimeSearch from '../components/AnimeSearch';
import DefaultEngine from '../components/DefaultEngine';
import * as FileSystem from 'expo-file-system';
import {API_KEY} from '@env'

const { height, width } = Dimensions.get('window');

const HomeScreen = () => {
  NavigationBar.setBackgroundColorAsync('#333');

  const [image, setImage] = useState(null);
  const [urlText, setUrlText] = useState("");
  const [lastUploaded, setLastUploaded] = useState({ uri: null, url: null });
  const [isLoading, setIsLoading] = useState(false);
  const [selection, setSelection] = useState(null);
  const [isUrlValid, setIsUrlValid] = useState(null);
  const [uri, setUri] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();

  const validateUrl = (url) => {
    const regex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg))/i;
    return regex.test(url);
  };

  const handleImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    console.log(result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setUri(result.assets[0].uri);
      setSelection("image");
      if (isUrlValid === false) {
        setIsUrlValid(null);
      }
    }
  };

  // NEW: Replace Firebase upload with imgbb upload using fetch
  const uploadImage = async (imageUri) => {
    if (imageUri === lastUploaded.uri) {
      navigation.navigate('Search', { url: lastUploaded.url, uri: uri });
      return;
    }
    if (!imageUri) return;
    setIsLoading(true);
    try {
      // Read file as base64.
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Create form data.
      const formData = new FormData();
      formData.append('image', base64);
      formData.append('name', `upload_${new Date().getTime()}`);

      // Set expiration to 3600 seconds (1 hour).
      const uploadUrl = `https://api.imgbb.com/1/upload?expiration=3600&key=${API_KEY}`;

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        const downloadURL = result.data.url;
        setLastUploaded({ uri: imageUri, url: downloadURL });
        navigation.navigate('Search', { url: downloadURL, uri: uri });
      } else {
        console.error('ImgBB upload failed:', result);
        Alert.alert("Upload failed", "ImgBB did not return success");
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Upload failed:', error);
      Alert.alert("Upload failed", error.message);
      setIsLoading(false);
    }
  };

  const handleUrlSearch = (enteredUrl) => {
    if (validateUrl(enteredUrl)) {
      setUrlText(enteredUrl);
      setIsUrlValid(true);
      console.log('URL is valid');
      setSelection("url");
    } else {
      setIsUrlValid(false);
      setTimeout(() => {
        setIsUrlValid(null);
      }, 5000);
    }
  };

  const resetSelection = () => {
    setSelection(null);
    setImage(null);
    setUrlText("");
    setIsUrlValid(null);
  };

  const Separator = () => (
    <View style={{ marginVertical: 8, borderBottomColor: 'white', borderBottomWidth: 1 }} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {selection && (
          <TouchableOpacity onPress={resetSelection}>
            <MaterialCommunityIcons name="arrow-left" size={26} color="white" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => navigation.navigate("Saved")} style={{ alignSelf: 'flex-end', marginLeft: 'auto' }}>
          <MaterialIcons name="bookmark-border" size={28} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.topSection}>
        <View style={{ alignItems: 'center', marginTop: 10, height: '100%' }}>
          <View style={styles.buttonRow}>
            <ModalComponent visible={modalVisible} onClose={() => setModalVisible(false)}>
              <AnimeSearch />
              <Separator />
              <DefaultEngine />
            </ModalComponent>
            {selection === null && (
              <View style={{ marginTop: '20%', alignItems: 'center', gap: 10 }}>
                {isUrlValid === false && <Text style={styles.errorText}>Invalid URL</Text>}
                <Button onPress={handleImage} icon="image" text="Image" />
                <Text style={{color: 'white'}}>Or</Text>
                <AnimatedSearchButton
                  urlText={urlText}
                  setUrlText={setUrlText}
                  handleSearch={handleUrlSearch}
                />
              </View>
            )}
            {selection === "image" && (
              <>
                <View style={styles.imageWrapper}>
                  <Image source={{ uri: image }} style={styles.image} />
                  <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(true)}>
                    <MaterialCommunityIcons name="star-four-points" size={20} color="white" />
                  </TouchableOpacity>
                  {isLoading && (
                    <View style={styles.loadingOverlayImage}>
                      <ActivityIndicator size="large" color="white" />
                    </View>
                  )}
                </View>
                <Button onPress={() => uploadImage(image)} icon="image-search-outline" text="Search" />
                <Button onPress={handleImage} icon="image" text="Image" />
              </>
            )}
            {selection === "url" && (
              <>
                {isUrlValid ? (
                  <View style={styles.imageWrapper}>
                    <Image source={{ uri: urlText }} style={styles.image} />
                    <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(true)}>
                      <MaterialIcons name="settings" size={22} color="black" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  isUrlValid === false && <Text style={styles.errorText}>Invalid URL</Text>
                )}
                <Button onPress={() => { navigation.navigate('Search', { url: urlText }) }} icon="image-search-outline" text="Search" />
                <AnimatedSearchButton
                  urlText={urlText}
                  setUrlText={setUrlText}
                  handleSearch={handleUrlSearch}
                />
              </>
            )}
          </View>
        </View>
      </View>
      <View style={styles.tipsSection}>
        <Tips />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  header: {
    flexDirection: 'row',
    margin: 20,
  },
  backText: {
    color: 'white',
    fontWeight: 'bold'
  },
  topSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    height: height * 0.4,
  },
  buttonRow: {
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    width: width,
    alignSelf: 'center',
  },
  imageContainer: {
    padding: 10,
    alignItems: 'center',
    width: 200,
    height: 200,
  },
  imageWrapper: {
    width: 150,
    height: 150,
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden'
  },
  tipsSection: {
    flex: 1,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  loadingOverlayImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 20
  },
  modalButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    height: 30,
    width: 30,
    borderRadius: 50,
    backgroundColor: '#AB4ABA',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
