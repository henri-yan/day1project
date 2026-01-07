# Languages and Internationalization (i18n) Planning

## Overview
This document outlines the strategy for adding multi-language support to the Text-to-Speech Generator, including UI translations and multilingual TTS capabilities.

## Key Findings from OpenAI TTS Documentation

### Language Support
- **99+ supported languages** for TTS generation
- TTS model follows Whisper model language support (originally trained on 98 languages)
- All languages work with existing voice options (nova, alloy, shimmer, echo, fiona, onyx)
- Voices are optimized for English but perform well across all supported languages

### Supported Languages
Complete list includes:
Afrikaans, Arabic, Armenian, Azerbaijani, Belarusian, Bosnian, Bulgarian, Catalan, Chinese, Croatian, Czech, Danish, Dutch, English, Estonian, Finnish, French, Galician, German, Greek, Hebrew, Hindi, Hungarian, Icelandic, Indonesian, Italian, Japanese, Kannada, Kazakh, Korean, Latvian, Lithuanian, Macedonian, Malay, Marathi, Maori, Nepali, Norwegian, Persian, Polish, Portuguese, Romanian, Russian, Serbian, Slovak, Slovenian, Spanish, Swahili, Swedish, Tagalog, Tamil, Thai, Turkish, Ukrainian, Urdu, Vietnamese, Welsh

### How TTS Handles Languages
- Simply pass text in the desired language to OpenAI TTS API
- No language parameter required - OpenAI detects language from text
- No model changes needed - current `tts-1-hd` model handles all languages

## Implementation Strategy

### Phase 1: Backend API Enhancement

#### 1.1 Add Language Metadata
**File**: `backend/server.js`
- Add endpoint `/api/languages` to return list of supported languages
- Format: Array of language objects with `code`, `name`, `nativeName`

Example response:
```json
{
  "languages": [
    { "code": "en", "name": "English", "nativeName": "English" },
    { "code": "es", "name": "Spanish", "nativeName": "Español" },
    { "code": "fr", "name": "French", "nativeName": "Français" },
    // ... more languages
  ]
}
```

#### 1.2 API Validation Enhancement
- Optionally add `language` parameter to `/api/tts` POST request
- Store language metadata in response headers (optional)
- Current approach (no language param) is sufficient - OpenAI auto-detects

### Phase 2: Frontend UI Translations

#### 2.1 Set Up i18n Framework
Options:
- **i18next** (recommended) - mature, widely used, good React integration
- **intl-messageformat** - lighter weight, uses CLDR data
- **custom solution** - JSON-based translation system (simplest for MVP)

#### 2.2 Translation Files Structure
```
frontend/
├── public/
│   └── locales/
│       ├── en/
│       │   └── translation.json
│       ├── es/
│       │   └── translation.json
│       ├── fr/
│       │   └── translation.json
│       └── ... (other languages)
```

#### 2.3 UI Elements to Translate
- Title and header
- Text input label
- Voice selection label
- Language selection dropdown
- Button labels (Generate, Download, Clear)
- Error messages
- Loading messages
- Help text and placeholders

#### 2.4 Maintain Multiple Language Versions
- English (default)
- Spanish
- French
- German
- Portuguese
- Chinese (Simplified)
- Japanese
- Korean

### Phase 3: User Language Preference

#### 3.1 Language Selection UI
- Dropdown in the app header/navigation
- Show both English and native language names
- Icon support (optional - flag emojis or SVG icons)

#### 3.2 Persistence
- Store language preference in `localStorage`
- Load on app startup
- Apply across sessions

#### 3.3 Browser Detection (Optional)
- Detect browser language via `navigator.language`
- Use as fallback if no stored preference
- Allow user override

### Phase 4: Error Message Localization

#### 4.1 Error Messages to Translate
- "Text is required"
- "Text must be 4000 characters or less"
- "Invalid voice selected"
- "Failed to generate audio"
- Network/timeout messages
- API-specific errors (rate limit, invalid API key)

#### 4.2 Dynamic Error Translation
- Pass error code or key to frontend
- Look up localized message in translation files
- Maintain consistency between backend and frontend

## Implementation Approach

