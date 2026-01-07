# Text-to-Speech Generator - MVP Definition

## The Goal
User pastes text → clicks button → downloads beautiful AI audio in under 30 seconds. That's it.

## MVP Feature Set (Minimum Viable Magic)

### What's Included
- **Single text input field** - paste or type, no formatting needed
- **Voice selector** - 2-3 preset voices (alloy, nova, shimmer) users can pick from
- **One big button** - "Generate Audio"
- **Download link** - auto-downloads MP3 when ready
- **Loading state** - shows "Generating..." while processing
- **Error message** - basic "something went wrong" feedback
- **No authentication, no database, no complexity**

### What's Excluded (v2 features)
- Quality/speed selection
- Audio preview player
- Character count display
- Advanced voice descriptions
- Batch processing
- Audio file management/history
- Input validation beyond null checks
- Rate limiting
- Fancy UI polish

## Backend MVP (The Magic Engine)

### Single API Endpoint
```
POST /api/tts
Request: { text: string, voice: string }
Response: MP3 audio file (binary stream)
```

### Backend Responsibilities
1. Receive text + voice choice from frontend
2. Call OpenAI TTS API with minimal parameters
3. Stream MP3 response back to client
4. Catch and return basic errors

### Tech Stack
- **Node.js + Express** - minimal server, single route
- **OpenAI Node SDK** - handle TTS API calls
- **No database** - stateless, request-response only
- **Environment variable** - store OpenAI API key

### Error Handling (MVP Level)
- Empty text → 400 error
- Invalid voice → 400 error
- OpenAI API failure → 500 error with message
- All errors returned as simple JSON messages

## Frontend MVP (The User Experience)

### Layout
```
┌─────────────────────────────────┐
│   Text-to-Speech Generator      │
├─────────────────────────────────┤
│ [Textarea: paste or type here]  │
│                                 │
│ Voice:  [Dropdown ▼]            │
│                                 │
│     [Generate Audio Button]     │
│                                 │
│ [Download MP3] (appears when    │
│  audio is ready)                │
│                                 │
│ Status: "Ready" / "Generating"  │
│ Errors display here             │
└─────────────────────────────────┘
```

### User Flow (The Loop)
1. User enters text (any amount, we'll handle limits)
2. User selects voice from dropdown (default: "nova")
3. User clicks "Generate Audio"
4. Show loading spinner + disable button
5. Audio generates (most take 2-10 seconds)
6. Show download button with filename like: `tts-2025-01-06.mp3`
7. User clicks download, gets file
8. User can paste new text and start over

### Frontend Implementation
- React component with useState for text, voice, loading, error
- Axios call to backend `/api/tts`
- Binary response → blob → download trigger
- No fancy libraries, vanilla React

## MVP Success Criteria

- ✅ Backend: POST endpoint accepts text + voice, calls OpenAI, returns MP3
- ✅ Frontend: Text input + voice dropdown + generate button work
- ✅ Download: Browser downloads valid MP3 file
- ✅ Speed: Full cycle (paste text → download) takes < 30 seconds
- ✅ Error handling: Shows user-friendly messages when things fail
- ✅ Deployable: Works on Railway with just OpenAI API key in env vars

## Why This MVP Feels "Magical"

1. **Simplicity** - One button does one thing. No distraction.
2. **Instant gratification** - Seconds from text to audio, no sign-up or accounts
3. **Quality gap** - Professional AI audio from a simple workflow shocks users
4. **No friction** - No character counts, validation errors, or complex UI. Just works.
5. **Memorable** - "I typed text and got real audio" is a wow moment

## Phase 1 → Phase 2 Thinking (Not MVP)

Once MVP works, these are natural next steps:
- Add quality selection (standard vs HD)
- Add audio preview player
- Add speed control
- Add more voice options with descriptions
- Add character count warning
- Add input validation feedback
- Improve UI/styling

But MVP ships with none of that. Keep it lean, fast, and magical.
