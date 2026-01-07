# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Text-to-Speech Generator** - A full-stack web application using OpenAI's TTS API to convert text into natural-sounding audio. Built with Node.js + Express (backend) and React (frontend).

### Key Characteristics
- Monorepo structure: `/backend` (Express server) and `/frontend` (React app)
- Single API endpoint: `POST /api/tts` for text-to-speech conversion
- Streaming audio delivery with no server-side storage
- Six voice options (nova, alloy, shimmer, echo, fiona, onyx)
- Text limit: 4000 characters
- Average generation time: 5-10 seconds

## Common Commands

### Backend
```bash
# From backend/ directory
npm start              # Start Express server on port 5000
npm install            # Install dependencies
```

### Frontend
```bash
# From frontend/ directory
npm start              # Start React dev server on port 3000 (opens browser automatically)
npm build              # Create production build
npm test               # Run test suite
```

### Full Stack Development
```bash
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend
cd frontend && npm start
```

### Testing
```bash
# Test backend API directly with curl
curl -X POST http://localhost:5000/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world","voice":"nova"}' \
  --output test.mp3
```

## Architecture

### Backend (`/backend/server.js`)
- **Framework**: Express.js
- **Key Dependencies**: `express`, `cors`, `dotenv`, `openai`
- **Architecture Pattern**: Single Express server with one main route
- **OpenAI Integration**: Uses `openai` package (v4.52.0+) for TTS API calls
- **API Response Format**:
  - Success: Binary MP3 audio buffer with appropriate headers
  - Error: JSON error object with descriptive messages
- **Error Handling Strategy**: Maps OpenAI API errors (401, 429, 500) to appropriate HTTP responses
- **Configuration**: Loads `OPENAI_API_KEY` and `PORT` from environment variables

### Frontend (`/frontend/src/App.js`)
- **Framework**: React 18 with functional components and hooks
- **Architecture Pattern**: Single monolithic component (App.js) managing all state
- **State Management**: `useState` for text, voice selection, loading state, error messages, and audio data
- **HTTP Client**: Axios with `responseType: 'blob'` for binary audio handling
- **API Communication**: Reads `REACT_APP_API_URL` from environment (defaults to `http://localhost:5000`)
- **Audio Handling**: Creates blob URLs for download functionality
- **UI State Flow**: null → loading → success/error, with download section appearing on success

### Data Flow
1. User enters text and selects voice in React frontend
2. Frontend validates input (non-empty, ≤4000 chars)
3. POST request to `/api/tts` with `{text, voice}` payload
4. Backend validates input and calls OpenAI TTS API with `tts-1-hd` model
5. Backend streams MP3 buffer to frontend
6. Frontend creates blob URL and enables download
7. User downloads MP3 file with timestamp-based filename

## Environment Configuration

### Backend `.env`
```
OPENAI_API_KEY=sk_...              # Required: OpenAI API key
PORT=5000                          # Optional: server port (defaults to 5000)
NODE_ENV=development               # Optional: development or production
```

### Frontend `.env`
```
REACT_APP_API_URL=http://localhost:5000    # Optional: backend URL (defaults to localhost:5000)
```

**Important**: Environment variables are loaded at build time for the frontend. Changes require rebuild.

## Key Files & Their Purposes

- `backend/server.js` - Express server with `/api/health` and `/api/tts` endpoints
- `frontend/src/App.js` - Single React component with all UI and logic
- `frontend/src/index.css` - All styling (no external component libraries)
- `README.md` - User-facing documentation with setup, usage, and troubleshooting
- `design.md` - UI/UX design specifications and mockups
- `scope.md` - Full project requirements and feature scope
- `mvp.md` - MVP definition and constraints
- `SETUP.md` - Detailed development setup instructions

## Development Notes

### No Build Process for Backend
The backend runs directly with `node server.js` - no transpilation needed. Requires Node 18+.

### Frontend Uses Create React App
Standard `react-scripts` build system. No custom webpack configuration.

### API Response Type Matters
Frontend uses `responseType: 'blob'` in axios to handle binary MP3 data. Standard JSON responses for errors.

### Minimal Dependencies
- **Backend**: 4 core dependencies (express, cors, dotenv, openai)
- **Frontend**: 4 core dependencies (react, react-dom, axios, react-scripts)
- No external component libraries used - everything is vanilla React and CSS

### Voice Configuration
The six voices are hard-coded in both backend (validation) and frontend (VOICES array). If adding/changing voices, update both locations.

### Error Message Handling
Frontend intelligently parses error responses:
- Checks for `err.response?.data.error` (API errors)
- Handles timeout with `ECONNABORTED` code
- Handles offline with `navigator.onLine` check
- Provides user-friendly fallback messages

## Common Patterns to Preserve

- **State reset on new request**: The `handleGenerateAudio` function clears previous errors/audio data before starting
- **Validation in frontend and backend**: Both layers validate text input independently
- **Binary audio streaming**: MP3 is streamed directly from OpenAI without local file storage
- **Timestamp-based filenames**: Downloads include date to avoid overwrites
- **Loading state UI feedback**: Buttons and inputs disable during requests with spinner animation

## Deployment Notes

- Backend deploys to Railway with start command: `cd backend && npm install && npm start`
- Frontend deploys to Railway or static host (Vercel/Netlify) with build: `cd frontend && npm install && npm run build`
- Frontend requires `REACT_APP_API_URL` environment variable to point to deployed backend
- No database, user accounts, or persistent storage - stateless API design
