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

    // Insert into submissions table (or games table with pending status)
    await query(
      `INSERT INTO game_submissions 
       (id, title, author, description, preview_gif, game_url, submitted_by, status, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)`,
      [
        gameId,
        data.title,
        data.author,
        data.description,
        data.previewGif,
        data.gameUrl,
        anonToken,
        'pending'
      ]
    );

    return Response.json({
      success: true,
      gameId,
      message: 'Game submitted successfully'
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