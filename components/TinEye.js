import React, { useCallback, useEffect, useState, useRef } from 'react';
import { BackHandler, Platform } from 'react-native';
import WebView from 'react-native-webview';
import store$ from '../state';
import { useNavigation } from '@react-navigation/native';

const TinEye = ({ url, onUrlChange, onTitleChange }) => {
  const [canGoBack, setCanGoBack] = useState(false);
  const webViewRef = useRef(null);
  const navigation = useNavigation();

  const onAndroidBackPress = useCallback(() => {
    if (canGoBack) {
      webViewRef.current?.goBack();
      return true;
    }
    navigation.goBack();
    return true;
  }, [canGoBack, navigation]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onAndroidBackPress);
      };
    }
  }, [onAndroidBackPress]);

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
      source={{ uri: `https://www.tineye.com/search?url=${url}` }}
      ref={webViewRef}
      allowsBackForwardNavigationGestures
      onNavigationStateChange={handleNavigationStateChange}
      setSupportMultipleWindows={false}
      nestedScrollEnabled={true}
      cacheMode="LOAD_CACHE_ELSE_NETWORK"
      thirdPartyCookiesEnabled={true}
      sharedCookiesEnabled={true}
      javaScriptEnabled={true}
      userAgent="Mozilla/5.0 (Linux; Android 11; Pixel 4 XL Build/RP1A.200720.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Mobile Safari/537.36"
      domStorageEnabled={true}
      onMessage={(event) => {
        try {
          const message = JSON.parse(event.nativeEvent.data);
          if (message.type === "title" && message.title && onTitleChange) {
            onTitleChange(message.title);
          }
        } catch (error) {
          console.warn("Error parsing message from WebView:", error);
        }
      }}
    />
  );
};

export default TinEye;