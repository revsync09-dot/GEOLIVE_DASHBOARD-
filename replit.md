# GeoLive Dashboard

A premium Discord bot dashboard for managing GeoLive - a real-time geo-data feed bot that provides earthquake alerts, weather updates, ISS tracking, and aurora forecasts to Discord servers.

## Overview

This is a full-stack web application built with:
- **Frontend**: React + TypeScript + TailwindCSS
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL (ready for integration)
- **Authentication**: Discord OAuth2

## Features

### Core Functionality
- **Discord OAuth2 Login** - Secure authentication via Discord with identify and guilds scopes
- **Server Selection** - Beautiful grid of managed Discord servers with glassmorphic card design
- **Guild Settings** - Per-server configuration for geo feeds including:
  - Earthquake feed toggle
  - Weather feed toggle
  - ISS tracker toggle
  - Aurora alerts toggle
  - Update interval selector (5-60 minutes)
  - Custom embed styling (primary color, icon, banner)
- **Live Geo Widgets** - Location-based real-time data:
  - Local weather from WeatherAPI
  - Nearby earthquakes from USGS
  - ISS position from Open-Notify
  - Aurora forecast from NOAA

### Design
- Dark mode with glassmorphic UI
- Gradient backgrounds and glowing effects
- Responsive layout with sidebar navigation
- Premium, modern aesthetic matching Discord's style

## Project Structure

```
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── layout/       # App layout (sidebar, navbar)
│   │   │   ├── widgets/      # Geo data widgets
│   │   │   └── ui/           # Shadcn UI components
│   │   ├── pages/            # Route pages
│   │   ├── lib/              # Utilities and context
│   │   └── hooks/            # React hooks
├── server/                    # Express backend
│   ├── routes.ts             # API endpoints
│   ├── storage.ts            # Data storage interface
│   └── index.ts              # Server entry point
├── shared/                    # Shared types
│   └── schema.ts             # Zod schemas and types
└── design_guidelines.md       # UI design specifications
```

## Environment Variables

Required secrets (configured in Replit Secrets):
- `DISCORD_CLIENT_ID` - Discord OAuth application client ID
- `DISCORD_CLIENT_SECRET` - Discord OAuth application secret
- `WEATHER_API_KEY` - WeatherAPI.com API key
- `SESSION_SECRET` - Session encryption key

Database (auto-configured by Replit):
- `DATABASE_URL` - PostgreSQL connection string

## API Endpoints

### Authentication
- `GET /api/auth/discord` - Start Discord OAuth flow
- `GET /api/auth/discord/callback` - OAuth callback handler
- `GET /api/auth/me` - Get current user session
- `POST /api/auth/logout` - End session

### Location
- `POST /api/location/update` - Update user's GPS coordinates

### Guild Configuration
- `GET /api/guild/:guildId/config` - Get guild settings
- `POST /api/guild/:guildId/save` - Save guild settings

### Geo Data (requires location)
- `GET /api/local/weather` - Current weather at user location
- `GET /api/local/earthquakes` - Recent earthquakes within 500km
- `GET /api/local/iss` - Current ISS position
- `GET /api/local/aurora` - Aurora visibility forecast

## Development

The app runs on port 5000 with:
```bash
npm run dev
```

This starts both the Express backend and Vite dev server.

## Recent Changes

- December 2024: Initial build with Discord OAuth, guild management, and geo widgets
- Implemented glassmorphic dark mode design
- Added all four geo data feeds (weather, earthquakes, ISS, aurora)
- Created responsive sidebar navigation

## User Preferences

- Dark mode by default
- Inter font family
- Purple/indigo/blue gradient accents
- Rounded corners (rounded-2xl for cards)
- Glassmorphic styling with backdrop-blur
