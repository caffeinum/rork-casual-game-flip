// Mock games data with image, video preview, and game URLs
const GAMES_DATA = [
  {
    id: 'tap-speed',
    title: 'Tap Speed',
    description: 'How fast can you tap?',
    type: 'native',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop',
    previewVideo: 'https://www.w3schools.com/html/mov_bbb.mp4',
    previewGif: 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif',
    highScore: 0
  },
  {
    id: 'memory-match',
    title: 'Memory Match',
    description: 'Test your memory!',
    type: 'native',
    image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&h=600&fit=crop',
    previewVideo: 'https://www.w3schools.com/html/mov_bbb.mp4',
    previewGif: 'https://media.giphy.com/media/l0HlQ7LRalQqdWfao/giphy.gif',
    highScore: 0
  },
  {
    id: 'color-match',
    title: 'Color Match',
    description: 'Match the colors!',
    type: 'native',
    image: 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=800&h=600&fit=crop',
    previewVideo: 'https://www.w3schools.com/html/mov_bbb.mp4',
    previewGif: 'https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif',
    highScore: 0
  },
  {
    id: 'flappy-bird',
    title: 'Flappy Bird',
    description: 'Classic flappy game',
    type: 'webview',
    image: 'https://images.unsplash.com/photo-1567447013110-3df4406cea10?w=800&h=600&fit=crop',
    previewVideo: 'https://www.w3schools.com/html/mov_bbb.mp4',
    previewGif: 'https://media.giphy.com/media/euuaA2cwLEUuI/giphy.gif',
    gameUrl: 'https://playcanv.as/p/2OlkUaxF/',
    highScore: 0
  },
  {
    id: '2048',
    title: '2048',
    description: 'Slide and merge numbers',
    type: 'webview',
    image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&h=600&fit=crop',
    previewVideo: 'https://www.w3schools.com/html/mov_bbb.mp4',
    previewGif: 'https://media.giphy.com/media/l0HlQ7LRalQqdWfao/giphy.gif',
    gameUrl: 'https://hczhcz.github.io/2048/20ez/',
    highScore: 0
  },
  {
    id: 'fly-game',
    title: 'Fly Game',
    description: 'Navigate through obstacles',
    type: 'webview',
    image: 'https://images.unsplash.com/photo-1570527140771-020891229bb4?w=800&h=600&fit=crop',
    previewVideo: 'https://www.w3schools.com/html/mov_bbb.mp4',
    previewGif: 'https://media.giphy.com/media/3o7btZ1Gm7ZL25pLMs/giphy.gif',
    gameUrl: 'https://fly.pieter.com',
    highScore: 0
  },
  {
    id: 'agar-io',
    title: 'Agar.io Clone',
    description: 'Grow by eating cells (by quasa)',
    type: 'webview',
    image: 'https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?w=800&h=600&fit=crop',
    previewVideo: 'https://www.w3schools.com/html/mov_bbb.mp4',
    previewGif: 'https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif',
    gameUrl: 'https://v0-agar-io-clone-xi.vercel.app/',
    highScore: 0
  }
];

export async function GET(request: Request) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return Response.json({
    games: GAMES_DATA,
    success: true
  });
}