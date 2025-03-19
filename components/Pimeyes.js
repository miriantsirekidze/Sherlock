import React, { useRef, useEffect, useState } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import store$ from '../state';

export default function Pimeyes({ uri }) {
  const webViewRef = useRef(null);
  const [base64Data, setBase64Data] = useState(null);
  const isFullPimeyes = store$.fullPimeyes.get() 


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
        // Optionally handle the error (e.g., Alert.alert('Error', error.message));
      }
    };
    convertImageToBase64();
  }, [uri]);

  const injectionScriptClickButton = `
    (function() {
      // If already clicked, exit early.
      if (sessionStorage.getItem('UPLOAD_BUTTON_CLICKED')) return;
      
      // Use MutationObserver to watch for the upload button.
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
        } else {
          setTimeout(arguments.callee, 500);
        }
      })();
      true;
    `;
  };

  // Updated injection script for checking permissions and clicking search
  const injectionScriptSearchClick = `
    (function() {
      // If already clicked, exit early.
      if (sessionStorage.getItem('SEARCH_CLICKED')) return;
      
      // Check for permissions checkboxes and click them if found.
      const permissionsCheckboxes = document.querySelectorAll('.permissions input[type="checkbox"]');
      if (permissionsCheckboxes && permissionsCheckboxes.length > 0) {
        permissionsCheckboxes.forEach(function(checkbox) {
          if (!checkbox.checked) {
            checkbox.click();
            checkbox.checked = true;
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
        window.ReactNativeWebView.postMessage('PERMISSIONS_CHECKED: Permissions checkboxes checked');
      }
      
      // Then attempt to click the search button.
      const searchButton = document.querySelector('.start-search-inner > button');
      if (searchButton && !searchButton.classList.contains('disabled')) {
        searchButton.click();
        sessionStorage.setItem('SEARCH_CLICKED', 'true');
        window.ReactNativeWebView.postMessage('SEARCH_CLICK: Search button clicked');
      } else {
        setTimeout(arguments.callee, 500);
      }
    })();
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
        if (webViewRef.current && isFullPimeyes) {
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
        onLoadStart={handleLoadStart}
        onMessage={(event) => {
          // Optionally handle messages from the web view:
          console.log('WebView Message:', event.nativeEvent.data);
        }}
      />
    </View>
  );
}
