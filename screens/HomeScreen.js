import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as NavigationBar from 'expo-navigation-bar';

import Button from '../components/Button';
import Tips from '../components/Tips';
import Toggle from '../components/Toggle'

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');

const HomeScreen = () => {

  NavigationBar.setBackgroundColorAsync('#333');

  const [image, setImage] = useState(null);
  const [lastUploaded, setLastUploaded] = useState({ uri: null, url: null }); // Cache
  const [progress, setProgress] = useState(0);

  const text = image ? <Toggle label={'General Search'}/> : 'Please choose an image';
  const title = image ? 'Pick Another' : 'Pick';

  const navigation = useNavigation();

  const handleImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      aspect: [4, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (image === lastUploaded.uri) {
      navigation.navigate('Search', { url: lastUploaded.url });
      return;
    }

    const response = await fetch(image);
    const blob = await response.blob();
    const storageRef = ref(storage, 'Images/' + new Date().getTime());
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress.toFixed());
      },
      (error) => {
        console.error('An error occurred', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setLastUploaded({ uri: image, url: downloadURL });
          navigation.navigate('Search', { url: downloadURL });
        });
      }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', margin: 20 }}>
        <TouchableOpacity style={{ marginRight: 15 }} onPress={() => navigation.navigate("Saved")}>
          <MaterialIcons name="bookmark-border" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <AntDesign name="setting" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} >
        <View style={styles.topSection}>
          <View style={[image && styles.imageContainer]}>
            {image && <Image source={{ uri: image }} style={styles.image} />}
          </View>
          <Text style={styles.text}>{text}</Text>
          <View style={styles.buttonRow}>
            <Button onPress={handleImage} icon="image" text={title} />
            {image && (<Button onPress={uploadImage} icon="link-2" text="Search" />)}
          </View>
        </View>
        <View style={styles.tipsSection}>
          <Text style={{ margin: 15, fontSize: 20, fontWeight: 'bold', color: '#fff' }}>Tips</Text>
          <Tips />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  scrollContent: {
    flexGrow: 1,
  },
  topSection: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: height * 0.5,
    paddingVertical: 20,
  },
  text: {
    color: '#EEE',
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
  },
  imageContainer: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#ccc',
    backgroundColor: '#00000035',
    alignItems: 'center',
    width: 200,
    height: 200
  },
  image: {
    width: "100%",
    height: "100%",
  },
  tipsSection: {
    width: '100%',
    paddingBottom: 20,
  },
});
