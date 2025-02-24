// GoogleLens.js
import React, { useRef, useEffect, useState } from 'react';
import { View, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';

// Constants remain the same
const DESKTOP_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36";
const MOBILE_UA =
  "Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Mobile Safari/537.36";

export default function GoogleLens({ route }) {
  // Existing state and ref declarations
  const { uri } = route.params;
  const webViewRef = useRef(null);
  const [base64Data, setBase64Data] = useState(null);
  const [injectionComplete, setInjectionComplete] = useState(false);
  const [webViewSource, setWebViewSource] = useState({ uri: 'https://images.google.com' });
  const [userAgent, setUserAgent] = useState(DESKTOP_UA);

  // Existing image conversion useEffect (unchanged)
  useEffect(() => {
    const convertImageToBase64 = async () => {
      try {
        if (!uri) throw new Error("No image URI provided");
        const fileInfo = await FileSystem.getInfoAsync(uri);
        if (!fileInfo.exists) throw new Error("File does not exist");
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        setBase64Data(base64);
      } catch (error) {
        console.error("Error converting image:", error);
        Alert.alert("Error", error.message);
      }
    };
    convertImageToBase64();
  }, [uri]);

  // Existing injection script (unchanged)
  const generateInjectionScript = () => {
    if (!base64Data || injectionComplete) return '';

    return `
      (function() {
        let lensClicked = false;
        let fileInjected = false;

        function base64ToFile(base64Data, fileName) {
          const byteCharacters = atob(base64Data);
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
          return new File([blob], fileName, { type: 'image/jpeg' });
        }

        function injectFile() {
          if (fileInjected) return;
          const input = document.querySelector('input[type="file"]');
          if (input) {
            const file = base64ToFile('${base64Data}', 'upload.jpg');
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            input.files = dataTransfer.files;
            input.dispatchEvent(new Event('change', { bubbles: true }));
            window.ReactNativeWebView.postMessage('LENS_FILE_SUCCESS: File injected.');
            fileInjected = true;
          } else {
            window.ReactNativeWebView.postMessage('FILE_INPUT_DEBUG: File input not found.');
            setTimeout(injectFile, 500);
          }
        }

        function clickLensButton() {
          if (lensClicked) return;
          const lensButton = document.querySelector('div[data-base-lens-url]');
          if (lensButton) {
            lensButton.click();
            window.ReactNativeWebView.postMessage('LENS_CLICK_SUCCESS: Google Lens button clicked.');
            lensClicked = true;
            setTimeout(injectFile, 1000);
          } else {
            window.ReactNativeWebView.postMessage('LENS_BUTTON_DEBUG: Google Lens button not found.');
            setTimeout(clickLensButton, 500);
          }
        }

        clickLensButton();
      })();
      true;
    `;
  };

  // Modified message handler with URL validation
  const onMessageHandler = (event) => {
    const message = event.nativeEvent.data;
    console.log("WebView Message:", message);

    if (message.includes('LENS_FILE_SUCCESS')) {
      setInjectionComplete(true);
    }
    else if (message.startsWith('RESULTS_URL:')) {
      const resultsUrl = message.replace('RESULTS_URL:', '');
      
      // Only reload if we're not already on the initial page
      if (!resultsUrl.includes('images.google.com')) {
        setTimeout(() => {
          setWebViewSource({ uri: resultsUrl });
          setUserAgent(MOBILE_UA);
        }, 500); // 500ms delay before reload
      }
      setBase64Data(null);
      setInjectionComplete(false);
    }
  };

  // Modified load handler with delay
  const handleLoadEnd = () => {
    if (injectionComplete) {
      setTimeout(() => {
        webViewRef.current.injectJavaScript(`
          window.ReactNativeWebView.postMessage('RESULTS_URL:' + window.location.href);
          true;
        `);
      }, 500); // Wait 500ms after load to capture final URL
    }
  };

  // WebView component remains similar with updated props
  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webViewRef}
        source={webViewSource}
        userAgent={userAgent}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        injectedJavaScript={generateInjectionScript()}
        onMessage={onMessageHandler}
        onLoadEnd={handleLoadEnd}
      />
    </View>
  );
}