import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Dimensions, Platform, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import store$ from '../state'

export default function Mever({ uri, url, onUrlChange, onTitleChange }) {
  const [base64Data, setBase64Data] = useState(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const webViewRef = useRef(null);

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

  const generateInjectionScript = useCallback(() => {
    if ((!uri && !url) || (uri && !base64Data)) return '';
    return `
      (function() {
        try {
          if (sessionStorage.getItem('ForensicsInjectionDone')) {
            console.log('Injection already done');
            return;
          }

          // Ensure document.head is available
          function ensureHead(callback, attempts) {
            attempts = attempts || 0;
            if (document.head) {
              callback();
            } else if (attempts < 10) {
              setTimeout(function() { ensureHead(callback, attempts + 1); }, 100);
            }
          }

          ensureHead(function() {
            // Inject CSS to control the layout
            var style = document.createElement('style');
            style.innerHTML = \`
              body, html {
                margin: 0;
                padding: 0;
                max-width: 100%;
                overflow-x: hidden;
              }
              .reveal-modal {
                visibility: hidden;
                top: 100px;
                left: 50%;
                transform: translateX(-50%);
                width: 90vw;
                max-width: 520px;
                background: #eee url(../../imgs/modal-gloss.png) no-repeat -200px -80px;
                position: absolute;
                z-index: 101;
                padding: 30px 40px 34px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
                box-sizing: border-box;
              }
              #map_modal,
              #myModal5, #myModal6, #myModal7, #myModal8, #myModal9,
              #myModal10, #myModal11, #myModal12 {
                top: 26px !important;
                width: 90%;
                height: 95%;
                left: 5%;
                margin-left: 0;
                padding: 0;
                position: fixed !important;
                text-align: center;
                overflow-y: scroll;
                box-sizing: border-box;
              }
              .reveal-modal img {
                max-width: 100%;
                height: auto;
                display: block;
                margin: 0 auto;
              }
            \`;
            document.head.appendChild(style);
          });

          // Utility: Wait for an element using a recursive setTimeout approach.
          function waitForElement(selector, callback, maxAttempts) {
            maxAttempts = maxAttempts || 30;
            var attempts = 0;
            (function check() {
              var el = document.querySelector(selector);
              if (el) {
                callback(el);
              } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(check, 500);
              } else {
                console.warn('Element ' + selector + ' not found after ' + maxAttempts + ' attempts.');
              }
            })();
          }

          // Check the consent checkbox if it exists and isn’t checked.
          var consentCheckbox = document.getElementById('consent_check');
          if (consentCheckbox && !consentCheckbox.checked) {
            consentCheckbox.checked = true;
            consentCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
          }

          // FILE UPLOAD FLOW
          if (${uri ? 'true' : 'false'}) {
            console.log('Starting file upload flow');
            // Trigger file input dialog by clicking the upload label.
            var uploadLabel = document.querySelector('label[for="fileToUpload"]');
            if (uploadLabel) {
              uploadLabel.click();
            } else {
              console.warn('Upload label not found');
            }
            
            // Convert the base64 data to a File object.
            function base64ToFile() {
              try {
                var byteCharacters = atob('${base64Data}');
                var byteArrays = [];
                for (var offset = 0; offset < byteCharacters.length; offset += 512) {
                  var slice = byteCharacters.slice(offset, offset + 512);
                  var byteNumbers = new Array(slice.length);
                  for (var i = 0; i < slice.length; i++) {
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
                  console.log('File injected successfully');
                  return true;
                } else {
                  console.warn('File conversion returned null');
                }
              } else {
                console.warn('File input not found');
              }
              return false;
            }
            
            // Wait for the file input element, then inject the file and click the submit button.
            waitForElement('#fileToUpload', function(input) {
              if (injectFile()) {
                waitForElement('#submit_but', function(submitButton) {
                  var event = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                  });
                  submitButton.dispatchEvent(event);
                  sessionStorage.setItem('ForensicsInjectionDone', 'true');
                  console.log('Submit button clicked and injection marked as done');
                });
              }
            });
          } 
          // URL INJECTION FLOW
          else if (${!uri && url ? 'true' : 'false'}) {
            console.log('Starting URL injection flow');
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
                console.log('Verify button clicked and injection marked as done');
              });
            });
          } else {
            console.warn('No valid injection parameters provided');
          }
        } catch (err) {
          console.error('Injection script error:', err);
        }
      })();
      true;
    `;
  }, [base64Data, uri, url]);

  // Trigger the injection script on load start with a slight delay.
  const handleLoadStart = () => {
    if (webViewRef.current) {
      setTimeout(() => {
        webViewRef.current.injectJavaScript(generateInjectionScript());
      }, 1000);
    }
  };

  const handleMessage = (event) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.type === "title" && message.title && onTitleChange) {
        onTitleChange(message.title); // Pass the title to the parent component
      }
    } catch (error) {
      console.warn("Error parsing message from WebView:", error);
    }
  }

  const handleNavigationStateChange = (state) => {
    store$.currentUrl.set(state.url); // Update the global state
    setCanGoBack(state.canGoBack); // Update the `canGoBack` state

    if (onUrlChange) {
      onUrlChange(state.url);
    }

    // Inject JavaScript to extract the page title
    webViewRef.current?.injectJavaScript(`
      (function() {
        const title = document.title;
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: "title", title }));
      })();
      true;
    `);
  };

  const { width, height } = Dimensions.get('window');

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: 'https://mever.iti.gr/forensics/' }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      onLoadStart={handleLoadStart}
      onNavigationStateChange={handleNavigationStateChange}
      style={{ width, height }}
      onMessage={handleMessage}
    />
  );
}
