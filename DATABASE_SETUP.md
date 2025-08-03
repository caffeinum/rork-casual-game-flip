# Database Setup Guide

This app uses Neon (serverless PostgreSQL) for storing games and high scores.

## Quick Setup

1. **Create a Neon Account**
   - Go to [neon.tech](https://neon.tech)
   - Sign up for a free account
   - Create a new project

2. **Get Your Connection String**
   - In your Neon dashboard, find your connection string
   - It looks like: `postgresql://username:password@host.neon.tech/neondb?sslmode=require`

3. **Configure Your App**
   - Copy your connection string
   - Update `.env.local` with your actual connection string:
   ```
   DATABASE_URL=postgresql://your-actual-connection-string-here
   ```

4. **Initialize the Database**
   ```bash
   bun run scripts/init-db.ts
   ```

## What Gets Created

- **games** table: Stores all game information
- **high_scores** table: Stores anonymous user high scores
- Initial game data is populated automatically

## How It Works

- Each device gets a unique anonymous token
- High scores are saved per device/token
- No user accounts or login required
- Falls back to local storage if database is unavailable

## Troubleshooting

- Make sure your `.env.local` file has the correct connection string
- Check that your Neon database is active (free tier suspends after 5 min inactivity)
- The app works without a database - it will use local storage as fallback