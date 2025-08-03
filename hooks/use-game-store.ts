import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation } from '@tanstack/react-query';
import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
import { Game } from '@/types/game';

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
        // Fetch games from API
        const response = await fetch('/api/games');
        const data = await response.json();
        
        if (!response.ok || !data.success) {
          throw new Error('Failed to fetch games');
        }
        
        // Get stored high scores
        const storedScores = await AsyncStorage.getItem('gameHighScores');
        const highScores = storedScores ? JSON.parse(storedScores) : {};
        
        // Merge API games with stored high scores
        const gamesWithScores = data.games.map((game: Game) => ({
          ...game,
          highScore: highScores[game.id] || game.highScore || 0
        }));
        
        return gamesWithScores;
      } catch (error) {
        console.error('Failed to load games:', error);
        // Return empty array on error
        return [];
      }
    }
  });

  const syncMutation = useMutation({
    mutationFn: async (updatedGames: Game[]) => {
      // Only store high scores, not the full games data
      const highScores = updatedGames.reduce((acc, game) => ({
        ...acc,
        [game.id]: game.highScore || 0
      }), {});
      await AsyncStorage.setItem('gameHighScores', JSON.stringify(highScores));
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