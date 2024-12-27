import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useObservable } from "@legendapp/state/react";
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import store$ from '../state';

import Lens from '../components/Lens';
import Bing from '../components/Bing';
import GoogleImages from '../components/GoogleImages';
import Yandex from '../components/Yandex';
import TinEye from '../components/TinEye';
import Trace from '../components/Trace';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const SearchScreen = ({ route }) => {
  NavigationBar.setBackgroundColorAsync('#333');
  const [activeComponent, setActiveComponent] = useState('Lens');

  const { url } = route.params;
  const navigation = useNavigation();
  const encodedUrl = encodeURI(url);

  // Update the current URL in the store when URL changes
  useEffect(() => {
    store$.currentUrl.set(url); // Update current URL
  }, [url]);

  // Get currentUrl from the observable state
  const currentUrl = useObservable(() => store$.currentUrl.get());
  
  // Keep track of bookmark state for the current URL
  const [isBookmarked, setIsBookmarked] = useState(store$.isBookmarked(currentUrl));

  // Recalculate isBookmarked whenever the current URL changes
  useEffect(() => {
    setIsBookmarked(store$.isBookmarked(currentUrl));
  }, [currentUrl]);

  // Toggle bookmark status when the button is pressed
  const toggleBookmark = () => {
    const current = store$.currentUrl.get();
    if (isBookmarked) {
      store$.removeUrl(current); // Remove from bookmarks
      setIsBookmarked(false);
    } else {
      store$.addUrl(current, "Title Placeholder"); // Add to bookmarks
      setIsBookmarked(true);
    }
  };

  useEffect(() => {
    console.log("Current URL:", store$.currentUrl.get());
    console.log("Is Bookmarked:", store$.isBookmarked(currentUrl));
    console.log("Saved URLs:", store$.urls.get());
  }, [currentUrl, isBookmarked]);

  // Mapping components to show
  const components = {
    Lens: <Lens uri={encodedUrl} />,
    Bing: <Bing uri={encodedUrl} />,
    GoogleImages: <GoogleImages uri={encodedUrl} />,
    Yandex: <Yandex uri={encodedUrl} />,
    TinEye: <TinEye uri={encodedUrl} />,
    Trace: <Trace uri={encodedUrl} />,
  };

  const buttons = [
    { img: require('../assets/icons/lens.png'), key: 'Lens' },
    { img: require('../assets/icons/yandex.png'), key: 'Yandex' },
    { img: require('../assets/icons/google.png'), key: 'GoogleImages' },
    { img: require('../assets/icons/bing.png'), key: 'Bing' },
    { img: require('../assets/icons/tineye.png'), key: 'TinEye' },
    { img: require('../assets/icons/trace.png'), key: 'Trace' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" translucent={false} />
      <View style={styles.webViewContainer}>
        {components[activeComponent]}
      </View>
      <View style={styles.buttonContainer}>
        <FlatList
          data={buttons}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <View style={styles.buttonWrapper}>
              {item.key === 'Lens' && (
                <TouchableOpacity onPress={toggleBookmark} style={styles.bookmarkButton}>
                  <MaterialCommunityIcons
                    name={isBookmarked ? "bookmark-check-outline" : "bookmark-outline"}
                    size={30}
                    color="white"
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[
                  styles.button,
                  activeComponent === item.key && styles.activeButton,
                ]}
                onPress={() => setActiveComponent(item.key)}
              >
                <Image style={{ height: 30, width: 30 }} source={item.img} />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue', // Debugging color
  },
  buttonContainer: {
    height: 55,
    backgroundColor: '#333',
    position: 'absolute',
    bottom: 0, // Position at the bottom
    width: '100%', // Take full width
    zIndex: 1,
    flexDirection: 'row',
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
    borderRadius: 5,
    backgroundColor: '#555',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: '#ca9bf7', //ca9bf7 00FF80
  },
  bookmarkButton: {
    marginHorizontal: 10,
  },
  webViewContainer: {
    flex: 1, // Take up all remaining space
    backgroundColor: 'red', // Debugging color
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#333',
  },
  title: {
    color: 'white',
    fontSize: 16,
  },
});