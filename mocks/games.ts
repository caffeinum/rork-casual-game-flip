import { Game } from '@/types/game';

export const GAMES: Game[] = [
  {
    id: '1',
    title: 'Tap Speed',
    description: 'How fast can you tap? Test your reflexes!',
    previewGif: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format&fit=crop',
    type: 'tapSpeed',
  },
  {
    id: '2',
    title: 'Memory Match',
    description: 'Match the cards and test your memory!',
    previewGif: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?q=80&w=400&auto=format&fit=crop',
    type: 'memoryMatch',
  },
  {
    id: '3',
    title: 'Color Match',
    description: 'Match the color to the word as fast as you can!',
    previewGif: 'https://images.unsplash.com/photo-1608501078713-8e445a709b39?q=80&w=400&auto=format&fit=crop',
    type: 'colorMatch',
  },
];