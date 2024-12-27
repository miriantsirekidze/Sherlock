import React, { useCallback, useEffect, useState, useRef } from 'react';
import { BackHandler, Platform } from 'react-native';
import WebView from 'react-native-webview'
import store$ from '../state';

const Bing = ({ uri }) => {

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

  return (
    <WebView
      source={{ uri: `https://www.bing.com/images/search?view=detailv2&iss=sbi&form=SBIVSP&sbisrc=UrlPaste&q=imgurl:${uri}` }}
      ref={webViewRef}
      allowsBackForwardNavigationGestures
      onNavigationStateChange={(state) => {
        store$.currentUrl.set(state.url); // Update global state
        setCanGoBack(state.canGoBack);
      }}
    />
  )
}

export default Bing