import React, { useCallback, useEffect, useState, useRef } from 'react';
import { BackHandler, Platform, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import WebView from 'react-native-webview';
import store$ from '../state';

const MAX_RETRIES = 2; // Maximum number of reload attempts

const Lens = ({ url, onUrlChange, onTitleChange }) => {
  const [canGoBack, setCanGoBack] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const webViewRef = useRef(null);
  const retryTimeout = useRef(null);

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

  const handleNavigationStateChange = (state) => {
    setLoadError(false);
    store$.currentUrl.set(state.url);
    setCanGoBack(state.canGoBack);
    onUrlChange?.(state.url);

    webViewRef.current?.injectJavaScript(`
      (function() {
        const errorElement = document.querySelector('.error-message, [aria-label*="error"]');
        const hasError = errorElement ? errorElement.innerText.includes("no image") : false;
        
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: "pageStatus",
          title: document.title,
          error: hasError
        }));
      })();
    `);
  };

  const handleError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('WebView error:', nativeEvent);

    if (retryCount < MAX_RETRIES) {
      const delay = Math.pow(2, retryCount) * 1000;
      retryTimeout.current = setTimeout(() => {
        webViewRef.current?.reload();
        setRetryCount(c => c + 1);
      }, delay);
    } else {
      setLoadError(true);
    }
  };

  const handleHttpError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('HTTP Error:', nativeEvent.statusCode);
    handleError(syntheticEvent);
  };

  const handleMessage = (event) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);

      if (message.type === "pageStatus") {
        if (message.title && onTitleChange) {
          onTitleChange(message.title);
        }
        if (message.error && retryCount < MAX_RETRIES) {
          handleError({ nativeEvent: { description: "Lens error detected" } });
        }
      }
    } catch (error) {
      console.warn("Error parsing message:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (retryTimeout.current) clearTimeout(retryTimeout.current);
    };
  }, []);

  const encodedUrl = encodeURIComponent(url).replace(/%20/g, '+');

  return (
    <View style={styles.container}>
      {loadError && (
        <View style={styles.errorOverlay}>
          <Text style={styles.errorText}>
            {`Failed to load Google Lens after ${MAX_RETRIES} attempts. `}
            Exit and try again or check the image URL.
          </Text>
          <TouchableOpacity
            onPress={() => {
              setLoadError(false);
              setRetryCount(0);
              webViewRef.current?.reload();
            }}
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
      <WebView
        source={{ uri: `https://lens.google.com/uploadbyurl?url=${encodedUrl}` }}
        ref={webViewRef}
        allowsBackForwardNavigationGestures
        onNavigationStateChange={handleNavigationStateChange}
        onError={handleError}
        onHttpError={handleHttpError}
        setSupportMultipleWindows={false}
        nestedScrollEnabled={true}
        cacheMode="LOAD_NO_CACHE"
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={handleMessage}
        startInLoadingState={true}
        userAgent="Mozilla/5.0 (Linux; Android 11; Pixel 4 XL Build/RP1A.200720.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Mobile Safari/537.36"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#ca7bf1',
    borderRadius: 5,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Lens;