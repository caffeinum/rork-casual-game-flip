-- Games table
CREATE TABLE IF NOT EXISTS games (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  preview_video TEXT,
  preview_gif TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('native', 'webview')),
  game_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- High scores table for anonymous users
CREATE TABLE IF NOT EXISTS high_scores (
  id SERIAL PRIMARY KEY,
  game_id TEXT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  anon_token TEXT NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(game_id, anon_token)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_high_scores_game_token ON high_scores(game_id, anon_token);

-- Insert initial games data
INSERT INTO games (id, title, description, image, preview_video, preview_gif, type, game_url) VALUES
  ('flappy-bird', 'Flappy Bird', 'Navigate through pipes in this addictive classic', 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=800&auto=format&fit=crop', NULL, 'https://media.giphy.com/media/euuaA2cwLEUuI/giphy.gif', 'webview', 'https://playcanv.as/p/2OlkUaxF/'),
  ('2048', '2048', 'Combine tiles to reach the magical number', 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=800&auto=format&fit=crop', NULL, 'https://media.giphy.com/media/l0HlUsr30YgIHASl2/giphy.gif', 'webview', 'https://hczhcz.github.io/2048/20ez/'),
  ('fly-pieter', 'Fly', 'Simple flying game by Pieter Levels', 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&auto=format&fit=crop', NULL, 'https://media.giphy.com/media/3o7TKUZfJKUKuSWgZG/giphy.gif', 'webview', 'https://fly.pieter.com'),
  ('agar-io-clone', 'Agar.io Clone', 'Grow your cell in this multiplayer game', 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop', NULL, 'https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif', 'webview', 'https://v0-agar-io-clone-xi.vercel.app/'),
  ('color-stack', 'Color Stack', 'Stack blocks as high as you can', 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&auto=format&fit=crop', NULL, 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif', 'native', NULL),
  ('endless-runner', 'Endless Runner', 'Run as far as you can in this infinite adventure', 'https://images.unsplash.com/photo-1534488972470-d2f0195b2488?w=800&auto=format&fit=crop', NULL, 'https://media.giphy.com/media/l0HlHFRbmaZtBRhXG/giphy.gif', 'native', NULL)
ON CONFLICT (id) DO NOTHING;