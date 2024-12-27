import React, { useCallback, useEffect, useState, useRef } from 'react';
import { BackHandler, Platform } from 'react-native';
import WebView from 'react-native-webview'
import store$ from '../state';

const Yandex = ({uri}) => {

  const [canGoBack, setCanGoBack] = useState(false); // Default to false
    const webViewRef = useRef(null);
  
    const onAndroidBackPress = useCallback(() => {
      if (canGoBack) {
        webViewRef.current?.goBack(); // Navigate back in WebView history
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

  return (
    <WebView
      source={{uri: `https://yandex.com/images/search?source=collections&&url=${uri}&rpt=imageview`}}
      ref={webViewRef}
      allowsBackForwardNavigationGestures
      onNavigationStateChange={(state) => {
        store$.currentUrl.set(state.url); // Update global state
        setCanGoBack(state.canGoBack);
      }}
    />
  )
}

export default Yandex