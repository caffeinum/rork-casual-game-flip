import React, { useRef, useState } from 'react';
import { StyleSheet, View, FlatList, Dimensions, Platform } from 'react-native';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import { COLORS } from '@/constants/colors';
import GamePreview from '@/components/GamePreview';
import GameContainer from '@/components/GameContainer';
import { useGameStore } from '@/hooks/use-game-store';

const { height } = Dimensions.get('window');

export default function GameFeedScreen() {
  const { games, currentGameIndex, setCurrentGameIndex, isPlaying, startGame, isLoading } = useGameStore();
  const [scale, setScale] = useState(1);
  const flatListRef = useRef<FlatList>(null);

  const handlePinchGesture = (event: any) => {
    if (Platform.OS === 'web') {
      // Simple implementation for web
      if (event.nativeEvent.scale > 1.2 && !isPlaying) {
        const nextIndex = (currentGameIndex + 1) % games.length;
        setCurrentGameIndex(nextIndex);
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      }
    } else {
      // Full implementation for native
      if (event.nativeEvent.state === State.ACTIVE) {
        setScale(event.nativeEvent.scale);
      }
      
      if (event.nativeEvent.state === State.END) {
        if (scale > 1.2 && !isPlaying) {
          const nextIndex = (currentGameIndex + 1) % games.length;
          setCurrentGameIndex(nextIndex);
          flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        }
        setScale(1);
      }
    }
  };

  const handlePlayGame = (gameIndex: number) => {
    setCurrentGameIndex(gameIndex);
    startGame();
  };

  if (isLoading) {
    return <View style={styles.loadingContainer} />;
  }

  return (
    <PinchGestureHandler
      onGestureEvent={handlePinchGesture}
      onHandlerStateChange={handlePinchGesture}
    >
      <View style={styles.container} testID="game-feed-screen">
        {isPlaying ? (
          <GameContainer game={games[currentGameIndex]} />
        ) : (
          <FlatList
            ref={flatListRef}
            data={games}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <GamePreview 
                game={item} 
                onPlay={() => handlePlayGame(index)}
              />
            )}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            snapToInterval={height - 100}
            decelerationRate="fast"
            initialScrollIndex={currentGameIndex}
            getItemLayout={(_, index) => ({
              length: height - 100,
              offset: (height - 100) * index,
              index,
            })}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.y / (height - 100)
              );
              setCurrentGameIndex(index);
            }}
          />
        )}
      </View>
    </PinchGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});