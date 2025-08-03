import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation } from '@tanstack/react-query';
import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
import { Game } from '@/types/game';
import { GAMES } from '@/mocks/games';

interface GameStore {
  games: Game[];
  currentGameIndex: number;
  isPlaying: boolean;
  setCurrentGameIndex: (index: number) => void;
  startGame: () => void;
  endGame: (score: number) => void;
  updateHighScore: (gameId: string, score: number) => void;
  isLoading: boolean;
}

export const [GameStoreProvider, useGameStore] = createContextHook(() => {
  const [games, setGames] = useState<Game[]>([]);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const gamesQuery = useQuery({
    queryKey: ['games'],
    queryFn: async () => {
      try {
        const storedGames = await AsyncStorage.getItem('games');
        if (storedGames) {
          return JSON.parse(storedGames) as Game[];
        }
        // Initialize with mock data if no stored games
        await AsyncStorage.setItem('games', JSON.stringify(GAMES));
        return GAMES;
      } catch (error) {
        console.error('Failed to load games:', error);
        return GAMES;
      }
    }
  });

  const syncMutation = useMutation({
    mutationFn: async (updatedGames: Game[]) => {
      await AsyncStorage.setItem('games', JSON.stringify(updatedGames));
      return updatedGames;
    }
  });

  useEffect(() => {
    if (gamesQuery.data) {
      setGames(gamesQuery.data);
    }
  }, [gamesQuery.data]);

  const startGame = () => {
    setIsPlaying(true);
  };

  const endGame = (score: number) => {
    setIsPlaying(false);
    const currentGame = games[currentGameIndex];
    if (currentGame && (currentGame.highScore === undefined || score > currentGame.highScore)) {
      updateHighScore(currentGame.id, score);
    }
  };

  const updateHighScore = (gameId: string, score: number) => {
    const updatedGames = games.map(game => 
      game.id === gameId ? { ...game, highScore: score } : game
    );
    setGames(updatedGames);
    syncMutation.mutate(updatedGames);
  };

  return {
    games,
    currentGameIndex,
    isPlaying,
    setCurrentGameIndex,
    startGame,
    endGame,
    updateHighScore,
    isLoading: gamesQuery.isLoading
  };
});