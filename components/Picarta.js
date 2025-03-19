import React, { useRef, useEffect, useState } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import store$ from '../state';

const Picarta = ({ uri, url }) => {
  const webViewRef = useRef(null);
  const [base64Data, setBase64Data] = useState(null);
  const isFullPicarta = store$.fullPicarta.get(); // true by default

  // Convert the image to base64 exactly like in Pimeyes.js
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

  const injectionScriptClickUploadButton = `
    (function() {
      if (sessionStorage.getItem('UPLOAD_BUTTON_CLICKED')) return;
      const btn = document.querySelector('button#upload-btn[aria-label="Upload photo"]');
      if (btn) {
        btn.click();
        sessionStorage.setItem('UPLOAD_BUTTON_CLICKED', 'true');
        window.ReactNativeWebView.postMessage('CLICK_SUCCESS: Upload button clicked');
      }
    })();
    true;
  `;

  // Injection script that directly sets the file into the file input element.
  const generateFileInputInjectionScript = () => {
    if (!base64Data) return '';
    return `
      (function() {
        if (sessionStorage.getItem('FILE_INPUT_INJECTED')) return;
        // Adjust the selector if needed. Here we use a general file input selector.
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

  // Injection script for URL flow (unchanged)
  const injectionScriptURLFlow = `
    (function() {
      if (sessionStorage.getItem('SEARCH_CLICKED')) return;
      let attempts = 0;
      const intervalInput = setInterval(() => {
        attempts++;
        const input = document.querySelector('input#photo-url-input.form-control.link-search');
        if (input) {
          clearInterval(intervalInput);
          input.value = '${url}';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
          let attemptsBtn = 0;
          const intervalBtn = setInterval(() => {
            attemptsBtn++;
            const btn = document.querySelector('button#search-btn');
            if (btn && !btn.disabled) {
              clearInterval(intervalBtn);
              btn.click();
              sessionStorage.setItem('SEARCH_CLICKED', 'true');
              window.ReactNativeWebView.postMessage('SEARCH_CLICK: Search button clicked');
            }
            if (attemptsBtn > 50) clearInterval(intervalBtn);
          }, 100);
        }
        if (attempts > 50) clearInterval(intervalInput);
      }, 100);
    })();
    true;
  `;

  // New injection script to click the search button for full Picarta flow
  const injectionScriptSearch = `
    (function() {
      if (sessionStorage.getItem('SEARCH_CLICKED')) return;
      const searchButton = document.querySelector('span.common-btn.classify-btn');
      if (searchButton) {
        searchButton.click();
        sessionStorage.setItem('SEARCH_CLICKED', 'true');
        window.ReactNativeWebView.postMessage('SEARCH_CLICK: Search button clicked');
      } else {
        setTimeout(arguments.callee, 500);
      }
    })();
    true;
  `;

  // Use onLoad so the page is fully rendered before running our scripts.
  const handleLoad = () => {
    if (webViewRef.current) {
      if (uri) {
        // Run the click script for logging; note that the file dialog likely won't open due to security restrictions.
        webViewRef.current.injectJavaScript(injectionScriptClickUploadButton);
        // After a short delay, inject the file directly into the file input element.
        setTimeout(() => {
          webViewRef.current.injectJavaScript(generateFileInputInjectionScript());
        }, 1000);
        // If isFullPicarta is true, inject the search button click script after the file injection.
        if (isFullPicarta) {
          setTimeout(() => {
            webViewRef.current.injectJavaScript(injectionScriptSearch);
          }, 2000);
        }
      } else if (!uri && url) {
        webViewRef.current.injectJavaScript(injectionScriptURLFlow);
        if (isFullPicarta) {
          setTimeout(() => {
            webViewRef.current.injectJavaScript(injectionScriptSearch);
          }, 2000);
        }
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webViewRef}
        source={{ uri: 'https://picarta.ai' }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onLoad={handleLoad}
        onMessage={(event) => console.log('WebView Message:', event.nativeEvent.data)}
      />
    </View>
  );
};

export default Picarta;
