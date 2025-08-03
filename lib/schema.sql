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

-- Game submissions table
CREATE TABLE IF NOT EXISTS game_submissions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT,
  preview_gif TEXT NOT NULL,
  game_url TEXT NOT NULL,
  submitted_by TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP,
  review_notes TEXT
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_submissions_status ON game_submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_author ON game_submissions(author);

-- Insert initial games data
INSERT INTO games (id, title, description, image, preview_video, preview_gif, type, game_url) VALUES
  ('tap-speed', 'Tap Speed', 'How fast can you tap?', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop', 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif', 'native', NULL),
  ('memory-match', 'Memory Match', 'Test your memory!', 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&h=600&fit=crop', 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://media.giphy.com/media/l0HlQ7LRalQqdWfao/giphy.gif', 'native', NULL),
  ('color-match', 'Color Match', 'Match the colors!', 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=800&h=600&fit=crop', 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif', 'native', NULL),
  ('flappy-bird', 'Flappy Bird', 'Classic flappy game', 'https://images.unsplash.com/photo-1567447013110-3df4406cea10?w=800&h=600&fit=crop', 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://media.giphy.com/media/euuaA2cwLEUuI/giphy.gif', 'webview', 'https://playcanv.as/p/2OlkUaxF/'),
  ('2048', '2048', 'Slide and merge numbers', 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&h=600&fit=crop', 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://media.giphy.com/media/l0HlQ7LRalQqdWfao/giphy.gif', 'webview', 'https://hczhcz.github.io/2048/20ez/'),
  ('fly-game', 'Fly Game', 'Navigate through obstacles', 'https://images.unsplash.com/photo-1570527140771-020891229bb4?w=800&h=600&fit=crop', 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://media.giphy.com/media/3o7btZ1Gm7ZL25pLMs/giphy.gif', 'webview', 'https://fly.pieter.com'),
  ('agar-io', 'Agar.io Clone', 'Grow by eating cells (by quasa)', 'https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?w=800&h=600&fit=crop', 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif', 'webview', 'https://v0-agar-io-clone-xi.vercel.app/'),
  ('snake', 'Snake', 'Classic snake game', 'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=800&h=600&fit=crop', 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://media.giphy.com/media/3o7btZ1Gm7ZL25pLMs/giphy.gif', 'webview', 'https://v0-snake-game-design-dun.vercel.app/'),
  ('space-invaders', 'Space Invaders', 'Defend earth from invaders', 'https://images.unsplash.com/photo-1614726365952-510103b1bbb4?w=800&h=600&fit=crop', 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://media.giphy.com/media/l0HlQ7LRalQqdWfao/giphy.gif', 'webview', 'https://v0-space-flying-game.vercel.app/')
ON CONFLICT (id) DO NOTHING;