# Quick Setup Guide

Get the Text-to-Speech Generator running in 5 minutes.

## Prerequisites

✓ Node.js v18+ ([download](https://nodejs.org/))
✓ OpenAI API Key ([get here](https://platform.openai.com/account/api-keys))

## Quick Start

### Step 1: Set up Backend (Terminal 1)

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Edit `backend/.env`:**
```
OPENAI_API_KEY=sk_paste_your_key_here
PORT=5000
NODE_ENV=development
```

**Start backend:**
```bash
npm start
```

✅ You should see: `🎙️ TTS Backend running on http://localhost:5000`

---

### Step 2: Set up Frontend (Terminal 2)

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (optional)
cp .env.example .env
```

**Start frontend:**
```bash
npm start
```

✅ Browser opens to `http://localhost:3000` automatically

---

## Test It Works

1. Open http://localhost:3000
2. Paste this text: **"The quick brown fox jumps over the lazy dog"**
3. Select voice: **Nova** (default)
4. Click **Generate Audio**
5. Wait 5-10 seconds
6. Click **Download MP3**

Done! 🎉

---

## Troubleshooting

### "Cannot find module 'openai'" or dependencies missing
```bash
# In the folder with the error (backend or frontend):
npm install
```

### "ECONNREFUSED" in frontend
- Make sure backend is running (`npm start` in `backend/` folder)
- Verify port 5000 is available

### "Invalid API key" error
- Check your OpenAI key in `backend/.env`
- Make sure it starts with `sk-`
- Try generating a new key at https://platform.openai.com/account/api-keys

### No sound in generated file
- Try a different voice
- Make sure your OpenAI API has TTS access (free tier usually has it)
- Check your OpenAI account has usage credits

### Timeout errors
- OpenAI TTS is usually fast (2-10 seconds)
- If it's taking longer, your API key might be rate limited
- Try again in a few seconds

---

## What Happens Next

**Full Documentation:** See `README.md`
- Architecture overview
- API endpoint details
- Deployment to Railway
- Project structure

**Design Reference:** See `design.md`
- UI/UX specifications
- Component layout
- Color scheme

**Project Scope:** See `scope.md`
- Full feature list
- Constraints and limitations
- Success criteria

---

## Common First Tests

### Test 1: Short Text
```
"Hello world"
```
**Expected:** ✅ Audio generated quickly (2-3 seconds)

### Test 2: Longer Text
```
"The quick brown fox jumps over the lazy dog. This is a longer sentence to test how the API handles more text. It should still generate an audio file perfectly fine."
```
**Expected:** ✅ Audio generated (5-8 seconds)

### Test 3: Different Voice
```
"Testing the echo voice"
```
Select **Echo** voice
**Expected:** ✅ Audio sounds deeper/different

### Test 4: Very Long Text (3500+ chars)
**Expected:** ✅ Should work (limit is 4000 chars)

---

## File Structure Created

```
day1folder/
├── backend/
│   ├── server.js           ← Express server + OpenAI integration
│   ├── package.json        ← Backend dependencies
│   └── .env                ← Your API key (create from .env.example)
│
├── frontend/
│   ├── src/
│   │   ├── App.js          ← Main React component
│   │   ├── index.js        ← React entry point
│   │   └── index.css       ← All styling
│   ├── public/
│   │   └── index.html      ← HTML template
│   └── package.json        ← Frontend dependencies
│
├── README.md               ← Full documentation
├── SETUP.md                ← This file
├── design.md               ← UI/UX specs
├── scope.md                ← Project requirements
└── mvp.md                  ← MVP definition
```

---

## Next Steps After Setup

✅ **MVP Working:** Text → Audio → Download in <30 seconds

🚀 **Ready to Deploy?** See "Deployment" section in `README.md`

🎨 **Want to Customize?** See `design.md` for UI specifications

📚 **Want to Learn More?** See `scope.md` for full feature roadmap

---

**Questions?** Check the error message in the app - it's designed to guide you! 🎙️
