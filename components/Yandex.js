import React, { useCallback, useEffect, useState, useRef } from 'react';
import { BackHandler, Platform } from 'react-native';
import WebView from 'react-native-webview';
import store$ from '../state';

const Yandex = ({ url, onUrlChange, onTitleChange }) => {
  const [canGoBack, setCanGoBack] = useState(false);
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
  }, [onAndroidBackPress]);

  const handleMessage = (event) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.type === "title" && message.title && onTitleChange) {
        onTitleChange(message.title); 
      }
    } catch (error) {
      console.warn("Error parsing message from WebView:", error);
    }
  }

  const handleNavigationStateChange = (state) => {
    store$.currentUrl.set(state.url); 
    setCanGoBack(state.canGoBack);

    if (onUrlChange) {
      onUrlChange(state.url);
    }

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
      source={{ uri: `https://yandex.com/images/search?source=collections&&url=${url}&rpt=imageview&lang=en`, }}
      ref={webViewRef}
      allowsBackForwardNavigationGestures
      onNavigationStateChange={handleNavigationStateChange}
      setSupportMultipleWindows={false}
      nestedScrollEnabled={true}
      cacheMode="LOAD_CACHE_ELSE_NETWORK"
      javaScriptEnabled={true}
      domStorageEnabled={true}
      onMessage={handleMessage}
    />
  );
};

export default Yandex;