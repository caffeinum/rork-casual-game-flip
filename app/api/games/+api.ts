import { query, generateAnonToken } from '../../../lib/neon';

interface GameRow {
  id: string;
  title: string;
  description: string;
  image: string;
  preview_video: string | null;
  preview_gif: string;
  type: 'native' | 'webview';
  game_url: string | null;
}

interface HighScoreRow {
  game_id: string;
  score: number;
}

// Fallback games data when database is not configured
const FALLBACK_GAMES = [
  {
    id: 'tap-speed',
    title: 'Tap Speed',
    description: 'How fast can you tap?',
    type: 'native' as const,
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop',
    previewVideo: 'https://www.w3schools.com/html/mov_bbb.mp4',
    previewGif: 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif',
    gameUrl: null,
    highScore: 0
  },
  {
    id: 'memory-match',
    title: 'Memory Match',
    description: 'Test your memory!',
    type: 'native' as const,
    image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&h=600&fit=crop',
    previewVideo: 'https://www.w3schools.com/html/mov_bbb.mp4',
    previewGif: 'https://media.giphy.com/media/l0HlQ7LRalQqdWfao/giphy.gif',
    gameUrl: null,
    highScore: 0
  },
  {
    id: 'color-match',
    title: 'Color Match',
    description: 'Match the colors!',
    type: 'native' as const,
    image: 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=800&h=600&fit=crop',
    previewVideo: 'https://www.w3schools.com/html/mov_bbb.mp4',
    previewGif: 'https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif',
    gameUrl: null,
    highScore: 0
  },
  {
    id: 'flappy-bird',
    title: 'Flappy Bird',
    description: 'Classic flappy game',
    type: 'webview' as const,
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
    type: 'webview' as const,
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
    type: 'webview' as const,
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
    type: 'webview' as const,
    image: 'https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?w=800&h=600&fit=crop',
    previewVideo: 'https://www.w3schools.com/html/mov_bbb.mp4',
    previewGif: 'https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif',
    gameUrl: 'https://v0-agar-io-clone-xi.vercel.app/',
    highScore: 0
  },
  {
    id: 'snake',
    title: 'Snake',
    description: 'Classic snake game',
    type: 'webview' as const,
    image: 'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=800&h=600&fit=crop',
    previewVideo: 'https://www.w3schools.com/html/mov_bbb.mp4',
    previewGif: 'https://media.giphy.com/media/3o7btZ1Gm7ZL25pLMs/giphy.gif',
    gameUrl: 'https://v0-snake-game-design-dun.vercel.app/',
    highScore: 0
  },
  {
    id: 'space-invaders',
    title: 'Space Invaders',
    description: 'Defend earth from invaders',
    type: 'webview' as const,
    image: 'https://images.unsplash.com/photo-1614726365952-510103b1bbb4?w=800&h=600&fit=crop',
    previewVideo: 'https://www.w3schools.com/html/mov_bbb.mp4',
    previewGif: 'https://media.giphy.com/media/l0HlQ7LRalQqdWfao/giphy.gif',
    gameUrl: 'https://v0-space-flying-game.vercel.app/',
    highScore: 0
  }
];

export async function GET(request: Request) {
  try {
    // Get anon token from headers or generate new one
    const anonToken = request.headers.get('x-anon-token') || generateAnonToken();
    
    // Fetch games from database
    const games = await query<GameRow>('SELECT * FROM games ORDER BY created_at DESC');
    
    // Fetch high scores for this anonymous user
    const highScores = await query<HighScoreRow>(
      'SELECT game_id, score FROM high_scores WHERE anon_token = $1',
      [anonToken]
    );
    
    // Create a map of high scores
    const scoreMap = highScores.reduce((map, score) => {
      map[score.game_id] = score.score;
      return map;
    }, {} as Record<string, number>);
    
    // Combine games with high scores
    const gamesWithScores = games.map(game => ({
      id: game.id,
      title: game.title,
      description: game.description,
      image: game.image,
      previewVideo: game.preview_video,
      previewGif: game.preview_gif,
      type: game.type,
      gameUrl: game.game_url,
      highScore: scoreMap[game.id] || 0
    }));
    
    return Response.json({
      games: gamesWithScores,
      anonToken,
      success: true
    }, {
      headers: {
        'x-anon-token': anonToken
      }
    });
  } catch (error) {
    console.error('Failed to fetch games:', error);
    
    // Return fallback data if database is not configured
    const anonToken = generateAnonToken();
    return Response.json({
      games: FALLBACK_GAMES.reverse(), // Show newest first
      anonToken,
      success: true,
      fallback: true
    }, {
      headers: {
        'x-anon-token': anonToken
      }
    });
  }
}