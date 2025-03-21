import React, { useRef, useEffect, useState } from 'react';
import WebView from 'react-native-webview';
import * as FileSystem from 'expo-file-system';

const Copyseeker = ({ uri, url }) => {
  const webViewRef = useRef(null);
  const [base64Data, setBase64Data] = useState(null);

  useEffect(() => {
    const convertImageToBase64 = async () => {
      try {
        if (!uri) throw new Error('No image URI provided');
        const fileInfo = await FileSystem.getInfoAsync(uri);
        if (!fileInfo.exists) throw new Error('File does not exist');
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        setBase64Data(base64);
      } catch (error) {
        console.error('Error converting image:', error);
      }
    };
    if (uri) {
      convertImageToBase64();
    }
  }, [uri]);

  // Image upload scripts (original)
  const injectionScriptClickUploadButton = `
    (function() {
      if (sessionStorage.getItem('UPLOAD_BUTTON_CLICKED')) return;
      const btn = document.querySelector('button.upload-button');
      if (btn) {
        btn.click();
        sessionStorage.setItem('UPLOAD_BUTTON_CLICKED', 'true');
        window.ReactNativeWebView.postMessage('CLICK_SUCCESS: Upload button clicked');
      }
    })();
    true;
  `;

  const generateFileInputInjectionScript = () => {
    if (!base64Data) return '';
    return `
      (function() {
        if (sessionStorage.getItem('FILE_INPUT_INJECTED')) return;
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
          try {
            const byteCharacters = atob('${base64Data}');
            const byteArrays = [];
            for (let offset = 0; offset < byteCharacters.length; offset += 512) {
              const slice = byteCharacters.slice(offset, offset + 512);
              const byteNumbers = new Array(slice.length);
              for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              byteArrays.push(byteArray);
            }
            const blob = new Blob(byteArrays, { type: 'image/jpeg' });
            const file = new File([blob], 'upload.jpg', {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;
            fileInput.dispatchEvent(new Event('change', { bubbles: true }));
            sessionStorage.setItem('FILE_INPUT_INJECTED', 'true');
            window.ReactNativeWebView.postMessage('FILE_INPUT_SUCCESS: File injected');
          } catch (e) {
            window.ReactNativeWebView.postMessage('ERROR: File injection failed: ' + e.message);
          }
        } else {
          setTimeout(arguments.callee, 500);
        }
      })();
      true;
    `;
  };

  // Enhanced ad blocking script with specific container removal
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

  // URL injection script (original working version)
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

  // Handle WebView messages
  const handleMessage = (event) => {
    const message = event.nativeEvent.data;
    console.log('WebView Message:', message);
  };

  // Execution handler
  const handleLoad = () => {
    if (webViewRef.current) {
      if (uri) {
        webViewRef.current.injectJavaScript(injectionScriptClickUploadButton);
        setTimeout(() => {
          webViewRef.current.injectJavaScript(generateFileInputInjectionScript());
        }, 1000);
      }
    }
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
      onLoad={handleLoad}
      onMessage={handleMessage}
      injectedJavaScriptBeforeContentLoadedForMainFrameOnly={false}
      onContentProcessDidTerminate={() => webViewRef.current.reload()}
    />
  );
};

export default Copyseeker;