import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook
import store$ from '../state';

import Lens from '../components/Lens';
import Bing from '../components/Bing';
import Yandex from '../components/Yandex';
import TinEye from '../components/TinEye';
import Trace from '../components/Trace';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const SearchScreen = ({ route }) => {
  const navigation = useNavigation(); // Get navigation object

  NavigationBar.setBackgroundColorAsync('#333');

  const { url } = route.params;
  const encodedUrl = encodeURI(url);

  const [currentUrl, setCurrentUrl] = useState(store$.currentUrl.get());
  const [currentTitle, setCurrentTitle] = useState("Title Placeholder");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAnime, setIsAnime] = useState(store$.anime.get()); // Check if anime search is enabled

  // Set default search engine (Trace if anime is true, otherwise user's default)
  const [activeComponent, setActiveComponent] = useState(
    isAnime ? 'Trace' : store$.defaultEngine.get()
  );

  useEffect(() => {
    setIsAnime(store$.anime.get()); // Update anime state
    setActiveComponent(isAnime ? 'Trace' : store$.defaultEngine.get()); // Reset active engine when anime mode changes
  }, []);

  useEffect(() => {
    if (currentUrl) {
      setIsBookmarked(store$.isBookmarked(currentUrl));
    }
  }, [currentUrl]);

  const toggleBookmark = () => {
    if (!currentUrl) {
      console.warn("No URL to bookmark.");
      return;
    }
    if (isBookmarked) {
      store$.removeUrl(currentUrl);
    } else {
      store$.addUrl(currentUrl, currentTitle || "Untitled");
    }
    setIsBookmarked(!isBookmarked);
  };

  const components = {
    Lens: <Lens uri={encodedUrl} onUrlChange={setCurrentUrl} onTitleChange={setCurrentTitle} />,
    Bing: <Bing uri={encodedUrl} onUrlChange={setCurrentUrl} onTitleChange={setCurrentTitle} />,
    Yandex: <Yandex uri={encodedUrl} onUrlChange={setCurrentUrl} onTitleChange={setCurrentTitle} />,
    TinEye: <TinEye uri={encodedUrl} onUrlChange={setCurrentUrl} onTitleChange={setCurrentTitle} />,
    Trace: <Trace uri={encodedUrl} onUrlChange={setCurrentUrl} onTitleChange={setCurrentTitle} />,
  };

  const allButtons = [
    { img: require('../assets/icons/lens.png'), key: 'Lens' },
    { img: require('../assets/icons/yandex.png'), key: 'Yandex' },
    { img: require('../assets/icons/bing.png'), key: 'Bing' },
    { img: require('../assets/icons/tineye.png'), key: 'TinEye' },
    { img: require('../assets/icons/trace.png'), key: 'Trace' },
  ]

  // Filter out `Trace` if `anime` is false
  let filteredButtons = allButtons.filter((button) => !(button.key === 'Trace' && !isAnime));

  // Fix the button order (bookmark first, then default engine, then others, then home)
  const reorderedButtons = [
    { type: 'bookmark' }, // Bookmark button always first
    ...(isAnime ? [{ ...filteredButtons.find((btn) => btn.key === 'Trace') }] : []), // If anime is enabled, place `Trace` next
    { ...filteredButtons.find((btn) => btn.key === store$.defaultEngine.get()) }, // Default engine next
    ...filteredButtons.filter((btn) => btn.key !== 'Trace' && btn.key !== store$.defaultEngine.get()), // Remaining engines
    { type: 'home' }, // Home button always last
  ].filter(Boolean); // Remove undefined values

  return (
    <View style={styles.container}>
      <StatusBar style="dark" translucent={false} />
      <View style={styles.webViewContainer}>
        {components[activeComponent]}
      </View>
      <View style={styles.buttonContainer}>
        <FlatList
          data={reorderedButtons}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => item.key || `static-${index}`}
          renderItem={({ item }) => (
            <View style={styles.buttonWrapper}>
              {item.type === 'bookmark' ? (
                <TouchableOpacity onPress={toggleBookmark} style={styles.bookmarkButton}>
                  <MaterialCommunityIcons
                    name={isBookmarked ? "bookmark-check-outline" : "bookmark-outline"}
                    size={30}
                    color="white"
                  />
                </TouchableOpacity>
              ) : item.type === 'home' ? ( // Home button logic
                <TouchableOpacity
                  style={styles.homeButton}
                  onPress={() => navigation.goBack()}
                >
                  <MaterialCommunityIcons name="home-outline" size={30} color="white" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.button,
                    activeComponent === item.key && styles.activeButton, // Only change color, no movement
                  ]}
                  onPress={() => setActiveComponent(item.key)}
                >
                  <Image style={{ height: 30, width: 30 }} source={item.img} />
                </TouchableOpacity>
              )}
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
  },
  buttonContainer: {
    height: 55,
    backgroundColor: '#333',
    position: 'absolute',
    bottom: 0,
    width: '100%',
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
    backgroundColor: '#ca7bf1',
  },
  bookmarkButton: {
    marginHorizontal: 10,
  },
  homeButton: {
    marginHorizontal: 10,
  },
  webViewContainer: {
    flex: 1,
  },
});
