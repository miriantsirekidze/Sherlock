import React, { useState, useRef, useCallback, useEffect } from 'react';
import { BackHandler, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

const WebViewScreen = ({ route }) => {
  const { url } = route.params;
  const [canGoBack, setCanGoBack] = useState(false);
  const [pageTitle, setPageTitle] = useState("Loading...");
  const webViewRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: pageTitle, // Set the dynamic title
      headerTitleStyle: {
        fontSize: 18,
      },
    });
  }, [navigation, pageTitle]);

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

  const handleNavigationStateChange = (state) => {
    setCanGoBack(state.canGoBack);

    // Inject JavaScript to get the page title
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
      source={{ uri: url }}
      ref={webViewRef}
      allowsBackForwardNavigationGestures
      onNavigationStateChange={handleNavigationStateChange}
      onMessage={(event) => {
        try {
          const message = JSON.parse(event.nativeEvent.data);
          if (message.type === "title" && message.title) {
            setPageTitle(message.title); // Update the header title dynamically
          }
        } catch (error) {
          console.warn("Error parsing message from WebView:", error);
        }
      }}
    />
  );
};

export default WebViewScreen;
