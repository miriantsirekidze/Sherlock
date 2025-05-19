import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Platform, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import store$ from '../state';
import { useNavigation } from '@react-navigation/native';

export default function Pimeyes({ uri, onUrlChange, onTitleChange }) {
  const isFullPimeyes = store$.fullPimeyes.get()
  const [base64Data, setBase64Data] = useState(null);

  const [canGoBack, setCanGoBack] = useState(false);
  const webViewRef = useRef(null);
  const navigation = useNavigation();

  const onAndroidBackPress = useCallback(() => {
    if (canGoBack) {
      webViewRef.current?.goBack();
      return true;
    }
    navigation.goBack();
    return true;
  }, [canGoBack, navigation]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onAndroidBackPress);
      };
    }
  }, [onAndroidBackPress]);

  const handleMessage = (event) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.type === "title" && message.title && onTitleChange) {
        onTitleChange(message.title); // Pass the title to the parent component
      }
    } catch (error) {
      return
    }
  }

  const handleNavigationStateChange = (state) => {
    store$.currentUrl.set(state.url); // Update the global state
    setCanGoBack(state.canGoBack); // Update the `canGoBack` state

    if (onUrlChange) {
      onUrlChange(state.url);
    }

    try {
      if (webViewRef.current) {
        webViewRef.current?.injectJavaScript(`
          (function() {
            const title = document.title;
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: "title", title }));
          })();
          true; // Required for JavaScript to execute correctly
        `);
      }
    } catch (err) {

    }
  };

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
        console.log(error)
      }
    };
    convertImageToBase64();
  }, [uri]);

  const injectionScriptClickButton = `
    (function() {
      if (sessionStorage.getItem('UPLOAD_BUTTON_CLICKED')) return;
      
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

  const injectionScriptSearchClick = `
    (function() {
      if (sessionStorage.getItem('SEARCH_CLICKED')) return;
      
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
    try {
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
    } catch (err) {

    }
  };

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: 'https://pimeyes.com' }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      onLoadStart={handleLoadStart}
      onNavigationStateChange={handleNavigationStateChange}
      onMessage={handleMessage}
    />
  );
}
