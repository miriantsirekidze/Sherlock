import React, { useRef, useEffect, useState, useCallback } from 'react';
import WebView from 'react-native-webview';
import { BackHandler, Platform } from 'react-native';
import store$ from '../state';

const Copyseeker = ({ url, onUrlChange, onTitleChange }) => {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);

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

  const getURLInjectionScript = () => {
    const escapedURL = url.replace(/'/g, "\\'").replace(/\n/g, '');
    return `
    (function() {
      const EVENTS = ['input', 'change', 'blur', 'keydown', 'keyup', 'paste'];
      
      const verifyDOMState = () => {
        return {
          input: document.querySelector('input#url.enter-image'),
          btn: document.querySelector('button.search-button')
        };
      };

      const setURLValue = (input) => {
        const prototype = Object.getPrototypeOf(input);
        const valueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;
        valueSetter.call(input, '${escapedURL}');
        
        EVENTS.forEach(eventType => {
          input.dispatchEvent(new Event(eventType, { 
            bubbles: true,
            composed: true
          }));
        });
      };

      const syntheticClick = (btn) => {
        if (typeof window.React !== 'undefined') {
          const props = Object.keys(btn).find(k => k.startsWith('__reactProps'));
          if (props && btn[props].onClick) {
            btn[props].onClick(new MouseEvent('click'));
            return true;
          }
        }
        
        const rect = btn.getBoundingClientRect();
        const clientX = rect.left + rect.width/2;
        const clientY = rect.top + rect.height/2;
        
        btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX, clientY }));
        btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX, clientY }));
        btn.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX, clientY }));
        return false;
      };

      const triggerValidation = () => {
        document.querySelectorAll('form').forEach(form => {
          const event = new Event('submit', { 
            bubbles: true,
            cancelable: true
          });
          Object.defineProperty(event, 'isTrusted', { value: true });
          form.dispatchEvent(event);
        });
      };

      const executeFlow = () => {
        const { input, btn } = verifyDOMState();
        
        if (!input || !btn) {
          return setTimeout(executeFlow, 500);
        }

        if (!input.value) {
          setURLValue(input);
          setTimeout(executeFlow, 300);
          return;
        }

        if (!btn.disabled) {
          const result = syntheticClick(btn);
          if (!result) triggerValidation();
          window.ReactNativeWebView.postMessage('SUBMIT_ATTEMPTED');
        }
      };

      document.addEventListener('submit', () => {
        window.ReactNativeWebView.postMessage('FORM_SUBMITTED');
      });
      
      executeFlow();
    })();
    true;
    `;
  };

  const handleMessage = (event) => {
    const rawData = event.nativeEvent.data;
    
    try {
      const message = JSON.parse(rawData);
      
      if (message.type === "title" && message.title && onTitleChange) {
        onTitleChange('Copyseeker');
        return;
      }
    } catch (error) {
    }
  };

  const handleNavigationStateChange = (state) => {
    store$.currentUrl.set(state.url);
    setCanGoBack(state.canGoBack);
     
    if (onUrlChange) {
      const uniqueSuffix = '/#' + Math.random().toString(36).substring(2, 8);
      onUrlChange(state.url + uniqueSuffix);
    }

    webViewRef.current?.injectJavaScript(`
      (function() {
        const title = 'Copyseeker';
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: "title", title }));
      })();
      true;
    `);
  };

  return (
    <WebView
      ref={webViewRef}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      onLoadEnd={() => {
        webViewRef.current.injectJavaScript(injectionAdBlock);
        if (url) {
          setTimeout(() => {
            webViewRef.current.injectJavaScript(getURLInjectionScript());
          }, 1000);
        }
      }}
      source={{ uri: 'https://copyseeker.net' }}
      onMessage={handleMessage}
      onNavigationStateChange={handleNavigationStateChange}
      injectedJavaScriptBeforeContentLoadedForMainFrameOnly={false}
      onContentProcessDidTerminate={() => webViewRef.current.reload()}
    />
  );
};

export default Copyseeker;
