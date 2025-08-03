import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS } from '@/constants/colors';
import { X } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
const GAME_DURATION = 10; // seconds

interface TapSpeedGameProps {
  onGameOver: (score: number) => void;
}

export default function TapSpeedGame({ onGameOver }: TapSpeedGameProps) {
  const [taps, setTaps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (gameOver) {
      onGameOver(taps);
    }
  }, [gameOver, taps, onGameOver]);

  const handleTap = useCallback(() => {
    if (!gameStarted) {
      setGameStarted(true);
    }
    
    if (gameStarted && !gameOver) {
      setTaps((prev) => prev + 1);
    }
  }, [gameStarted, gameOver]);

  const handleClose = useCallback(() => {
    if (gameStarted && !gameOver) {
      setGameOver(true);
      onGameOver(taps);
    } else {
      onGameOver(0);
    }
  }, [gameStarted, gameOver, taps, onGameOver]);

  const restartGame = useCallback(() => {
    setTaps(0);
    setTimeLeft(GAME_DURATION);
    setGameStarted(false);
    setGameOver(false);
  }, []);

  return (
    <View style={styles.container} testID="tap-speed-game">
      <TouchableOpacity style={styles.closeButton} onPress={handleClose} testID="close-button">
        <X color={COLORS.text} size={24} />
      </TouchableOpacity>
      
      <View style={styles.infoContainer}>
        <Text style={styles.title}>Tap Speed</Text>
        <Text style={styles.timeText}>Time: {timeLeft}s</Text>
        <Text style={styles.scoreText}>Taps: {taps}</Text>
      </View>

      {gameOver ? (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>Game Over!</Text>
          <Text style={styles.finalScoreText}>Your Score: {taps} taps</Text>
          <Text style={styles.rateText}>({(taps / GAME_DURATION).toFixed(1)} taps/second)</Text>
          <TouchableOpacity style={styles.restartButton} onPress={restartGame} testID="restart-button">
            <Text style={styles.restartText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.tapArea} 
          onPress={handleTap}
          activeOpacity={0.7}
          testID="tap-area"
        >
          <Text style={styles.tapText}>
            {gameStarted ? 'TAP!' : 'Tap to Start!'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height: height - 100,
    backgroundColor: COLORS.background,
    justifyContent: 'space-between',
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  timeText: {
    color: COLORS.textSecondary,
    fontSize: 18,
    marginBottom: 8,
  },
  scoreText: {
    color: COLORS.accent,
    fontSize: 24,
    fontWeight: 'bold',
  },
  tapArea: {
    backgroundColor: COLORS.primary,
    flex: 1,
    margin: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tapText: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: 'bold',
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverText: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  finalScoreText: {
    color: COLORS.accent,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  rateText: {
    color: COLORS.textSecondary,
    fontSize: 18,
    marginBottom: 32,
  },
  restartButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  restartText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  }
});