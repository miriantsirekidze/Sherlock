import React, {useEffect} from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ToastAndroid, Image } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useSelector } from '@legendapp/state/react'; // Import useSelector hook
import store$ from '../state';

SplashScreen.preventAutoHideAsync();

import { useNavigation } from '@react-navigation/native';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const SavedScreen = () => {
  const navigation = useNavigation();

const [loaded, error] = useFonts({
    'CaudexBold': require('../assets/fonts/CaudexBold.ttf'),
    'CaudexBoldItalic': require('../assets/fonts/CaudexBoldItalic.ttf'),
    'CaudexItalic': require('../assets/fonts/CaudexItalic.ttf'),
    'CaudexRegular': require('../assets/fonts/CaudexRegular.ttf')
  });

  useEffect(() => {
      if (loaded || error) {
        SplashScreen.hideAsync();
      }
    }, [loaded, error]);
  
    if (!loaded && !error) {
      return null;
    }

  // Use useSelector to subscribe to changes in store$.urls
  const urls = useSelector(() => store$.urls).map((item) => ({
    id: item?.id || Date.now(), // Provide a fallback for id
    title: item?.title || "Untitled", // Handle missing title
    url: item?.url?.value || item?.url || "Invalid URL", // Safely extract url value
    date: item?.date || "Unknown Date", // Provide a default date
  }));

  const openBookmark = (url) => {
    if (url !== "Invalid URL") {
      navigation.navigate("WebViewScreen", { url });
    } else {
      alert("This URL is invalid.");
    }
  };

  const handleDelete = (url) => {
    console.log("Attempting to delete URL:", url);
    const currentUrls = store$.urls.get();
    const updatedUrls = currentUrls.filter((item) => item.url?.value !== url && item.url !== url);
    store$.urls.set(updatedUrls); // Update the observable array
    console.log("Updated URLs after deletion:", store$.urls.get());
  };

  const copyToClipboard = async (url) => {
    if (url && url !== "Invalid URL") {
      await Clipboard.setStringAsync(url);
      ToastAndroid.show("URL copied to clipboard.", ToastAndroid.SHORT);
    } else {
      ToastAndroid.show("This URL is invalid.", ToastAndroid.SHORT);
    }
  };

  const renderEmptyComponent = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image source={require('../assets/images/bookmarks.png')} style={{height: 200, width: '60%'}} />
        <Text style={styles.emptyMessage}>No bookmarks saved yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={urls}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
              <Text style={[styles.top, {fontSize: 16}]}>{index + 1}.</Text>
              <Text style={[styles.top, { marginLeft: 10}]}>{item.date}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">{item.title}</Text>
              <TouchableOpacity onPress={() => copyToClipboard(item.url)}>
                <MaterialCommunityIcons name="content-copy" size={20} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.url} numberOfLines={1}>{item.url}</Text>
            <View style={styles.buttons}>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => openBookmark(item.url, item.title)}>
                  <Text style={styles.buttonText}>Open</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.url)}>
                <MaterialIcons name="delete-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={renderEmptyComponent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    marginBottom: 20
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 5,
  },
  top: {
    fontWeight: '600', 
    color: '#ca9bf7'
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    maxWidth: '70%',
    color: 'white',
  },
  url: {
    color: '#ca9bf7',
    marginVertical: 5,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#fff',
    fontFamily: 'CaudexRegular',
  },
});

export default SavedScreen;
