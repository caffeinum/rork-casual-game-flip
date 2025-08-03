import React from 'react';
import { View, ActivityIndicator, Platform, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { X } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

interface WebViewGameProps {
  gameUrl: string;
  title: string;
  onGameOver: (score: number) => void;
}

export function WebViewGame({ gameUrl, title, onGameOver }: WebViewGameProps) {
  const [loading, setLoading] = React.useState(true);

  return (
    <View className="flex-1 bg-black relative">
      <View className="absolute top-0 left-0 right-0 z-10 flex-row items-center justify-between p-4 bg-black/80" style={{ paddingTop: 40 }}>
        <Text className="text-white text-xl font-bold">{title}</Text>
        <TouchableOpacity onPress={() => onGameOver(0)}>
          <X size={24} color="white" />
        </TouchableOpacity>
      </View>
      {loading && (
        <View className="absolute inset-0 items-center justify-center bg-black/50 z-20">
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      <WebView
        source={{ uri: gameUrl }}
        style={{ flex: 1, marginTop: 80 }}
        onLoadEnd={() => setLoading(false)}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        scalesPageToFit
        mixedContentMode="compatibility"
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        originWhitelist={['*']}
        allowsFullscreenVideo
        allowsProtectedMedia
      />
    </View>
  );
}