import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS } from '@/constants/colors';
import { useGameStore } from '@/hooks/use-game-store';
import { X } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const COLOR_NAMES = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE'];
const COLOR_VALUES = {
  RED: '#F44336',
  BLUE: '#2196F3',
  GREEN: '#4CAF50',
  YELLOW: '#FFEB3B',
  PURPLE: '#9C27B0'
};

interface ColorChallenge {
  text: string;
  textColor: string;
  correctAnswer: boolean;
}

export default function ColorMatchGame() {
  const { endGame } = useGameStore();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState<ColorChallenge | null>(null);

  // Generate a new challenge
  const generateChallenge = useCallback(() => {
    const textIndex = Math.floor(Math.random() * COLOR_NAMES.length);
    const text = COLOR_NAMES[textIndex];
    
    // Randomly decide if this should be a match or not
    const correctAnswer = Math.random() > 0.5;
    
    if (correctAnswer) {
      // Make it a match (text and color match)
      return { text, textColor: COLOR_VALUES[text as keyof typeof COLOR_VALUES], correctAnswer };
    } else {
      // Make sure it's not a match
      const nonMatchingColor = COLOR_NAMES.filter(color => color !== text)[
        Math.floor(Math.random() * (COLOR_NAMES.length - 1))
      ];
      return { 
        text, 
        textColor: COLOR_VALUES[nonMatchingColor as keyof typeof COLOR_VALUES], 
        correctAnswer 
      };
    }
  }, []);

  // Initialize game
  useEffect(() => {
    if (gameStarted && !gameOver) {
      setCurrentChallenge(generateChallenge());
      
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
  }, [gameStarted, gameOver, generateChallenge]);

  useEffect(() => {
    if (gameOver) {
      endGame(score);
    }
  }, [gameOver, score, endGame]);

  const handleAnswer = useCallback((userAnswer: boolean) => {
    if (!currentChallenge || gameOver) return;
    
    if (userAnswer === currentChallenge.correctAnswer) {
      setScore(prev => prev + 1);
    }
    
    setCurrentChallenge(generateChallenge());
  }, [currentChallenge, gameOver, generateChallenge]);

  const startGame = useCallback(() => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    setCurrentChallenge(generateChallenge());
  }, [generateChallenge]);

  const handleClose = useCallback(() => {
    if (gameStarted && !gameOver) {
      setGameOver(true);
      endGame(score);
    } else {
      endGame(0);
    }
  }, [gameStarted, gameOver, score, endGame]);

  return (
    <View style={styles.container} testID="color-match-game">
      <TouchableOpacity style={styles.closeButton} onPress={handleClose} testID="close-button">
        <X color={COLORS.text} size={24} />
      </TouchableOpacity>
      
      <View style={styles.infoContainer}>
        <Text style={styles.title}>Color Match</Text>
        <Text style={styles.timeText}>Time: {timeLeft}s</Text>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>

      {!gameStarted ? (
        <View style={styles.startContainer}>
          <Text style={styles.instructionText}>
            Does the color of the text match the word?
          </Text>
          <TouchableOpacity style={styles.startButton} onPress={startGame} testID="start-button">
            <Text style={styles.startText}>Start Game</Text>
          </TouchableOpacity>
        </View>
      ) : gameOver ? (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>Game Over!</Text>
          <Text style={styles.finalScoreText}>Your Score: {score}</Text>
          <TouchableOpacity style={styles.restartButton} onPress={startGame} testID="restart-button">
            <Text style={styles.restartText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.gameContainer}>
          {currentChallenge && (
            <>
              <Text 
                style={[styles.colorText, { color: currentChallenge.textColor }]}
                testID="challenge-text"
              >
                {currentChallenge.text}
              </Text>
              
              <View style={styles.buttonsContainer}>
                <TouchableOpacity 
                  style={[styles.answerButton, styles.matchButton]} 
                  onPress={() => handleAnswer(true)}
                  testID="match-button"
                >
                  <Text style={styles.answerText}>MATCH</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.answerButton, styles.noMatchButton]} 
                  onPress={() => handleAnswer(false)}
                  testID="no-match-button"
                >
                  <Text style={styles.answerText}>NO MATCH</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height: height - 100,
    backgroundColor: COLORS.background,
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
    marginBottom: 20,
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
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  answerButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 24,
    minWidth: 140,
    alignItems: 'center',
  },
  matchButton: {
    backgroundColor: COLORS.success,
  },
  noMatchButton: {
    backgroundColor: COLORS.error,
  },
  answerText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  instructionText: {
    color: COLORS.text,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  startText: {
    color: COLORS.text,
    fontSize: 18,
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