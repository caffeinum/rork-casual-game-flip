import { query } from '../../../../../lib/neon';

export async function POST(request: Request, { params }: { params: { gameId: string } }) {
  try {
    const { gameId } = params;
    const { score } = await request.json();
    const anonToken = request.headers.get('x-anon-token');
    
    if (!anonToken) {
      return Response.json({ error: 'Anonymous token required' }, { status: 401 });
    }
    
    if (typeof score !== 'number' || score < 0) {
      return Response.json({ error: 'Invalid score' }, { status: 400 });
    }
    
    // Upsert high score (update if exists, insert if not)
    await query(
      `INSERT INTO high_scores (game_id, anon_token, score) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (game_id, anon_token) 
       DO UPDATE SET score = EXCLUDED.score, created_at = CURRENT_TIMESTAMP
       WHERE EXCLUDED.score > high_scores.score`,
      [gameId, anonToken, score]
    );
    
    return Response.json({ success: true, score });
  } catch (error) {
    console.error('Failed to save high score:', error);
    return Response.json({ error: 'Failed to save score' }, { status: 500 });
  }
}