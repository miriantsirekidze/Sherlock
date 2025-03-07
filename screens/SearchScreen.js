import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { useNavigation } from '@react-navigation/native';
import store$ from '../state';

import Bing from '../components/Bing';
import Yandex from '../components/Yandex';
import TinEye from '../components/TinEye';
import Trace from '../components/Trace';
import Pimeyes from '../components/Pimeyes';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Lens from '../components/Lens';

const SearchScreen = ({ route }) => {
  const navigation = useNavigation();
  NavigationBar.setBackgroundColorAsync('#333');

  const { url, uri } = route.params;

  // Global states (for URL, title, and bookmarking) remain
  const [currentUrl, setCurrentUrl] = useState(store$.currentUrl.get());
  const [currentTitle, setCurrentTitle] = useState("Title Placeholder");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAnime, setIsAnime] = useState(store$.anime.get());
  const [activeComponent, setActiveComponent] = useState(
    isAnime ? 'Trace' : store$.defaultEngine.get()
  );

  // Track each engine's URL separately
  const [engineUrls, setEngineUrls] = useState({
    Lens: null,
    Bing: null,
    Yandex: null,
    TinEye: null,
    Trace: null,
    Pimeyes: null,
  });

  // Track each engine's title separately
  const [engineTitles, setEngineTitles] = useState({
    Lens: "Lens",
    Bing: "Bing",
    Yandex: "Yandex",
    TinEye: "Tineye",
    Trace: "Trace",
    Pimeyes: "Pimeyes",
  });

  // Update the global URL when the active engine's URL changes.
  useEffect(() => {
    setCurrentUrl(engineUrls[activeComponent]);
  }, [activeComponent, engineUrls]);

  // Update the global title when the active engine's title changes.
  useEffect(() => {
    setCurrentTitle(engineTitles[activeComponent]);
  }, [activeComponent, engineTitles]);

  // Update isBookmarked based on currentUrl.
  useEffect(() => {
    if (currentUrl) {
      setIsBookmarked(store$.isBookmarked(currentUrl));
    }
  }, [currentUrl]);

  // Update anime state and active component when SearchScreen loads.
  useEffect(() => {
    setIsAnime(store$.anime.get());
    setActiveComponent(isAnime ? 'Trace' : store$.defaultEngine.get());
  }, []);

  // Callback to update a specific engine's URL.
  const handleUrlChange = (engine) => (url) => {
    setEngineUrls((prev) => ({ ...prev, [engine]: url }));
  };

  // Callback to update a specific engine's title.
  const handleTitleChange = (engine) => (title) => {
    setEngineTitles((prev) => ({ ...prev, [engine]: title }));
  };

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

  // Define each WebView component with its individual callbacks.
  const components = {
    Lens: (
      <Lens
        uri={url}
        onUrlChange={handleUrlChange('Lens')}
        onTitleChange={handleTitleChange('Lens')}
      />
    ),
    Bing: (
      <Bing
        uri={url}
        onUrlChange={handleUrlChange('Bing')}
        onTitleChange={handleTitleChange('Bing')}
      />
    ),
    Yandex: (
      <Yandex
        uri={url}
        onUrlChange={handleUrlChange('Yandex')}
        onTitleChange={handleTitleChange('Yandex')}
      />
    ),
    TinEye: (
      <TinEye
        uri={url}
        onUrlChange={handleUrlChange('TinEye')}
        onTitleChange={handleTitleChange('TinEye')}
      />
    ),
    Trace: (
      <Trace
        uri={url}
        onUrlChange={handleUrlChange('Trace')}
        onTitleChange={handleTitleChange('Trace')}
      />
    ),
    Pimeyes: (
      <Pimeyes
        uri={uri}
        onUrlChange={handleUrlChange('Pimeyes')}
        onTitleChange={handleTitleChange('Pimeyes')}
      />
    ),
  };

  // Define the tab buttons.
  const allButtons = [
    { img: require('../assets/icons/lens.png'), key: 'Lens' },
    { img: require('../assets/icons/yandex.png'), key: 'Yandex' },
    { img: require('../assets/icons/bing.png'), key: 'Bing' },
    { img: require('../assets/icons/tineye.png'), key: 'TinEye' },
    { img: require('../assets/icons/trace.png'), key: 'Trace' },
    { img: require('../assets/icons/pimeyes.png'), key: 'Pimeyes' },
  ];

  // Filter out Trace if anime mode is off.
  let filteredButtons = allButtons.filter(
    (button) => !(button.key === 'Trace' && !isAnime)
  );

  // Reorder buttons: bookmark first, then default engine (and Trace if anime), then the remaining, then home.
  const reorderedButtons = [
    { type: 'bookmark' },
    ...(isAnime ? [{ ...filteredButtons.find((btn) => btn.key === 'Trace') }] : []),
    { ...filteredButtons.find((btn) => btn.key === store$.defaultEngine.get()) },
    ...filteredButtons.filter(
      (btn) => btn.key !== 'Trace' && btn.key !== store$.defaultEngine.get()
    ),
    { type: 'home' },
  ].filter(Boolean);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" translucent={false} />

      {/* Render all WebViews concurrently; only the active one is visible */}
      <View style={styles.webViewContainer}>
        {Object.keys(components).map((key) => (
          <View
            key={key}
            style={[
              styles.webView,
              key === activeComponent ? styles.activeWebView : styles.inactiveWebView,
            ]}
          >
            {components[key]}
          </View>
        ))}
      </View>

      {/* Bottom Tab Bar */}
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
              ) : item.type === 'home' ? (
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
                    activeComponent === item.key && styles.activeButton,
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
  webViewContainer: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  activeWebView: {
    zIndex: 1,
    opacity: 1,
  },
  inactiveWebView: {
    zIndex: 0,
    opacity: 0,
  },
  buttonContainer: {
    height: 55,
    backgroundColor: '#333',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 2,
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
});
