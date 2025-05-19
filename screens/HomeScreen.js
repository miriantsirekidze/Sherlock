import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as NavigationBar from 'expo-navigation-bar';
import * as FileSystem from 'expo-file-system';

import Button from '../components/Button';
import AnimatedSearchButton from '../components/AnimatedSearchButton';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ModalComponent from '../components/ModalComponent';
import ArticleItem from '../components/ArticleItem';
import Footer from '../components/Footer';

import { articles } from '../data/articles';
import { PUBLIC_KEY } from '@env'


const HomeScreen = () => {

  NavigationBar.setBackgroundColorAsync('#0f0f0f');

  const [image, setImage] = useState(null);
  const [urlText, setUrlText] = useState("");
  const [lastUploaded, setLastUploaded] = useState({ uri: null, processedUrl: null, originalUrl: null });
  const [isLoading, setIsLoading] = useState(false);
  const [selection, setSelection] = useState(null);
  const [isUrlValid, setIsUrlValid] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();

  async function validateUrl(url) {
    if (!url || !url.trim()) return false;
    try {
      const res = await fetch(url, { method: 'HEAD' });
      const contentType = res.headers.get('Content-Type');
      if (contentType && contentType.startsWith('image/')) {
        return true;
      }
      return false;
    } catch (error) {
      return url.trim().startsWith("http");
    }
  }

  const handleImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });
    console.log(result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setSelection("image");
      if (isUrlValid === false) {
        setIsUrlValid(null);
      }
    }
  };

  const uploadFile = async ({ imageUri = null, imageUrl = null }) => {
    if (
      (imageUrl && imageUrl === lastUploaded.originalUrl) ||
      (imageUri && imageUri === lastUploaded.uri)
    ) {
      return navigation.navigate('Search', {
        url: lastUploaded.processedUrl,
        uri: imageUri ?? null,
      });
    }
  
    setIsLoading(true);
    const totalStart = performance.now();
  
    try {
      const authStart = performance.now();
      const authRes = await fetch('https://sherlock.expo.app/keys');
      const authDuration = performance.now() - authStart;
      console.log(`⏱️ Auth fetch took: ${authDuration.toFixed(1)}ms`);
  
      if (!authRes.ok) {
        throw new Error(`Auth fetch failed: ${authRes.status}`);
      }
      const { signature, token, expire } = await authRes.json();
  
      let fileData;
      if (imageUri) {
        fileData = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
      } else {
        fileData = imageUrl;
      }
  
      const formData = new FormData();
      formData.append('file', fileData);
      formData.append('fileName', `${Date.now()}`);
      formData.append('publicKey', PUBLIC_KEY);
      formData.append('signature', signature);
      formData.append('token', token);
      formData.append('expire', `${expire}`);
  
      const uploadStart = performance.now();
      const response = await fetch(
        'https://upload.imagekit.io/api/v1/files/upload',
        {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: formData,
        }
      );
      const uploadDuration = performance.now() - uploadStart;
      console.log(`⏱️ ImageKit upload took: ${uploadDuration.toFixed(1)}ms`);
  
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Upload error ${response.status}: ${text}`);
      }
  
      const data = await response.json();
      if (data.error) {
        throw new Error(
          `ImageKit: ${data.error.message || JSON.stringify(data.error)}`
        );
      }
  
      const totalDuration = performance.now() - totalStart;
      console.log(`✅ Total uploadFile() took: ${totalDuration.toFixed(1)}ms`);
  
      setLastUploaded({
        uri: imageUri,
        originalUrl: imageUrl,
        processedUrl: data.url,
      });
      navigation.navigate('Search', { url: data.url, uri: imageUri });
    } catch (err) {
      console.error('Upload failed:', err);
      Alert.alert('Upload failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const handleUrlSearch = async (enteredUrl) => {
    const isValid = await validateUrl(enteredUrl);
    if (isValid) {
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

      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} overScrollMode='never' >
        <View style={styles.searchSection}>
          {selection === null && (
            <View style={styles.buttonRow}>
              {isUrlValid === false && <Text style={styles.errorText}>URL is not correct</Text>}
              <Button onPress={handleImage} icon="image" text="Image" />
              <Text style={{ color: 'white', marginTop: 10 }}>Or</Text>
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
                  <FontAwesome name="gear" size={20} color="#0f0f0f" />
                </TouchableOpacity>
                {isLoading && (
                  <View style={styles.loadingOverlayImage}>
                    <ActivityIndicator size="large" color="white" />
                  </View>
                )}
              </View>
              <Button onPress={() => uploadFile({ imageUri: image })} icon="image-search-outline" text="Search" />
              <Button onPress={handleImage} icon="image" text="Change" />
            </>
          )}
          {selection === "url" && (
            <>
              {isUrlValid ? (
                <View style={styles.imageWrapper}>
                  <Image source={{ uri: urlText }} style={styles.image} />
                  <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(true)}>
                    <FontAwesome name="gear" size={20} color="#0f0f0f" />
                  </TouchableOpacity>
                  {isLoading && (
                    <View style={styles.loadingOverlayImage}>
                      <ActivityIndicator size="large" color="white" />
                    </View>
                  )}
                </View>
              ) : (
                isUrlValid === false && <Text style={styles.errorText}>Invalid URL</Text>
              )}
              <Button onPress={() => uploadFile({ imageUrl: urlText })} icon="image-search-outline" text="Search" />

              <AnimatedSearchButton
                urlText={urlText}
                setUrlText={setUrlText}
                handleSearch={handleUrlSearch}
              />
            </>
          )}
        </View>

        <View style={styles.articlesSection}>
          <Text style={{ fontSize: 21, color: 'white', margin: 20, fontWeight: 'bold' }}>Articles</Text>
          {articles.map((item, index) => (
            <ArticleItem key={index} item={item} />
          ))}
        </View>
        <Footer />
      </ScrollView>
      <ModalComponent visible={modalVisible} onClose={() => setModalVisible(false)} isUrl={isUrlValid} />
    </SafeAreaView>
  );
};

export default HomeScreen;

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  header: {
    flexDirection: 'row',
    margin: 20,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  searchSection: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: height * 0.35,
  },
  articlesSection: {
    width: '100%',
    paddingVertical: 10,
  },
  buttonRow: {
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  imageWrapper: {
    width: 150,
    height: 150,
    overflow: 'hidden',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  errorText: {
    color: '#ff3939',
    marginTop: 10,
    padding: 10,
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
    borderRadius: 20,
  },
  modalButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    height: 30,
    width: 30,
    borderRadius: 50,
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
