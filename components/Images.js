import React, { useCallback, useEffect, useState, useRef } from 'react';
import { BackHandler, Platform } from 'react-native';
import WebView from 'react-native-webview'
import store$ from '../state';

const Images = ({ url, onUrlChange, onTitleChange }) => {

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
  const encodedUrl = fullyEncodeUrl(url)
  
  const handleMessage = (event) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.type === "title" && message.title && onTitleChange) {
        onTitleChange(message.title); // Pass the title to the parent component
      }
    } catch (error) {
      console.warn("Error parsing message from WebView:", error);
    }
  }

  const handleNavigationStateChange = (state) => {
    store$.currentUrl.set(state.url); // Update the global state
    setCanGoBack(state.canGoBack); // Update the `canGoBack` state

    if (onUrlChange) {
      onUrlChange(state.url);
    }

    // Inject JavaScript to extract the page title
    webViewRef.current?.injectJavaScript(`
      (function() {
        const title = document.title;
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: "title", title }));
      })();
      true; // Required for JavaScript to execute correctly
    `);
  };


  return (
    <WebView
      source={{ uri: `https://www.google.com/searchbyimage?image_url=${encodedUrl}&client=firefox-b-d` }}
      ref={webViewRef}
      allowsBackForwardNavigationGestures
      onNavigationStateChange={handleNavigationStateChange}
      onMessage={handleMessage}
    />
  )
}

export default Images