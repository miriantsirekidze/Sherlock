import React, { useCallback, useEffect, useState, useRef } from 'react';
import { BackHandler, Platform } from 'react-native';
import WebView from 'react-native-webview';
import store$ from '../state';
import { useNavigation } from '@react-navigation/native';

const Trace = ({ url, onUrlChange, onTitleChange }) => {
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

  const injectionRemoveSearchBar = `
    (function() {
      try {
        var el = document.querySelector('.search-bar_searchBarReady__c3QHR');
        if (el) el.remove();
      } catch (e) {
        // silently ignore
      }
    })();
    true;
  `;

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

    if (onUrlChange) {
      onUrlChange(state.url);
    }

    // re-post the document.title
    try {
      webViewRef.current?.injectJavaScript(`
        (function() {
          try {
            const title = document.title;
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: "title", title }));
          } catch(e){}
        })();
        true;
      `);
    } catch (err) {
      // ignore
    }
  };

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: `https://trace.moe/?auto&url=${url}` }}
      allowsBackForwardNavigationGestures
      onNavigationStateChange={handleNavigationStateChange}
      setSupportMultipleWindows={false}
      nestedScrollEnabled={true}
      cacheMode="LOAD_CACHE_ELSE_NETWORK"
      javaScriptEnabled={true}
      domStorageEnabled={true}
      onMessage={handleMessage}
      onLoadEnd={() => {
        try {
          webViewRef.current?.injectJavaScript(injectionRemoveSearchBar);
        } catch (err) { }
      }}
    />
  );
};

export default Trace;
