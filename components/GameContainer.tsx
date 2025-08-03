import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Game } from '@/types/game';
import TapSpeedGame from './games/TapSpeedGame';
import MemoryMatchGame from './games/MemoryMatchGame';
import ColorMatchGame from './games/ColorMatchGame';
import { WebViewGame } from './games/WebViewGame';
import { useGameStore } from '@/hooks/use-game-store';

interface GameContainerProps {
  game: Game;
}

export default function GameContainer({ game }: GameContainerProps) {
  const { endGame } = useGameStore();

  const renderGame = () => {
    if (game.type === 'webview' && game.gameUrl) {
      return (
        <WebViewGame 
          gameUrl={game.gameUrl}
          title={game.title}
          onGameOver={endGame}
        />
      );
    }

    // Map game IDs to native components
    switch (game.id) {
      case 'tap-speed':
        return <TapSpeedGame onGameOver={endGame} />;
      case 'memory-match':
        return <MemoryMatchGame onGameOver={endGame} />;
      case 'color-match':
        return <ColorMatchGame onGameOver={endGame} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container} testID={`game-container-${game.id}`}>
      {renderGame()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});