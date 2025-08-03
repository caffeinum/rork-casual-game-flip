export interface Game {
  id: string;
  title: string;
  description: string;
  image: string;
  previewVideo?: string;
  previewGif: string;
  type: 'native' | 'webview';
  gameUrl?: string; // For webview games
  highScore?: number;
}

export interface GameState {
  isPlaying: boolean;
  score: number;
  gameOver: boolean;
}