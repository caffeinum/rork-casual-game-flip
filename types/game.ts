export interface Game {
  id: string;
  title: string;
  description: string;
  previewGif: string;
  type: 'tapSpeed' | 'memoryMatch' | 'colorMatch';
  highScore?: number;
}

export interface GameState {
  isPlaying: boolean;
  score: number;
  gameOver: boolean;
}