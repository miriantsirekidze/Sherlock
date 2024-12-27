import React, { useCallback, useEffect, useState, useRef } from 'react';
import { BackHandler, Platform } from 'react-native';
import WebView from 'react-native-webview'
import store$ from '../state';

const GoogleImages = ({uri}) => {

  const [canGoBack, setCanGoBack] = useState(true);
    const webViewRef = useRef(null);
  
    const onAndroidBackPress = useCallback(() => {
      if (canGoBack) {
        webViewRef.current?.goBack();
        return true; // prevent default behavior (exit app)
      }
      return false;
    }, [canGoBack]);
  
    useEffect(() => {
      if (Platform.OS === 'android') {
        BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
        return () => {
          BackHandler.removeEventListener('hardwareBackPress', onAndroidBackPress);
        };
      }
    }, []);

  const fullyEncodeUrl = (url) => {
    return encodeURIComponent(url);
  };

  const url = fullyEncodeUrl(uri)

  return (
    <WebView
      source={{uri: `https://www.google.com/searchbyimage?image_url=${url}&client=firefox-b-d`}}
      ref={webViewRef}
      allowsBackForwardNavigationGestures
      onNavigationStateChange={(state) => {
        store$.currentUrl.set(state.url); // Update global state
        setCanGoBack(state.canGoBack);
      }}
    />
  )
}

export default GoogleImages