### Option A: Minimal (MVP)
**Timeline**: 1-2 days
- Add language dropdown to select UI language only
- Use i18next for simple JSON-based translations
- Translations for top 5 languages (EN, ES, FR, DE, PT)
- No backend changes required

**Pros**:
- Minimal complexity
- Focus on UI experience
- Fast implementation

**Cons**:
- Limited language coverage
- Text-to-speech still in user's input language (no translation of content)

### Option B: Full Multilingual TTS (Recommended)
**Timeline**: 3-4 days
- Backend: Add `/api/languages` endpoint
- Frontend: Add language selector
- Support all 50+ languages for both UI and TTS
- Add language detection (browser preference)
- Persist user preference

**Pros**:
- Complete solution
- Users can read UI in native language AND generate TTS in any language
- Professional feature set

**Cons**:
- More implementation work
- Need comprehensive translation files
- Requires testing across languages

### Option C: Content Translation + TTS
**Timeline**: 5+ days (requires external API)
- Combine i18next with translation API (Google Translate, DeepL)
- Allow users to type in one language, translate, then generate TTS
- Requires additional API key and costs

**Pros**:
- Maximum flexibility
- Support any language even if not in UI
- Automatic translation

**Cons**:
- Added API costs
- Latency (two API calls)
- Dependency on third-party translation service

## Recommended Path: Option B (Full Multilingual TTS)

### Step 1: Create Language Configuration
```javascript
// backend/languages.js or constants
const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  // ... full list
];
```

### Step 2: Update Backend
- Add `/api/languages` endpoint
- Export language constants for validation
- No changes to `/api/tts` endpoint needed (OpenAI auto-detects language)

### Step 3: Update Frontend
- Install i18next: `npm install i18next react-i18next i18next-browser-languagedetector`
- Create translation JSON files in `public/locales/[lang]/translation.json`
- Wrap App with i18n provider
- Add language selector dropdown
- Update all text to use `useTranslation()` hook

### Step 4: Update App State
- Add `selectedLanguage` to React state
- Persist to localStorage
- Fetch supported languages from `/api/languages` on mount
- Populate language dropdown

### Step 5: Testing
- Test UI in each supported language
- Test TTS generation with text in different languages
- Test language persistence
- Test browser language detection

## Technical Considerations

### No Language Parameter Required for TTS
- OpenAI TTS auto-detects language from text content
- No need to send language code to `/api/tts` endpoint
- This simplifies backend implementation

### Character Set Support
- All modern browsers handle Unicode properly
- Ensure proper UTF-8 encoding in translation files
- Test with right-to-left languages (Arabic, Hebrew)

### Font Support
- Consider web fonts for language-specific characters if needed
- System fonts usually sufficient for most languages
- Test carefully with CJK languages (Chinese, Japanese, Korean)

### Performance
- i18next loads translations asynchronously
- Consider preloading primary languages
- JSON translation files are lightweight
- No performance impact on TTS generation

## Dependencies to Add

### Frontend
```json
{
  "i18next": "^23.0.0",
  "react-i18next": "^14.0.0",
  "i18next-browser-languagedetector": "^8.0.0",
  "i18next-http-backend": "^4.0.0"
}
```

### Backend
No new dependencies required for basic multilingual TTS support.

## Files to Create/Modify

### Backend
- `backend/server.js` - Add `/api/languages` endpoint (optional, for UI)
- `backend/languages.js` - Language configuration constants (new)

### Frontend
- `frontend/src/App.js` - Add language selector, update text with translations
- `frontend/src/i18n.js` - i18n configuration (new)
- `frontend/public/locales/[lang]/translation.json` - Translation files (new, multiple)
- `frontend/.env` - Optional: default language setting

## Next Steps

1. **Decide on implementation approach** (A, B, or C)
2. **Create backend language constants**
3. **Set up i18next in frontend**
4. **Write translation files** for core languages
5. **Add language selector UI**
6. **Test across languages**
7. **Add documentation** for how to add new languages

## Future Enhancements

- RTL language support (Arabic, Hebrew, Persian, Urdu)
- Voice selection by language (suggest appropriate voices)
- Auto-translation of text between languages
- Language statistics/analytics
- Community translation contributions
- Accessibility improvements for non-English languages
