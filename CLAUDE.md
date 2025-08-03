# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native/Expo mobile application featuring casual mini-games. Built with TypeScript, it uses Expo Router for navigation, Zustand/React Query for state management, and NativeWind for styling.

## Development Commands

```bash
# Start development server with tunnel (required for mobile device testing)
bun run start

# Start web development server
bun run start-web

# Start web development with debug logs
bun run start-web-dev
```

All commands use `rork` CLI with project ID `di1b0xsrk9v47dniceypv`.

## API Routes

The app uses Expo API routes located in `/app/api/`:
- `/api/games` - GET endpoint that returns games list with:
  - `id`: Unique game identifier
  - `title`: Game display name
  - `description`: Short game description
  - `image`: Cover image URL
  - `previewVideo`: Video preview URL (optional)
  - `previewGif`: Animated GIF preview
  - `type`: Either "native" (built-in) or "webview" (external URL)
  - `gameUrl`: External game URL (for webview games only)
  - `highScore`: User's high score

## Architecture

### Game Types
The app supports two types of games:
1. **Native Games** - Built-in React Native components:
   - `tap-speed` - Speed tapping challenge
   - `memory-match` - Memory card matching game  
   - `color-match` - Color matching game
2. **WebView Games** - External games loaded via WebView with URLs

### Navigation Structure
- **Expo Router** (file-based routing) in `/app` directory
- Main screen displays game carousel with swipeable game previews
- Games are played in fullscreen modal overlays

### State Management
- **use-game-store.ts**: Custom hook using React Query and AsyncStorage for:
  - Game state persistence
  - High score tracking
  - Current game selection
  - Play state management

### Component Structure
- `/components/games/` - Individual game implementations:
  - `TapSpeedGame.tsx` - Native tap speed game
  - `MemoryMatchGame.tsx` - Native memory matching game
  - `ColorMatchGame.tsx` - Native color matching game
  - `WebViewGame.tsx` - WebView wrapper for external games
- `/components/GameContainer.tsx` - Routes games to appropriate component
- `/components/GamePreview.tsx` - Game card display component

### Key Technical Stack
- **NativeWind** v4 for Tailwind-style styling
- **React Query** for async state management
- **AsyncStorage** for local data persistence (high scores only)
- **Expo Haptics** for tactile feedback
- **React Native Gesture Handler** for swipe interactions
- **React Native WebView** for external game integration
- **Lucide React Native** for icons

## Important Patterns

### Game Implementation
Each game component must:
1. Accept `onGameOver` callback with final score
2. Manage its own game state (timer, score, etc.)
3. Use `GameContainer` wrapper for consistent UI
4. Provide haptic feedback for user actions

### Color Scheme
Defined in `/constants/colors.ts`:
- Dark purple/blue gradient backgrounds
- Neon accent colors for interactive elements
- High contrast for readability

### Data Flow
1. Games list is fetched from `/api/games` endpoint
2. High scores are stored locally in AsyncStorage
3. Game data from API is merged with local high scores
4. Game carousel maintains current selection index
5. Native games are rendered as React components
6. WebView games load external URLs in iframe/webview

## Recent Updates

### Backend Integration (2025-08-03)
- Added Expo API routes with `/api/games` endpoint
- Implemented WebView game support for external games
- Games now fetched from API with image, video preview, and game URLs
- High scores stored locally while game data comes from backend
- Both native and WebView games supported seamlessly
- Added Snake and Space Invaders games via WebView integration

## Reminders
- Remember to write frontend with escaped apos
- Do not run `bun run start` or `bun run start-web` for expo app. Run it manually on a separate tab