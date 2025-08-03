import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Game } from '@/types/game';
import { COLORS } from '@/constants/colors';
import { Play, Shuffle } from 'lucide-react-native';
import { router } from 'expo-router';

interface GamePreviewProps {
  game: Game;
  onPlay: () => void;
}

const { width, height } = Dimensions.get('window');

export default function GamePreview({ game, onPlay }: GamePreviewProps) {
  const handleRemix = () => {
    // Navigate to submit game with prefilled data
    router.push({
      pathname: '/submit-game',
      params: {
        remix: 'true',
        name: game.title,
        gif: game.previewGif,
        url: game.gameUrl || ''
      }
    });
  };

  return (
    <View style={styles.container} testID={`game-preview-${game.id}`}>
      <Image 
        source={{ uri: game.previewGif }} 
        style={styles.previewImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{game.title}</Text>
          <Text style={styles.description}>{game.description}</Text>
          {game.highScore !== undefined && (
            <Text style={styles.highScore}>High Score: {game.highScore}</Text>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.playButton} 
            onPress={onPlay}
            testID={`play-button-${game.id}`}
          >
            <Play color={COLORS.text} size={24} />
            <Text style={styles.playText}>PLAY</Text>
          </TouchableOpacity>
          {game.type === 'webview' && (
            <TouchableOpacity 
              style={styles.remixButton} 
              onPress={handleRemix}
              testID={`remix-button-${game.id}`}
            >
              <Shuffle color={COLORS.text} size={20} />
              <Text style={styles.remixText}>REMIX</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height: height - 100, // Account for tab bar and status bar
    backgroundColor: COLORS.background,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'space-between',
    padding: 20,
  },
  infoContainer: {
    marginTop: 60,
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 16,
    marginBottom: 8,
  },
  highScore: {
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 40,
  },
  playButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  playText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  remixButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  remixText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  }
});