// Pimeyes.js
import React, { useRef, useEffect, useState } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';

export default function Pimeyes({ route }) {
  const { uri } = route.params;
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
        Alert.alert('Error', error.message);
      }
    };
    convertImageToBase64();
  }, [uri]);

  const injectionScriptClickButton = `
    (function() {
      // If already clicked, exit early.
      if (sessionStorage.getItem('UPLOAD_BUTTON_CLICKED')) return;
      
      // Use MutationObserver to watch for the button.
      const observer = new MutationObserver(() => {
        const button = document.querySelector('button.upload[aria-label="Upload photo"]');
        if (button && getComputedStyle(button).display !== 'none' && button.offsetParent !== null) {
          observer.disconnect();
          button.click();
          sessionStorage.setItem('UPLOAD_BUTTON_CLICKED', 'true');
          window.ReactNativeWebView.postMessage('CLICK_SUCCESS: Upload button clicked');
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      
      // Also check manually every 100ms (max 50 attempts = 5 seconds)
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        const button = document.querySelector('button.upload[aria-label="Upload photo"]');
        if (button && getComputedStyle(button).display !== 'none' && button.offsetParent !== null) {
          clearInterval(interval);
          button.click();
          sessionStorage.setItem('UPLOAD_BUTTON_CLICKED', 'true');
          window.ReactNativeWebView.postMessage('CLICK_SUCCESS: Upload button clicked');
        }
        if (attempts > 50) clearInterval(interval);
      }, 100);
    })();
    true;
  `;

  const generateFileInputInjectionScript = () => {
    if (!base64Data) return '';
    return `
      (function() {
        // If already injected, exit early.
        if (sessionStorage.getItem('FILE_INPUT_INJECTED')) return;
        const fileInput = document.querySelector('.upload-file input#file-input');
        if (fileInput) {
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
          const file = new File([blob], 'upload.jpg', { type: 'image/jpeg' });
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInput.files = dataTransfer.files;
          fileInput.dispatchEvent(new Event('change', { bubbles: true }));
          sessionStorage.setItem('FILE_INPUT_INJECTED', 'true');
          window.ReactNativeWebView.postMessage('FILE_INPUT_SUCCESS: File injected');
        } else {\n          setTimeout(arguments.callee, 500);\n        }\n      })();
      true;
    `;
  };

  const injectionScriptSearchClick = `
    (function() {
      // If already clicked, exit early.
      if (sessionStorage.getItem('SEARCH_CLICKED')) return;
      const searchButton = document.querySelector('.start-search-inner > button');
      if (searchButton && !searchButton.classList.contains('disabled')) {
        searchButton.click();
        sessionStorage.setItem('SEARCH_CLICKED', 'true');
        window.ReactNativeWebView.postMessage('SEARCH_CLICK: Search button clicked');
      } else {\n        setTimeout(arguments.callee, 500);\n      }\n    })();
    true;
  `;

  const handleLoadStart = () => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(injectionScriptClickButton);
      setTimeout(() => {
        if (webViewRef.current) {
          webViewRef.current.injectJavaScript(generateFileInputInjectionScript());
        }
      }, 1000);
      setTimeout(() => {
        if (webViewRef.current) {
          webViewRef.current.injectJavaScript(injectionScriptSearchClick);
        }
      }, 2000);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webViewRef}
        source={{ uri: 'https://pimeyes.com' }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onLoadStart={handleLoadStart}
        onMessage={(event) => {
          console.log('WebView Message:', event.nativeEvent.data);
        }}
      />
    </View>
  );
}
