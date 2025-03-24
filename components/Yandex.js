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
      return true; // Prevent default back behavior
    }
    return false; // Allow default behavior (go back to the previous screen)
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
      source={{ uri: `https://yandex.com/images/search?source=collections&&url=${url}&rpt=imageview&lang=en`, }}
      ref={webViewRef}
      allowsBackForwardNavigationGestures
      onNavigationStateChange={handleNavigationStateChange}
      setSupportMultipleWindows={false}
      nestedScrollEnabled={true}
      cacheMode="LOAD_CACHE_ELSE_NETWORK"
      javaScriptEnabled={true}
      domStorageEnabled={true}
      userAgent="Mozilla/5.0 (Linux; Android 11; Pixel 4 XL Build/RP1A.200720.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Mobile Safari/537.36"
      onMessage={handleMessage}
    />
  );
};

export default Yandex;