import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ToastAndroid, Image } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import store$ from '../state';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSelector } from '@legendapp/state/react';
import { useNavigation } from '@react-navigation/native';

const SavedScreen = () => {
  const navigation = useNavigation();

  const [recent, setRecent] = useState(true);

  const urls = useSelector(() => store$.urls).map((item) => ({
    id: item?.id || Date.now(),
    title: item?.title || "Untitled",
    url: item?.url?.value || item?.url || "Invalid URL",
    date: item?.date || "Unknown Date",
  }));

  const sortedUrls = useMemo(() => {
    const copied = [...urls];
    if (recent) {
      copied.sort((a, b) => b.id - a.id);
    } else {
      copied.sort((a, b) => a.id - b.id);
    }
    return copied;
  }, [urls, recent]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setRecent((prev) => !prev)} style={{ marginRight: 10, flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons
            name={recent ? 'sort-numeric-descending' : 'sort-numeric-ascending'}
            size={15}
            color="white"
            style={{ marginRight: 5 }}
          />
          <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>
            {recent ? 'Recent' : 'Oldest'}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, recent]);

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
    const updatedUrls = currentUrls.filter(
      (item) => item.url?.value !== url && item.url !== url
    );
    store$.urls.set(updatedUrls);
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
        <Image source={require('../assets/images/bookmarks.png')} style={{ height: 200, width: '60%' }} />
        <Text style={styles.emptyMessage}>No bookmarks saved yet.</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedUrls}
        style={{ marginBottom: 20 }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
              <Text style={[styles.top, { fontSize: 16 }]}>
                {recent ? sortedUrls.length - index : index + 1}.
              </Text>
              <Text style={[styles.top, { marginLeft: 10 }]}>{item.date}</Text>
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
                <TouchableOpacity onPress={() => openBookmark(item.url)}>
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
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
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
