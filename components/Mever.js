// Forensics.js
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';

export default function Mever({ uri, url }) {
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
    if (uri) {
      convertImageToBase64();
    }
  }, [uri]);

  // --- Injection script generator ---
  const generateInjectionScript = useCallback(() => {
    // If neither uri nor url is provided, or (for file flow) base64Data is missing, exit.
    if ((!uri && !url) || (uri && !base64Data)) return '';
    return `
      (function() {
        // Prevent repeated injection.
        if (sessionStorage.getItem('ForensicsInjectionDone')) return;
        
        // --- Helper: waitForElement ---
        function waitForElement(selector, callback, maxAttempts, interval) {
          var attempts = 0;
          var timer = setInterval(function() {
            var el = document.querySelector(selector);
            if (el) {
              clearInterval(timer);
              callback(el);
            } else if (++attempts >= maxAttempts) {
              clearInterval(timer);
            }
          }, interval);
        }
        
        // --- Step 1: Ensure consent checkbox is checked ---
        var consentCheckbox = document.getElementById('consent_check');
        if (consentCheckbox && !consentCheckbox.checked) {
          consentCheckbox.checked = true;
          consentCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
        }
        
        // --- Conditional Flow ---
        if (${uri ? 'true' : 'false'}) {
          // FILE UPLOAD FLOW
          var uploadLabel = document.querySelector('label[for="fileToUpload"]');
          if (uploadLabel) {
            uploadLabel.click();
          }
          
          function base64ToFile() {
            try {
              const byteCharacters = atob('${base64Data}');
              const byteArrays = [];
              for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                const slice = byteCharacters.slice(offset, offset + 512);
                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                  byteNumbers[i] = slice.charCodeAt(i);
                }
                byteArrays.push(new Uint8Array(byteNumbers));
              }
              return new File([new Blob(byteArrays, { type: 'image/jpeg' })], 'upload.jpg', {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
            } catch (e) {
              window.ReactNativeWebView.postMessage('ERROR: File conversion failed: ' + e.message);
              return null;
            }
          }
          
          function injectFile() {
            var fileInput = document.getElementById('fileToUpload');
            if (fileInput) {
              var file = base64ToFile();
              if (file) {
                var dt = new DataTransfer();
                dt.items.add(file);
                fileInput.files = dt.files;
                fileInput.dispatchEvent(new Event('change', { bubbles: true }));
                return true;
              }
            }
            return false;
          }
          
          // Wait for file input, inject file, then wait for the submit button and click it.
          waitForElement('#fileToUpload', function(input) {
            if (injectFile()) {
              waitForElement('#submit_but', function(submitButton) {
                // Dispatch a synthetic click event.
                var event = new MouseEvent('click', {
                  bubbles: true,
                  cancelable: true,
                  view: window
                });
                submitButton.dispatchEvent(event);
                sessionStorage.setItem('ForensicsInjectionDone', 'true');
              }, 20, 500);
            }
          }, 30, 500);
        } else if (${!uri && url ? 'true' : 'false'}) {
          // URL INJECTION FLOW
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
            }, 20, 500);
          }, 30, 500);
        }
      })();
      true;
    `;
  }, [base64Data, uri, url]);

  // --- Inject the script on load start, delayed by 500ms ---
  const handleLoadStart = () => {
    if (webViewRef.current) {
      setTimeout(() => {
        webViewRef.current.injectJavaScript(generateInjectionScript());
      }, 500);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webViewRef}
        source={{ uri: 'https://mever.iti.gr/forensics/' }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onLoadStart={handleLoadStart}
        // Uncomment for debugging:
        onMessage={(event) => console.log('WebView Message:', event.nativeEvent.data)}
        style={{ flex: 1 }}
      />
    </View>
  );
}

