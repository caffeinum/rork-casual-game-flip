import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Game } from '@/types/game';
import TapSpeedGame from './games/TapSpeedGame';
import MemoryMatchGame from './games/MemoryMatchGame';
import ColorMatchGame from './games/ColorMatchGame';

interface GameContainerProps {
  game: Game;
}

export default function GameContainer({ game }: GameContainerProps) {
  const renderGame = () => {
    switch (game.type) {
      case 'tapSpeed':
        return <TapSpeedGame />;
      case 'memoryMatch':
        return <MemoryMatchGame />;
      case 'colorMatch':
        return <ColorMatchGame />;
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