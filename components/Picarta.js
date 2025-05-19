import React, { useRef, useEffect, useState, useCallback } from 'react';
import { BackHandler, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

const Picarta = ({ url }) => {
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

  const injectionScriptURLFlow = `
    (function() {
      if (sessionStorage.getItem('SEARCH_CLICKED')) return;
      let attempts = 0;
      const intervalInput = setInterval(() => {
        attempts++;
        const input = document.querySelector('input#photo-url-input.form-control.link-search');
        if (input) {
          clearInterval(intervalInput);
          input.value = '${url}';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
          let attemptsBtn = 0;
          const intervalBtn = setInterval(() => {
            attemptsBtn++;
            const btn = document.querySelector('button#search-btn');
            if (btn && !btn.disabled) {
              clearInterval(intervalBtn);
              btn.click();
              sessionStorage.setItem('SEARCH_CLICKED', 'true');
              window.ReactNativeWebView.postMessage('SEARCH_CLICK: Search button clicked');
            }
            if (attemptsBtn > 50) clearInterval(intervalBtn);
          }, 100);
        }
        if (attempts > 50) clearInterval(intervalInput);
      }, 100);
    })();
    true;
  `;


  const handleLoad = () => {
    try {
      if (webViewRef.current) {
        if (url) {
          webViewRef.current.injectJavaScript(injectionScriptURLFlow);
        }
      }
    } catch (err) {

    }
  };

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: 'https://picarta.ai' }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      onNavigationStateChange={(state) => setCanGoBack(state.canGoBack)}
      onLoad={handleLoad}
    />
  );
};

export default Picarta;
