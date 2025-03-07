import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';

// Constants (UNCHANGED)
const DESKTOP_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36";
const MOBILE_UA = "Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Mobile Safari/537.36";
const RESULTS_REGEX = /google\.com\/(search|imgres)/;

export default function GoogleLens({ uri, onUrlChange, onTitleChange, active }) {
  // Refs and State (UNCHANGED/MODIFIED)
  const webViewRef = useRef(null);
  const [base64Data, setBase64Data] = useState(null);
  const [injectionComplete, setInjectionComplete] = useState(false);
  const [userAgent, setUserAgent] = useState(DESKTOP_UA);
  const [resultsUrl, setResultsUrl] = useState(null); // NEW STATE

  // Image conversion (UNCHANGED)
  useEffect(() => {
    const convertImageToBase64 = async () => {
      try {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        setBase64Data(base64);
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    };
    convertImageToBase64();
  }, [uri]);

  // Injection script using MutationObserver (MODIFIED)
  const generateInjectionScript = useCallback(() => {
    if (!base64Data || injectionComplete) return '';
    return `
      (function() {
        function base64ToFile(base64Data, fileName) {
          try {
            var byteCharacters = atob(base64Data);
            var byteArrays = [];
            for (var offset = 0; offset < byteCharacters.length; offset += 512) {
              var slice = byteCharacters.slice(offset, offset + 512);
              var byteNumbers = new Array(slice.length);
              for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
              }
              var byteArray = new Uint8Array(byteNumbers);
              byteArrays.push(byteArray);
            }
            var blob = new Blob(byteArrays, { type: 'image/jpeg' });
            return new File([blob], fileName, { type: 'image/jpeg' });
          } catch (e) {
            window.ReactNativeWebView.postMessage('ERROR: File conversion failed: ' + e.message);
          }
        }

        // Use MutationObserver to detect the file input
        var observer = new MutationObserver(function(mutations, obs) {
          var input = document.querySelector('input[type="file"]');
          if (input) {
            obs.disconnect();
            try {
              var file = base64ToFile('${base64Data}', 'upload.jpg');
              var dataTransfer = new DataTransfer();
              dataTransfer.items.add(file);
              input.files = dataTransfer.files;
              input.dispatchEvent(new Event('change', { bubbles: true }));
              window.ReactNativeWebView.postMessage('LENS_SUCCESS');
            } catch (e) {
              window.ReactNativeWebView.postMessage('ERROR: File injection failed: ' + e.message);
            }
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // Trigger the process by clicking the lens button
        var lensButton = document.querySelector('div[data-base-lens-url]');
        if (lensButton) {
          try {
            lensButton.click();
          } catch (e) {
            window.ReactNativeWebView.postMessage('ERROR: Button click failed: ' + e.message);
          }
        } else {
          setTimeout(function() {
            if (!document.querySelector('div[data-base-lens-url]')) {
              window.ReactNativeWebView.postMessage('ERROR: Lens button not found');
            }
          }, 5000);
        }
      })();
      true;
    `;
  }, [base64Data, injectionComplete]);

  // New: Re-inject script when the component becomes active
  useEffect(() => {
    if (active && base64Data && !injectionComplete && webViewRef.current) {
      // Force re-injection when GoogleLens becomes active.
      webViewRef.current.injectJavaScript(generateInjectionScript());
    }
  }, [active, base64Data, injectionComplete, generateInjectionScript]);

  // Message handler (UNCHANGED/MODIFIED)
  const handleMessage = useCallback((event) => {
    const message = event.nativeEvent.data;
    console.log('Received message:', message);

    if (message.startsWith('ERROR:')) {
      Alert.alert('Upload Error', message.replace('ERROR:', ''));
      return;
    }

    if (message === 'LENS_SUCCESS') {
      setInjectionComplete(true);
    } else if (message.startsWith('RESULTS_URL:')) {
      const url = message.replace('RESULTS_URL:', '');
      if (RESULTS_REGEX.test(url)) {
        setResultsUrl(url);
        setUserAgent(MOBILE_UA);
        onUrlChange(url);
      }
    }

    try {
      const parsed = JSON.parse(message);
      if (parsed.type === "title") onTitleChange(parsed.title);
    } catch (e) { }
  }, [onTitleChange, onUrlChange]);

  // Load handler (UNCHANGED/MODIFIED)
  const handleLoadEnd = useCallback(() => {
    if (userAgent === DESKTOP_UA && injectionComplete) {
      webViewRef.current?.injectJavaScript(`
        if(!window.location.href.includes('images.google.com')) {
          window.ReactNativeWebView.postMessage('RESULTS_URL:' + window.location.href);
        }
        true;
      `);
    }
  }, [userAgent, injectionComplete]);

  // Render (dual WebView approach remains unchanged)
  return (
    <>
      {!resultsUrl && (
        <WebView
          key="desktop-webview"
          ref={webViewRef}
          source={{ uri: 'https://images.google.com' }}
          userAgent={DESKTOP_UA}
          injectedJavaScript={generateInjectionScript()}
          onMessage={handleMessage}
          onLoadStart={handleLoadEnd}
          onNavigationStateChange={(navState) => onUrlChange(navState.url)}
          allowsBackForwardNavigationGestures={false}
        />
      )}

      {resultsUrl && (
        <WebView
          key="mobile-webview"
          source={{ uri: resultsUrl }}
          userAgent={MOBILE_UA}
          style={{ flex: 1 }}
          onNavigationStateChange={(navState) => onUrlChange(navState.url)}
          allowsBackForwardNavigationGestures={true}
        />
      )}
    </>
  );
}
