import React, { useRef, useState } from 'react';
import { View, ActivityIndicator, Platform, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { COLORS } from '@/constants/colors';

interface WebViewGameProps {
  gameUrl: string;
  title: string;
  onGameOver: (score: number) => void;
}

export function WebViewGame({ gameUrl, title, onGameOver }: WebViewGameProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const webViewRef = useRef<WebView>(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>
      
      {Platform.OS === 'web' ? (
        // Web platform - use iframe
        <iframe 
          src={gameUrl}
          style={{ 
            width: '100%', 
            height: '100%',
            border: 'none',
            backgroundColor: '#000'
          }}
          title={title}
          onLoad={() => {
            console.log('iframe loaded');
            setLoading(false);
          }}
        />
      ) : (
        <WebView
          ref={webViewRef}
          source={{ 
            uri: gameUrl,
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          }}
          style={styles.webview}
          onLoadStart={() => {
            console.log('WebView loading started:', gameUrl);
            setLoading(true);
            setError(null);
          }}
          onLoadEnd={() => {
            console.log('WebView loading ended');
            setLoading(false);
          }}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView error:', nativeEvent);
            setError(`Failed to load game: ${nativeEvent.description}`);
            setLoading(false);
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView HTTP error:', nativeEvent);
            setError(`HTTP error ${nativeEvent.statusCode}: ${nativeEvent.description}`);
            setLoading(false);
          }}
          // Enable JavaScript and DOM storage
          javaScriptEnabled={true}
          domStorageEnabled={true}
          // Allow file uploads
          allowsFullscreenVideo={true}
          allowsInlineMediaPlayback={true}
          // Improve performance
          cacheEnabled={true}
          startInLoadingState={true}
          // Enable local storage and cookies for authentication
          sharedCookiesEnabled={true}
          thirdPartyCookiesEnabled={true}
          // iOS specific settings for better compatibility
          allowsBackForwardNavigationGestures={true}
          allowsLinkPreview={false}
          // Android specific settings
          mixedContentMode={'compatibility'}
          // Set a proper user agent
          userAgent={Platform.OS === 'ios' 
            ? 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15'
            : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
          // Handle messages from WebView
          onMessage={(event) => {
            console.log('WebView message:', event.nativeEvent.data);
          }}
          // Handle authentication and navigation
          originWhitelist={['*']}
          // Inject JavaScript to set viewport and styles
          injectedJavaScriptBeforeContentLoaded={`
            // Set viewport for mobile
            const meta = document.createElement('meta');
            meta.setAttribute('name', 'viewport');
            meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
            document.getElementsByTagName('head')[0].appendChild(meta);
            
            // Override body styles
            document.addEventListener('DOMContentLoaded', function() {
              document.body.style.margin = '0';
              document.body.style.padding = '0';
              document.body.style.overflow = 'hidden';
              document.body.style.backgroundColor = '#000';
              
              // Try to make the canvas fill the viewport
              const canvas = document.querySelector('canvas');
              if (canvas) {
                canvas.style.width = '100%';
                canvas.style.height = '100%';
                canvas.style.display = 'block';
                canvas.style.margin = '0';
                canvas.style.padding = '0';
              }
              
              // Log that page is ready
              window.ReactNativeWebView.postMessage('Page loaded and styled');
            });
            
            true;
          `}
        />
      )}
      
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading game...</Text>
        </View>
      )}
      
      {error && (
        <View style={styles.errorOverlay}>
          <Text style={styles.errorTitle}>Failed to load game</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              setLoading(true);
              webViewRef.current?.reload();
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  webview: {
    flex: 1,
    marginTop: 80,
    backgroundColor: '#000',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#fff',
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 32,
  },
  errorTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});