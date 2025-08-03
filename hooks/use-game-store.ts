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
  const [anonToken, setAnonToken] = useState<string | null>(null);

  const gamesQuery = useQuery({
    queryKey: ['games'],
    queryFn: async () => {
      try {
        // Get stored anon token
        const storedToken = await AsyncStorage.getItem('anonToken');
        
        // Fetch games from API with anon token
        const headers: HeadersInit = {};
        if (storedToken) {
          headers['x-anon-token'] = storedToken;
        }
        
        const response = await fetch('/api/games', { headers });
        const data = await response.json();
        
        if (!response.ok || !data.success) {
          throw new Error('Failed to fetch games');
        }
        
        // Store anon token if we got a new one
        if (data.anonToken && data.anonToken !== storedToken) {
          await AsyncStorage.setItem('anonToken', data.anonToken);
          setAnonToken(data.anonToken);
        }
        
        // Get stored high scores (for offline support)
        const storedScores = await AsyncStorage.getItem('gameHighScores');
        const highScores = storedScores ? JSON.parse(storedScores) : {};
        
        // Merge API games with stored high scores (prefer server scores)
        const gamesWithScores = data.games.map((game: Game) => ({
          ...game,
          highScore: game.highScore || highScores[game.id] || 0
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

  const updateHighScore = async (gameId: string, score: number) => {
    // Update local state immediately
    const updatedGames = games.map(game => 
      game.id === gameId ? { ...game, highScore: score } : game
    );
    setGames(updatedGames);
    syncMutation.mutate(updatedGames);
    
    // Sync with database if we have an anon token
    if (anonToken) {
      try {
        const response = await fetch(`/api/games/${gameId}/score`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-anon-token': anonToken
          },
          body: JSON.stringify({ score })
        });
        
        if (!response.ok) {
          console.error('Failed to sync score with server');
        }
      } catch (error) {
        console.error('Failed to sync score:', error);
      }
    }
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