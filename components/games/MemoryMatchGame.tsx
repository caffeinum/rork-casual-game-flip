import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS } from '@/constants/colors';
import { useGameStore } from '@/hooks/use-game-store';
import { X } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

// Card symbols
const SYMBOLS = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍉', '🍍', '🥝'];

interface Card {
  id: number;
  symbol: string;
  flipped: boolean;
  matched: boolean;
}

export default function MemoryMatchGame() {
  const { endGame } = useGameStore();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState(0);

  const initializeGame = useCallback(() => {
    // Create pairs of cards with symbols
    const cardPairs = [...SYMBOLS, ...SYMBOLS]
      .map((symbol, index) => ({
        id: index,
        symbol,
        flipped: false,
        matched: false,
      }))
      .sort(() => Math.random() - 0.5); // Shuffle cards

    setCards(cardPairs);
    setFlippedCards([]);
    setMoves(0);
    setGameOver(false);
    setMatchedPairs(0);
  }, []);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Check for matches when two cards are flipped
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstCardId, secondCardId] = flippedCards;
      const firstCard = cards.find(card => card.id === firstCardId);
      const secondCard = cards.find(card => card.id === secondCardId);

      if (firstCard && secondCard && firstCard.symbol === secondCard.symbol) {
        // Match found
        setCards(prevCards =>
          prevCards.map(card =>
            card.id === firstCardId || card.id === secondCardId
              ? { ...card, matched: true }
              : card
          )
        );
        setMatchedPairs(prev => prev + 1);
        setFlippedCards([]);
      } else {
        // No match, flip cards back after delay
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              flippedCards.includes(card.id) && !card.matched
                ? { ...card, flipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }

      setMoves(prev => prev + 1);
    }
  }, [flippedCards, cards]);

  // Check if game is over
  useEffect(() => {
    if (matchedPairs === SYMBOLS.length && !gameOver) {
      setGameOver(true);
      endGame(100 - moves * 5); // Score based on fewer moves
    }
  }, [matchedPairs, gameOver, moves, endGame]);

  const handleCardPress = useCallback((cardId: number) => {
    // Ignore if already two cards flipped or card is already flipped/matched
    if (flippedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.flipped || card.matched) return;

    // Flip the card
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === cardId ? { ...card, flipped: true } : card
      )
    );
    
    setFlippedCards(prev => [...prev, cardId]);
  }, [flippedCards, cards]);

  const handleClose = useCallback(() => {
    if (gameOver) {
      endGame(100 - moves * 5);
    } else {
      endGame(0);
    }
  }, [gameOver, moves, endGame]);

  return (
    <View style={styles.container} testID="memory-match-game">
      <TouchableOpacity style={styles.closeButton} onPress={handleClose} testID="close-button">
        <X color={COLORS.text} size={24} />
      </TouchableOpacity>
      
      <View style={styles.infoContainer}>
        <Text style={styles.title}>Memory Match</Text>
        <Text style={styles.movesText}>Moves: {moves}</Text>
        <Text style={styles.pairsText}>Pairs: {matchedPairs}/{SYMBOLS.length}</Text>
      </View>

      {gameOver ? (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>Game Complete!</Text>
          <Text style={styles.finalScoreText}>Score: {100 - moves * 5}</Text>
          <TouchableOpacity style={styles.restartButton} onPress={initializeGame} testID="restart-button">
            <Text style={styles.restartText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.gridContainer}>
          {cards.map(card => (
            <TouchableOpacity
              key={card.id}
              style={[
                styles.card,
                card.flipped || card.matched ? styles.cardFlipped : {},
                card.matched ? styles.cardMatched : {}
              ]}
              onPress={() => handleCardPress(card.id)}
              disabled={card.flipped || card.matched}
              testID={`card-${card.id}`}
            >
              {(card.flipped || card.matched) ? (
                <Text style={styles.cardSymbol}>{card.symbol}</Text>
              ) : null}
            </TouchableOpacity>
          ))}
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
  movesText: {
    color: COLORS.textSecondary,
    fontSize: 18,
    marginBottom: 8,
  },
  pairsText: {
    color: COLORS.accent,
    fontSize: 18,
    fontWeight: 'bold',
  },
  gridContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
  },
  card: {
    width: width / 4 - 16,
    height: width / 4 - 16,
    margin: 6,
    borderRadius: 8,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFlipped: {
    backgroundColor: COLORS.primary,
  },
  cardMatched: {
    backgroundColor: COLORS.success,
  },
  cardSymbol: {
    fontSize: 32,
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