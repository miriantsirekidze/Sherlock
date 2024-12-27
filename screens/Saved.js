import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useObservable } from "@legendapp/state/react";
import store$ from '../state';
import WebView from 'react-native-webview';


const SavedScreen = ({ navigation }) => {
  const urls = useObservable(() => store$.urls.get()); // Use `.get()` to dereference the observable array
  console.log("Saved URLs:", store$.urls.get());

  console.log(store$.urls.get());
  const openBookmark = (url) => {
    <WebView
      source={{ uri: url }}
    />
  };

  return (
    <FlatList
      data={store$.urls.get() || []} // Ensure data is an array
      keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
      renderItem={({ item }) => (
        <View style={{ padding: 10, borderBottomWidth: 1 }}>
          <Text>{item.title || "Untitled"}</Text>
          <Text>{item.url}</Text>
          <TouchableOpacity onPress={() => openBookmark(item.url)}>
            <Text>Open</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => store$.removeUrl(item.url)}>
            <Text>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    />


  );
};


export default SavedScreen;
