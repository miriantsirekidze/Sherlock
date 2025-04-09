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

  const conditional = url && url.startsWith('https://copyseeker.net');

  useEffect(() => {
    navigation.setOptions({
      title: conditional ? 'Copyseeker' : pageTitle,
      headerTitleStyle: {
        fontSize: 18,
      },
    });
  }, [navigation, pageTitle, url, conditional]);

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
    setCanGoBack(state.canGoBack);

    webViewRef.current?.injectJavaScript(`
      (function() {
        const title = document.title;
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: "title", title }));
      })();
      true;
    `);
  };

  const injectionAdBlock = `
  (function() {
    var style = document.createElement('style');
    style.innerHTML = \`
      /* Target specific ad containers and their parents */
      .ad, .ads, .advertisement, 
      [id^="aswift_"], 
      [id^="aswift_"] iframe,
      [id*="aswift_"],
      #aswift_4_host,
      [id^="google_ads_frame"],
      iframe[src*="ad"] {
        display: none !important;
        height: 0 !important;
        width: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        position: absolute !important;
        z-index: -1000 !important;
        pointer-events: none !important;
        overflow: hidden !important;
        max-height: 0 !important;
        max-width: 0 !important;
        min-height: 0 !important;
        min-width: 0 !important;
      }
      
      /* Target specific problematic container */
      div#aswift_4_host {
        all: unset !important;
        display: none !important;
        height: 0 !important;
        width: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
      }
    \`;
    document.head.appendChild(style);

    // Immediate cleanup of existing elements
    var removeAds = function() {
      var selectors = [
        '#aswift_4_host',
        '[id^="aswift_"]',
        '[id*="aswift_"]',
        '[id^="google_ads_frame"]',
        'iframe[src*="ad"]'
      ];
      
      selectors.forEach(function(selector) {
        document.querySelectorAll(selector).forEach(function(el) {
          el.style.cssText = 'display:none!important;height:0!important;width:0!important;';
          el.parentNode && el.parentNode.removeChild(el);
        });
      });
    };

    // Run immediately
    removeAds();

    // Set up mutation observer
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        removeAds();
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) {
            if (node.matches('#aswift_4_host, [id^="aswift_"], [id*="aswift_"], [id^="google_ads_frame"], iframe[src*="ad"]')) {
              node.style.cssText = 'display:none!important;height:0!important;width:0!important;';
              node.parentNode && node.parentNode.removeChild(node);
            }
            node.querySelectorAll('#aswift_4_host, [id^="aswift_"], [id*="aswift_"], [id^="google_ads_frame"], iframe[src*="ad"]').forEach(function(el) {
              el.style.cssText = 'display:none!important;height:0!important;width:0!important;';
              el.parentNode && el.parentNode.removeChild(el);
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'id', 'class']
    });
  })();
  true;
  `;

  return (
    <WebView
      source={{ uri: url }}
      ref={webViewRef}
      allowsBackForwardNavigationGestures
      onNavigationStateChange={handleNavigationStateChange}
      onLoadEnd={() => {
        webViewRef.current.injectJavaScript(injectionAdBlock);
      }}
      onMessage={(event) => {
        try {
          const message = JSON.parse(event.nativeEvent.data);
          if (message.type === "title" && message.title) {
            setPageTitle(message.title);
          }
        } catch (error) {
          console.warn("Error parsing message from WebView:", error);
        }
      }}
    />
  );
};

export default WebViewScreen;
