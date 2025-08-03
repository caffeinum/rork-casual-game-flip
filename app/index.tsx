import React, { useRef, useState } from 'react';
import { StyleSheet, View, FlatList, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import { COLORS } from '@/constants/colors';
import GamePreview from '@/components/GamePreview';
import GameContainer from '@/components/GameContainer';
import { useGameStore } from '@/hooks/use-game-store';
import { Plus } from 'lucide-react-native';
import { router } from 'expo-router';

const { height } = Dimensions.get('window');

export default function GameFeedScreen() {
  const { games, currentGameIndex, setCurrentGameIndex, startGame, isLoading } = useGameStore();
  const [scale, setScale] = useState(1);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const handlePinchGesture = (event: any) => {
    if (Platform.OS === 'web') {
      // Simple implementation for web
      if (event.nativeEvent.scale > 1.2) {
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
        if (scale > 1.2) {
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

  const handleNavigate = (direction: 'up' | 'down') => {
    let nextIndex = currentGameIndex;
    if (direction === 'up' && currentGameIndex > 0) {
      nextIndex = currentGameIndex - 1;
    } else if (direction === 'down' && currentGameIndex < games.length - 1) {
      nextIndex = currentGameIndex + 1;
    }
    
    if (nextIndex !== currentGameIndex) {
      setCurrentGameIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }
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
        <FlatList
          ref={flatListRef}
          data={games}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <GamePreview 
              game={item} 
              onPlay={() => handlePlayGame(index)}
              isActive={index === currentGameIndex}
              onPlayingChange={(playing) => {
                if (index === currentGameIndex) {
                  setScrollEnabled(!playing);
                }
              }}
              onNavigate={handleNavigate}
            />
          )}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToInterval={height}
          decelerationRate="fast"
          initialScrollIndex={currentGameIndex}
          scrollEnabled={scrollEnabled}
          getItemLayout={(_, index) => ({
            length: height,
            offset: height * index,
            index,
          })}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(
              event.nativeEvent.contentOffset.y / height
            );
            setCurrentGameIndex(index);
          }}
        />
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={() => router.push('/submit-game')}
        >
          <Plus color={COLORS.text} size={24} />
        </TouchableOpacity>
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
  submitButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
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
  },
});