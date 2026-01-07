require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Text-to-Speech endpoint
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voice } = req.body;

    // Validation
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required and must be a string' });
    }

    if (text.trim().length === 0) {
      return res.status(400).json({ error: 'Please enter some text before generating audio' });
    }

    if (text.length > 4000) {
      return res.status(400).json({ error: 'Text must be 4000 characters or less' });
    }

    // Validate voice
    const validVoices = ['alloy', 'echo', 'fiona', 'onyx', 'nova', 'shimmer'];
    const selectedVoice = voice || 'nova';

    if (!validVoices.includes(selectedVoice)) {
      return res.status(400).json({ error: `Invalid voice. Must be one of: ${validVoices.join(', ')}` });
    }

    // Call OpenAI TTS API
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1-hd', // High-definition model for better quality
      voice: selectedVoice,
      input: text.trim(),
    });

    // Get the audio buffer
    const buffer = await mp3.arrayBuffer();

    // Set response headers for audio file
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'attachment; filename="tts-audio.mp3"');
    res.setHeader('Content-Length', buffer.byteLength);

    // Send the audio buffer
    res.send(Buffer.from(buffer));

  } catch (error) {
    console.error('TTS Error:', error.message);

    // Handle OpenAI API errors
    if (error.status === 401) {
      return res.status(401).json({ error: 'Invalid API key. Check your OpenAI configuration.' });
    }

    if (error.status === 429) {
      return res.status(429).json({ error: 'Rate limited by OpenAI. Please try again in a moment.' });
    }

    if (error.status === 500) {
      return res.status(503).json({ error: 'OpenAI service is currently unavailable. Please try again.' });
    }

    // Generic error
    res.status(500).json({
      error: 'Failed to generate audio. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎙️ TTS Backend running on http://localhost:${PORT}`);
  console.log(`📍 API endpoint: POST http://localhost:${PORT}/api/tts`);
});
