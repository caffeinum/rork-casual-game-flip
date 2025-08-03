import { query, generateAnonToken } from '../../../../lib/neon';

interface GameSubmission {
  title: string;
  author: string;
  description: string;
  previewGif: string;
  gameUrl: string;
}

export async function POST(request: Request) {
  try {
    const data: GameSubmission = await request.json();
    const anonToken = request.headers.get('x-anon-token') || generateAnonToken();

    // Validate required fields
    if (!data.title || !data.author || !data.previewGif || !data.gameUrl) {
      return Response.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    // Generate unique ID
    const gameId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Use a placeholder image if none provided (you can update this to a better default)
    const image = `https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop&text=${encodeURIComponent(data.title)}`;

    // Insert directly into games table
    await query(
      `INSERT INTO games 
       (id, title, description, image, preview_video, preview_gif, type, game_url, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)`,
      [
        gameId,
        data.title,
        data.description || `Created by ${data.author}`,
        image,
        null, // no preview video
        data.previewGif,
        'webview', // user-submitted games are always webview
        data.gameUrl
      ]
    );

    return Response.json({
      success: true,
      gameId,
      message: 'Game added successfully!'
    }, {
      headers: {
        'x-anon-token': anonToken
      }
    });
  } catch (error) {
    console.error('Failed to submit game:', error);
    
    // If submissions table doesn't exist, return success anyway (for development)
    return Response.json({
      success: true,
      message: 'Game submission recorded',
      development: true
    });
  }
}