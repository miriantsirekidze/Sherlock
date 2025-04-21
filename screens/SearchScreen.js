import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Image, ToastAndroid } from 'react-native';
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
import Mever from '../components/Mever';
import Picarta from '../components/Picarta';
import Images from '../components/Images';
import Copyseeker from '../components/Copyseeker';

import LoadingOverlay from '../components/LoadingOverlay';

const SearchScreen = ({ route }) => {
  const navigation = useNavigation();
  NavigationBar.setBackgroundColorAsync('#333');

  const { url, uri } = route.params;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const encodedUrl = encodeURI(url);

  const [currentUrl, setCurrentUrl] = useState(store$.currentUrl.get());
  const [currentTitle, setCurrentTitle] = useState("Title Placeholder");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAnime, setIsAnime] = useState(store$.anime.get());
  const [isImageCheck, setIsImageCheck] = useState(store$.imageCheck.get());
  const [isLocation, setIsLocation] = useState(store$.location.get())
  const [isPimeyes, setIsPimeyes] = useState(store$.pimeyes.get())
  const [activeComponent, setActiveComponent] = useState(
    isImageCheck ? 'Mever' : isLocation ? 'Picarta' : isPimeyes ? 'Pimeyes' : isAnime ? 'Trace' : store$.defaultEngine.get()
  );

  const [engineUrls, setEngineUrls] = useState({
    Lens: null,
    Images: null,
    Bing: null,
    Yandex: null,
    TinEye: null,
    Trace: null,
    Pimeyes: null,
    Mever: null,
    Picarta: null,
    Copyseeker: null
  });

  const [engineTitles, setEngineTitles] = useState({
    Lens: "Lens",
    Images: 'Images',
    Bing: "Bing",
    Yandex: "Yandex",
    TinEye: "Tineye",
    Trace: "Trace",
    Pimeyes: "Pimeyes",
    Mever: "Mever",
    Picarta: 'Picarta',
    Copyseeker: 'Copyseeker',
  });

  useEffect(() => {
    setCurrentUrl(engineUrls[activeComponent]);
  }, [activeComponent, engineUrls]);

  useEffect(() => {
    setCurrentTitle(engineTitles[activeComponent]);
  }, [activeComponent, engineTitles]);

  useEffect(() => {
    if (currentUrl) {
      setIsBookmarked(store$.isBookmarked(currentUrl));
    }
  }, [currentUrl]);

  useEffect(() => {
    setIsAnime(store$.anime.get());
    setIsImageCheck(store$.imageCheck.get());
    setIsPimeyes(store$.pimeyes.get())
    setIsLocation(store$.location.get())
    if (store$.imageCheck.get() && !(store$.pimeyes.get())) {
      setActiveComponent('Mever');
    } else if (store$.anime.get()) {
      setActiveComponent('Trace');
    } else if (store$.location.get()) {
      setActiveComponent('Picarta')
    } else if (store$.pimeyes.get()) {
      setActiveComponent('Pimeyes')
    } else {
      setActiveComponent(store$.defaultEngine.get());
    }
  }, []);

  const handleUrlChange = (engine) => (url) => {
    setEngineUrls((prev) => ({ ...prev, [engine]: url }));
  };


  const handleTitleChange = (engine) => (title) => {
    setEngineTitles((prev) => ({ ...prev, [engine]: title }));
  };

  const toggleBookmark = () => {
    if (!currentUrl) {
      ToastAndroid.show("Can't bookmark on this Website.", ToastAndroid.SHORT)
      return;
    }
    if (isBookmarked) {
      store$.removeUrl(currentUrl);
    } else {
      store$.addUrl(currentUrl, currentTitle || "Untitled");
    }
    setIsBookmarked(!isBookmarked);
  };

  const enabledComponents = {}

  enabledComponents['Lens'] = (
    <Lens
      url={encodedUrl}
      onUrlChange={handleUrlChange('Lens')}
      onTitleChange={handleTitleChange('Lens')}
    />
  )
  enabledComponents['Images'] = (
    <Images
      url={url}
      onUrlChange={handleUrlChange('Images')}
      onTitleChange={handleTitleChange('Images')}
    />
  )
  enabledComponents['Bing'] = (
    <Bing
      url={encodedUrl}
      onUrlChange={handleUrlChange('Bing')}
      onTitleChange={handleTitleChange('Bing')}
    />
  )
  enabledComponents['Yandex'] = (
    <Yandex
      url={encodedUrl}
      onUrlChange={handleUrlChange('Yandex')}
      onTitleChange={handleTitleChange('Yandex')}
    />
  )
  enabledComponents['TinEye'] = (
    <TinEye
      url={encodedUrl}
      onUrlChange={handleUrlChange('TinEye')}
      onTitleChange={handleTitleChange('TinEye')}
    />
  )
  enabledComponents['Copyseeker'] = (
    <Copyseeker
      uri={uri}
      url={url}
      onUrlChange={handleUrlChange('Copyseeker')}
      onTitleChange={handleTitleChange('Copyseeker')}
    />
  )
  if (uri && isPimeyes) {
    enabledComponents['Pimeyes'] = (
      <Pimeyes
        uri={uri}
        url={url}
        onUrlChange={handleUrlChange('Pimeyes')}
        onTitleChange={handleTitleChange('Pimeyes')}
      />
    )
  }
  if (isAnime) {
    enabledComponents['Trace'] = (
      <Trace
        uri={uri}
        url={url}
        onUrlChange={handleUrlChange('Trace')}
        onTitleChange={handleTitleChange('Trace')}
      />
    )
  }
  if (isImageCheck) {
    enabledComponents['Mever'] = (
      <Mever
        url={url}
        onUrlChange={handleUrlChange('Mever')}
        onTitleChange={handleTitleChange('Mever')}
      />
    )
  }
  if (isLocation) {
    enabledComponents['Picarta'] = (
      <Picarta
        uri={uri}
        url={url}
        onUrlChange={handleUrlChange('Picarta')}
        onTitleChange={handleTitleChange('Picarta')}
      />
    )
  }


  const enabledButtons = {};

  if (isAnime) {
    enabledButtons['Trace'] = { img: require('../assets/icons/trace.png'), key: 'Trace' };
  }
  if (Boolean(uri) && isPimeyes) {
    enabledButtons['Pimeyes'] = { img: require('../assets/icons/pimeyes.png'), key: 'Pimeyes' };
  }
  if (isImageCheck) {
    enabledButtons['Mever'] = { img: require('../assets/icons/mever.png'), key: 'Mever' };
  }
  if (isLocation) {
    enabledButtons['Picarta'] = { img: require('../assets/icons/picarta.png'), key: 'Picarta' }
  }
  enabledButtons['Lens'] = { img: require('../assets/icons/lens.png'), key: 'Lens' };
  enabledButtons['Images'] = { img: require('../assets/icons/google.png'), key: 'Images' }
  enabledButtons['Yandex'] = { img: require('../assets/icons/yandex.png'), key: 'Yandex' };
  enabledButtons['Bing'] = { img: require('../assets/icons/bing.png'), key: 'Bing' };
  enabledButtons['TinEye'] = { img: require('../assets/icons/tineye.png'), key: 'TinEye' };
  enabledButtons['Copyseeker'] = { img: require('../assets/icons/copyseeker.png'), key: 'Copyseeker' }

  const defaultComponentRef = useRef(activeComponent)
  const defaultComponentKey = defaultComponentRef.current;
  const engineButtons = Object.values(enabledButtons);
  const defaultEngineButton = engineButtons.find(btn => btn.key === defaultComponentKey);
  const otherEngineButtons = engineButtons.filter(btn => btn.key !== defaultComponentKey);

  const buttonArray = [
    { type: 'bookmark' },
    defaultEngineButton,
    ...otherEngineButtons,
    { type: 'home' }
  ];


  return (
    <View style={styles.container}>
      <StatusBar style="dark" translucent={false} />
      <View style={styles.webViewContainer}>
        {Object.keys(enabledButtons).map((key) => (
          <View
            key={key}
            style={[
              styles.webView,
              key === activeComponent ? styles.activeWebView : styles.inactiveWebView,
            ]}
          >
            {enabledComponents[key]}
          </View>
        ))}
      </View>

      {isLoading && <LoadingOverlay/>}

      <View style={styles.buttonContainer}>
        <FlatList
          data={buttonArray}
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