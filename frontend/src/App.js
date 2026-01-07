import React, { useState } from 'react';
import axios from 'axios';
import './index.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const VOICES = [
  { value: 'nova', label: 'Nova', description: 'warm, natural' },
  { value: 'alloy', label: 'Alloy', description: 'bright, clear' },
  { value: 'shimmer', label: 'Shimmer', description: 'smooth, soft' },
  { value: 'echo', label: 'Echo', description: 'deep, resonant' },
  { value: 'fiona', label: 'Fiona', description: 'professional' },
  { value: 'onyx', label: 'Onyx', description: 'rich, warm' },
];

function App() {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('nova');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // null, 'loading', 'success', 'error'
  const [error, setError] = useState('');
  const [audioData, setAudioData] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleGenerateAudio = async () => {
    // Reset previous states
    setError('');
    setAudioData(null);
    setStatus('loading');
    setLoading(true);

    try {
      // Validate input
      if (!text.trim()) {
        setStatus('error');
        setError('Please enter some text before generating audio');
        setLoading(false);
        return;
      }

      if (text.length > 4000) {
        setStatus('error');
        setError('Text must be 4000 characters or less');
        setLoading(false);
        return;
      }

      // Make API request
      const response = await axios.post(
        `${API_URL}/api/tts`,
        { text: text.trim(), voice },
        { responseType: 'blob', timeout: 30000 }
      );

      // Create blob and download link
      const blob = new Blob([response.data], { type: 'audio/mpeg' });
      const url = window.URL.createObjectURL(blob);

      // Generate filename with timestamp
      const date = new Date().toISOString().split('T')[0];
      const filename = `tts-audio-${date}.mp3`;

      setAudioData(url);
      setFileName(filename);
      setStatus('success');

    } catch (err) {
      setStatus('error');

      if (err.response?.data) {
        // Parse error response
        const errorData = err.response.data;
        if (typeof errorData === 'string') {
          setError(errorData);
        } else {
          setError(errorData.error || 'Failed to generate audio');
        }
      } else if (err.code === 'ECONNABORTED') {
        setError('Request timeout. The server took too long to respond. Please try again.');
      } else if (!navigator.onLine) {
        setError('No internet connection. Please check your network.');
      } else {
        setError(err.message || 'Failed to generate audio. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (audioData) {
      const a = document.createElement('a');
      a.href = audioData;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleReset = () => {
    setText('');
    setVoice('nova');
    setStatus(null);
    setError('');
    setAudioData(null);
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1>🎙️ Text-to-Speech Generator</h1>
        <p>Convert text to natural-sounding audio</p>
      </div>

      {/* Text Input Section */}
      <div className="section">
        <label className="section-label">Paste your text below:</label>
        <div className="textarea-wrapper">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="The quick brown fox jumps over the lazy dog. Paste any text here and convert it to audio instantly!"
            disabled={loading}
          />
        </div>
        <div style={{ fontSize: '12px', color: '#999999', marginTop: '4px' }}>
          {text.length} / 4000 characters
        </div>
      </div>

      {/* Voice Selection */}
      <div className="section">
        <label className="section-label" htmlFor="voice-select">
          Select voice:
        </label>
        <select
          id="voice-select"
          value={voice}
          onChange={(e) => setVoice(e.target.value)}
          disabled={loading}
        >
          {VOICES.map((v) => (
            <option key={v.value} value={v.value}>
              {v.label} • {v.description}
            </option>
          ))}
        </select>
      </div>

      {/* Status Message */}
      {status && (
        <div className={`status ${status}`}>
          {status === 'loading' && (
            <>
              <div className="spinner"></div>
              <span>Generating audio... this usually takes 5-10 seconds</span>
            </>
          )}
          {status === 'success' && (
            <>
              <span>✅</span>
              <span>Audio ready! Download your file below.</span>
            </>
          )}
          {status === 'error' && (
            <>
              <span>❌</span>
              <div>
                <div>{error}</div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Download Section */}
      {audioData && status === 'success' && (
        <div className="download-section">
          <div className="audio-info">
            <span>📥</span>
            <span>MP3 file ready: {fileName}</span>
          </div>
          <button className="download-button" onClick={handleDownload}>
            📥 Download MP3
          </button>
        </div>
      )}

      {/* Generate Audio Button */}
      <div className="section">
        <button
          className="generate-button"
          onClick={handleGenerateAudio}
          disabled={loading || !text.trim()}
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              Generating...
            </>
          ) : (
            <>
              🎵 Generate Audio
            </>
          )}
        </button>
      </div>

      {/* Tips */}
      {!audioData && !loading && (
        <div className="tip">
          💡 Tip: Paste any text - blog posts, poetry, scripts, or articles. The AI will read it naturally with your chosen voice.
        </div>
      )}

      {/* Reset Button (appears after successful generation) */}
      {audioData && (
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button
            className="generate-button"
            onClick={handleReset}
            style={{ backgroundColor: '#666666' }}
          >
            ↻ Generate Another Audio
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
