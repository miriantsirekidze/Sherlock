import React, { useCallback, useEffect, useState, useRef } from 'react';
import { BackHandler, Platform } from 'react-native';
import WebView from 'react-native-webview';
import store$ from '../state';
import { useNavigation } from '@react-navigation/native';

const Lens = ({ url, onUrlChange, onTitleChange }) => {
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

  const handleMessage = event => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.type === 'title' && message.title && onTitleChange) {
        onTitleChange(message.title);
      }
    } catch (error) {
      console.warn('Error parsing message from WebView:', error);
    }
  };

  const handleNavigationStateChange = state => {
    store$.currentUrl.set(state.url);
    setCanGoBack(state.canGoBack);
    onUrlChange?.(state.url);

    webViewRef.current?.injectJavaScript(`
      (function() {
        const title = document.title;
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'title', title }));
      })();
      true;
    `);
  };

  const encodedUrl = encodeURIComponent(url).replace(/%20/g, '+');

  return (
    <WebView
      source={{ uri: `https://lens.google.com/uploadbyurl?url=${encodedUrl}` }}
      ref={webViewRef}
      allowsBackForwardNavigationGestures
      onNavigationStateChange={handleNavigationStateChange}
      setSupportMultipleWindows={false}
      nestedScrollEnabled
      cacheMode="LOAD_NO_CACHE"
      javaScriptEnabled
      domStorageEnabled
      onMessage={handleMessage}
    />
  );
};

export default Lens;
