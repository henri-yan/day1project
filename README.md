# Text-to-Speech Generator

A full-stack web application that converts text into natural-sounding AI audio using OpenAI's Text-to-Speech API. Built with Node.js + Express (backend) and React (frontend).

## Features

✨ **Core Features:**
- Paste text and convert to natural AI audio in seconds
- Choose from 6 different AI voices (Nova, Alloy, Shimmer, Echo, Fiona, Onyx)
- Download high-quality MP3 files
- Real-time character count and validation
- Beautiful, responsive UI
- Smart error handling with user-friendly messages

⚡ **Performance:**
- Stream-based audio delivery (no server-side storage)
- Fast API integration with OpenAI TTS
- Average generation time: 5-10 seconds

## Tech Stack

**Backend:**
- Node.js + Express.js
- OpenAI TTS API integration
- CORS-enabled for frontend communication

**Frontend:**
- React 18
- Axios for API calls
- Clean, responsive CSS styling
- Zero external component libraries (vanilla React)

## Prerequisites

Before you start, ensure you have:
- **Node.js** v18 or higher ([download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **OpenAI API Key** ([get one here](https://platform.openai.com/account/api-keys))

## Installation & Setup

### 1. Clone or download the project

```bash
cd day1folder
```

### 2. Set up the Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file with your OpenAI API key
cp .env.example .env
```

Edit `backend/.env` and add your OpenAI API key:
```
OPENAI_API_KEY=sk_your_actual_key_here
PORT=5000
NODE_ENV=development
```

### 3. Set up the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (optional, defaults to localhost:5000)
cp .env.example .env
```

Edit `frontend/.env` if deploying to a different backend URL:
```
REACT_APP_API_URL=http://localhost:5000
```

## Running Locally

### Start the Backend (Terminal 1)

```bash
cd backend
npm start
```

You should see:
```
🎙️ TTS Backend running on http://localhost:5000
📍 API endpoint: POST http://localhost:5000/api/tts
```

### Start the Frontend (Terminal 2)

```bash
cd frontend
npm start
```

The app will open automatically at `http://localhost:3000`

## How to Use

1. **Paste Text** - Enter or paste any text (up to 4,000 characters)
2. **Select Voice** - Choose from 6 available AI voices
3. **Click Generate** - Watch the magic happen (5-10 seconds)
4. **Download MP3** - Get your audio file ready to use

## Project Structure

```
day1folder/
├── backend/
│   ├── server.js           # Express server with TTS endpoint
│   ├── package.json        # Backend dependencies
│   ├── .env.example        # Example environment variables
│   └── .env                # Your API keys (create this)
│
├── frontend/
│   ├── src/
│   │   ├── App.js          # Main React component
│   │   ├── index.js        # React entry point
│   │   ├── index.css       # All styling
│   │   └── ...
│   ├── public/
│   │   └── index.html      # HTML template
│   ├── package.json        # Frontend dependencies
│   ├── .env.example        # Example API URL config
│   └── .env                # Your API URL config
│
├── scope.md                # Full project scope
├── mvp.md                  # MVP definition
├── design.md               # UI/UX design specs
└── README.md               # This file
```

## API Endpoint

### POST `/api/tts`

**Request:**
```json
{
  "text": "Hello world",
  "voice": "nova"
}
```

**Voice Options:**
- `nova` (default) - warm, natural
- `alloy` - bright, clear
- `shimmer` - smooth, soft
- `echo` - deep, resonant
- `fiona` - professional
- `onyx` - rich, warm

**Response:**
- Success (200): MP3 audio file (binary)
- Error (400): `{ "error": "Error message" }`
- Error (500): `{ "error": "Server error message" }`

## Error Handling

The app handles these scenarios gracefully:

| Error | Cause | Solution |
|-------|-------|----------|
| "Please enter some text" | Empty text field | Type or paste text |
| "Text must be 4000 characters or less" | Text too long | Reduce text length |
| "Invalid voice" | Bad voice parameter | Select from dropdown |
| "Invalid API key" | Wrong OpenAI key | Check `.env` file |
| "Rate limited by OpenAI" | Too many requests | Wait a moment, try again |
| "Service unavailable" | OpenAI API down | Try again later |

## Deployment to Railway

### 1. Prepare for Deployment

**Backend (`backend/.env` for production):**
```
OPENAI_API_KEY=your_api_key
NODE_ENV=production
PORT=3000
```

**Frontend (`frontend/.env` for production):**
```
REACT_APP_API_URL=https://your-railway-backend-url
```

### 2. Deploy Backend First

1. Create a Railway project
2. Connect your GitHub repo (or upload directly)
3. Add environment variable: `OPENAI_API_KEY`
4. Set start command: `cd backend && npm install && npm start`
5. Deploy and note your backend URL (e.g., `https://tts-backend-xxx.railway.app`)

### 3. Deploy Frontend

1. Create another Railway project (or use a static host like Vercel/Netlify)
2. Set `REACT_APP_API_URL` to your backend URL
3. Set build command: `cd frontend && npm install && npm run build`
4. Set start command: `npm start` (or use `serve -s build`)

## Development Tips

### Testing the Backend Directly

```bash
curl -X POST http://localhost:5000/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world","voice":"nova"}' \
  --output test.mp3
```

### Testing with Different Voices

Try these voices to compare:
- `nova` - Great for narration and storytelling
- `alloy` - Professional, podcast-friendly
- `shimmer` - Smooth for audiobooks
- `echo` - Deep and resonant
- `fiona` - Corporate/professional
- `onyx` - Rich and warm

### Troubleshooting

**"Cannot find module 'openai'"**
```bash
cd backend && npm install
```

**"ECONNREFUSED" on frontend**
- Make sure backend is running on port 5000
- Check that `REACT_APP_API_URL` matches backend URL

**"Invalid API key"**
- Verify your OpenAI key is correct
- Make sure it's in `backend/.env`
- Keys starting with `sk-` are correct format

**No audio file downloads**
- Check browser console for errors (F12)
- Verify API endpoint is responding
- Try a shorter text sample first

## What's NOT Included (By Design)

- No database or user accounts
- No audio file history or caching
- No batch processing
- No advanced audio editing
- No authentication system

These are intentionally excluded for MVP simplicity. Perfect for learning backend API integration!

## Next Steps (v2.0)

Once MVP is working, consider adding:
- Audio preview player before download
- Quality/speed selection
- Batch text processing
- Audio history (with local storage)
- Rate limiting per user
- Advanced voice descriptions
- Custom playback speed

## License

Open source - feel free to modify and deploy!

## Support

Having issues? Check:
1. `.env` files have correct API key and URLs
2. Backend is running (`npm start` in `backend/`)
3. Frontend is running (`npm start` in `frontend/`)
4. OpenAI API key is valid
5. Network connection is working

For more help, check the error message in the app - it will guide you!

---

🎙️ **Happy voice generation!**
