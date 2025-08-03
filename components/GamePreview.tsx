import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Game } from '@/types/game';
import { COLORS } from '@/constants/colors';
import { Play, Shuffle, X, ChevronUp, ChevronDown } from 'lucide-react-native';
import { router } from 'expo-router';
import GameContainer from '@/components/GameContainer';

interface GamePreviewProps {
  game: Game;
  onPlay: () => void;
  isActive: boolean;
  onPlayingChange?: (playing: boolean) => void;
  onNavigate?: (direction: 'up' | 'down') => void;
}

const { width, height } = Dimensions.get('window');

export default function GamePreview({ game, onPlay, isActive, onPlayingChange, onNavigate }: GamePreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play when becoming active, reset when becoming inactive
  React.useEffect(() => {
    if (isActive && !isPlaying) {
      handlePlay();
    } else if (!isActive && isPlaying) {
      setIsPlaying(false);
    }
  }, [isActive]);

  // Notify parent about playing state changes
  React.useEffect(() => {
    if (onPlayingChange && isActive) {
      onPlayingChange(isPlaying);
    }
  }, [isPlaying, isActive, onPlayingChange]);

  const handlePlay = () => {
    setIsPlaying(true);
    onPlay();
  };

  const handleClose = () => {
    setIsPlaying(false);
  };

  const handleNavigate = (direction: 'up' | 'down') => {
    if (isPlaying) {
      setIsPlaying(false);
    }
    if (onNavigate) {
      onNavigate(direction);
    }
  };

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
      {isPlaying && isActive ? (
        <>
          <View style={styles.gameWrapper}>
            <GameContainer game={game} />
          </View>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={handleClose}
            testID={`close-button-${game.id}`}
          >
            <X color={COLORS.text} size={24} />
          </TouchableOpacity>
        </>
      ) : (
        <>
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
                onPress={handlePlay}
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
        </>
      )}
      
      {/* Navigation chevrons - visible in both states */}
      {isActive && (
        <View style={styles.navigationContainer}>
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => handleNavigate('up')}
            activeOpacity={0.7}
          >
            <ChevronUp color={COLORS.text} size={32} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => handleNavigate('down')}
            activeOpacity={0.7}
          >
            <ChevronDown color={COLORS.text} size={32} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height, // Full screen height
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
    marginBottom: 80,
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
  },
  gameWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  floatingRemixButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  navigationContainer: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -80 }],
    gap: 16,
    zIndex: 10,
  },
  navButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    opacity: 0.3,
    marginVertical: 8,
  }
});