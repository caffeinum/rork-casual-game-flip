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

## Architecture

### Game Types
The app supports three game types defined in `types/game.ts`:
- `tapSpeed` - Speed tapping challenge
- `memoryMatch` - Memory card matching game  
- `colorMatch` - Color matching game

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
  - `TapSpeedGame.tsx`
  - `MemoryMatchGame.tsx`
  - `ColorMatchGame.tsx`
- `/components/GameContainer.tsx` - Shared game UI wrapper
- `/components/GamePreview.tsx` - Game card display component

### Key Technical Stack
- **NativeWind** v4 for Tailwind-style styling
- **React Query** for async state management
- **AsyncStorage** for local data persistence
- **Expo Haptics** for tactile feedback
- **React Native Gesture Handler** for swipe interactions
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
1. Games are loaded from AsyncStorage or initialized with mock data
2. High scores are automatically persisted after each game
3. Game carousel maintains current selection index
4. Modal presentation for immersive gameplay

## Reminders
- Remember to write frontend with escaped apos
- Do not run `bun run start` or `bun run start-web` for expo app. Run it manually on a separate tab