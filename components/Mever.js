import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Dimensions, Platform, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import store$ from '../state';

export default function Mever({ url, onUrlChange, onTitleChange }) {
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

  const generateInjectionScript = useCallback(() => {
    if (!url) return '';
    return `
      (function() {
        try {
          if (sessionStorage.getItem('ForensicsInjectionDone')) {
            console.log('Injection already done');
            return;
          }

          function waitForElement(selector, callback, maxAttempts) {
            maxAttempts = maxAttempts || 30;
            var attempts = 0;
            (function check() {
              var el = document.querySelector(selector);
              if (el) {
                callback(el);
              } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(check, 500);
              } else {
                console.warn('Element ' + selector + ' not found after ' + maxAttempts + ' attempts.');
              }
            })();
          }

          console.log('Starting URL injection flow');
          waitForElement('#img_url', function(urlInput) {
            urlInput.value = '${url}';
            urlInput.dispatchEvent(new Event('input', { bubbles: true }));
            urlInput.dispatchEvent(new Event('change', { bubbles: true }));
            waitForElement('#verify_text_but', function(verifyButton) {
              var event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
              });
              verifyButton.dispatchEvent(event);
              sessionStorage.setItem('ForensicsInjectionDone', 'true');
              console.log('Verify button clicked and injection marked as done');
            });
          });
        } catch (err) {
          console.error('Injection script error:', err);
        }
      })();
      true;
    `;
  }, [url]);

  const handleLoadStart = () => {
    if (webViewRef.current) {
      setTimeout(() => {
        webViewRef.current.injectJavaScript(generateInjectionScript());
      }, 1000);
    }
  };

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

    try {
      webViewRef.current?.injectJavaScript(`
        (function() {
          const title = document.title;
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: "title", title }));
        })();
        true;
      `);
    } catch (err) {
    }
  };

  const { width, height } = Dimensions.get('window');

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: 'https://mever.iti.gr/forensics/' }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      onLoadStart={handleLoadStart}
      onNavigationStateChange={handleNavigationStateChange}
      style={{ width, height }}
      onMessage={handleMessage}
    />
  );
}