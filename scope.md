# Text-to-Speech Generator - Project Scope

## Overview
A web application that converts user-provided text into natural-sounding audio files using OpenAI's Text-to-Speech API. Users can select different AI voices, adjust speech quality, and download the resulting audio as MP3 files.

## Core Features

### Text Input & Processing
- Users paste or type text into a textarea
- Input validation (minimum/maximum character limits)
- Real-time character count display
- Support for plain text input (no rich text formatting)

### Voice Selection
- Dropdown menu to choose from OpenAI's available TTS voices (alloy, echo, fiona, onyx, nova, shimmer)
- Preview/description of each voice option
- Default voice selection

### Audio Quality Options
- Quality selector: Standard (lower latency) or HD (higher quality)
- Speed control option (if supported by API)
- Real-time feedback on expected file size/processing time

### Audio Generation & Download
- "Generate Audio" button that calls the backend
- Loading/progress indicator during processing
- Download generated MP3 file with descriptive filename
- Display duration of generated audio

### User Experience
- Clean, simple interface focused on core functionality
- Error handling with user-friendly messages
- Success feedback when audio is generated
- Responsive design for desktop/tablet use

## Technical Architecture

### Frontend (React)
- Single-page application with form for text input
- Voice selection and quality settings component
- Audio player preview (optional: play before download)
- Download button functionality
- Loading states and error messages

### Backend (Node.js + Express)
- REST API endpoint for text-to-speech generation
- Request validation and error handling
- OpenAI TTS API integration
- Stream audio response or temporary storage and serve
- CORS configuration for frontend communication

### API Endpoints
- `POST /api/generate-audio` - Main endpoint that accepts text, voice, quality parameters and returns MP3 audio file

### External Dependencies
- OpenAI API (TTS service)
- React (frontend framework)
- Express (backend framework)
- Axios or similar for frontend API calls
- OpenAI Node.js SDK for backend

## Constraints & Limitations

### Data
- No database required
- No user authentication/accounts
- No audio file storage on server (stream directly to client)
- No chat history or previous generations

### Usage
- Rate limited by OpenAI API quotas/costs
- Single concurrent generation (no queue system)
- Maximum text length per request (likely OpenAI's limit: 4096 characters)
- Generated audio files served immediately, not cached

### Deployment
- Stateless application (suitable for Railway)
- Environment variables for OpenAI API key
- No persistent storage needed

## User Flow

1. User visits the application
2. User enters text in the textarea
3. User selects preferred voice from dropdown
4. User optionally adjusts quality/speed settings
5. User clicks "Generate Audio"
6. Backend calls OpenAI TTS API with provided parameters
7. Audio is generated and streamed back to frontend
8. User sees player preview (optional) and download button
9. User downloads MP3 file
10. User can generate another audio or modify text and regenerate

## Success Criteria

- ✅ Text input accepts and validates user text
- ✅ Voice selection works with all available OpenAI voices
- ✅ Audio generation succeeds via OpenAI API
- ✅ Downloaded files are valid MP3s
- ✅ Error messages display clearly when things fail
- ✅ Application responds within reasonable time (OpenAI API latency)
- ✅ Deployable to Railway without modification

## Out of Scope

- User accounts or authentication
- Audio file history or database
- Advanced audio editing or post-processing
- Multiple language support
- Speech-to-text (reverse functionality)
- Batch text processing
- Audio caching/CDN delivery
- Rate limiting per user
- Audio streaming vs download only (MVP: download focus)
