import React, { useCallback, useEffect, useState, useRef } from 'react';
import { BackHandler, Platform } from 'react-native';
import WebView from 'react-native-webview';
import store$ from '../state';

const Images = ({ url, onUrlChange, onTitleChange }) => {
  const [canGoBack, setCanGoBack] = useState(true);
  const webViewRef = useRef(null);

  const onAndroidBackPress = useCallback(() => {
    if (canGoBack) {
      webViewRef.current?.goBack();
      return true; 
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

  const fullyEncodeUrl = (url) => encodeURIComponent(url);
  const encodedUrl = fullyEncodeUrl(url);

  const buildFinalURL = (baseUrl) => {
    const filters = store$.getFilterString();
    return `${baseUrl}${filters}`;
  };
  
  const baseUrl = `https://www.google.com/searchbyimage?image_url=${encodedUrl}&client=firefox-b-d'`;
  const finalUrl = buildFinalURL(baseUrl);
  
  const handleMessage = (event) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.type === "title" && message.title && onTitleChange) {
        onTitleChange(message.title);
      }
    } catch (error) {
      console.warn("Error parsing message from WebView:", error);
    }
  };

  const handleNavigationStateChange = (state) => {
    store$.currentUrl.set(state.url);
    setCanGoBack(state.canGoBack);
    if (onUrlChange) onUrlChange(state.url);

    webViewRef.current?.injectJavaScript(`
      (function() {
        const title = document.title;
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: "title", title }));
      })();
      true;
    `);
  };

  return (
    <WebView
      source={{ uri: finalUrl }}
      ref={webViewRef}
      allowsBackForwardNavigationGestures
      onNavigationStateChange={handleNavigationStateChange}
      onMessage={handleMessage}
    />
  );
};

export default Images;
