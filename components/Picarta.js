import React, { useRef, useEffect, useState } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import store$ from '../state';

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

  // Injection script to click the file upload ("Browse") button.
  // New selector: <button class="btn btn-default upload-button">Browse</button>
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

  // Injection script that directly sets the file into the file input element.
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

  // Injection script for URL flow.
  // New selectors:
  // • Text input: <input class="form-control enter-image" id="url" placeholder="Enter image address" type="text" value="">
  // • Submit button: <button type="submit" class="search-button">Submit</button>
  const injectionScriptURLFlow = `
    (function() {
      if (sessionStorage.getItem('SEARCH_CLICKED')) return;
      let attempts = 0;
      const intervalInput = setInterval(() => {
        attempts++;
        const input = document.querySelector('input#url.enter-image');
        if (input) {
          clearInterval(intervalInput);
          input.value = '${url}';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
          let attemptsBtn = 0;
          const intervalBtn = setInterval(() => {
            attemptsBtn++;
            const btn = document.querySelector('button.search-button');
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

  // New injection script to click the search button for full Copyseeker flow.
  // This can act as a fallback in full mode.
  const injectionScriptSearch = `
    (function() {
      if (sessionStorage.getItem('SEARCH_CLICKED')) return;
      const searchButton = document.querySelector('button.search-button');
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

  // Injection script for ad blocking remains the same.
  const injectionAdBlock = `
    (function() {
      var style = document.createElement('style');
      style.innerHTML = \`
        .ad, .ads, .advertisement, [id^="ad-"], iframe[src*="ad"],
        #aswift_4_host {
          display: none !important;
        }
      \`;
      document.head.appendChild(style);
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) {
              if (node.matches && node.matches('#aswift_4_host, .ad, .ads, .advertisement, [id^="ad-"], iframe[src*="ad"]')) {
                node.style.display = 'none';
              }
              node.querySelectorAll && node.querySelectorAll('#aswift_4_host, .ad, .ads, .advertisement, [id^="ad-"], iframe[src*="ad"]').forEach(function(el) {
                el.style.display = 'none';
              });
            }
          });
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });
    })();
    true;
  `;

  // Use onLoad so the page is fully rendered before running our scripts.
  const handleLoad = () => {
    if (webViewRef.current) {
      if (uri) {
        webViewRef.current.injectJavaScript(injectionScriptClickUploadButton);
        setTimeout(() => {
          webViewRef.current.injectJavaScript(generateFileInputInjectionScript());
        }, 1000);
        if (true) {
          setTimeout(() => {
            webViewRef.current.injectJavaScript(injectionScriptSearch);
          }, 2000);
        }
      } else if (!uri && url) {
        webViewRef.current.injectJavaScript(injectionScriptURLFlow);
        if (true) {
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
        source={{ uri: 'https://copyseeker.net' }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onLoad={handleLoad}
        onLoadEnd={() => {
          webViewRef.current.injectJavaScript(injectionAdBlock);
        }}
        onMessage={(event) => console.log('WebView Message:', event.nativeEvent.data)}
      />
    </View>
  );
};

export default Copyseeker;
