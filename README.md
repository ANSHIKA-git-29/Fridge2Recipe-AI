HEAD
# Fridge2Recipe AI

An interactive React recipe assistant for a frontend internship assessment. Users enter available ingredients; a server-side Gemini request returns structured JSON, which is validated and rendered as a cookable recipe rather than raw chat text.

## Features

- Ingredient input with comma-separated entry, duplicate/max-item/non-food checks, voice input, keyboard shortcut, and surprise mode
- Server-only Gemini integration with timeout, abort propagation, rate limiting, structured JSON prompting, extraction, and normalization
- Interactive recipe view: scalable servings, persistent ingredient/step completion, timers, swaps, nutrition, speech playback, copy, share, print, save, favorites, and history
- Loading stages, empty/error states, dark mode, responsive layout, LocalStorage persistence, and accessible button/progress semantics

## Stack

React 19, Vite, Tailwind CSS, Framer Motion, React Hot Toast, Express, Gemini API, and LocalStorage.

## Architecture

```text
src/                 React UI, state, client validation, and LocalStorage
backend/services/    Gemini prompt and provider request
backend/routes/      Input validation, JSON extraction, and response normalization
backend/server.js    Express API, security headers, rate limiting, and production static hosting
```

The browser calls `POST /api/recipe` with an ingredient array. Gemini returns JSON text; the server extracts it, validates required fields, applies safe defaults, and returns `{ recipe }`. API keys never enter the browser bundle.

## Install and run

Requires Node.js 18+.

```bash
npm install
Copy-Item .env.example .env
# Add GEMINI_API_KEY to .env
npm run dev
```

Open `http://localhost:5173`. The Vite dev server proxies `/api` to Express on port 8787.

For a production-style local run:

```bash
npm start
```

Open `http://localhost:3000`.

## Environment variables

```env
GEMINI_API_KEY=your_key
GEMINI_MODEL=gemini-2.0-flash
BACKEND_PORT=8787
FRONTEND_ORIGIN=http://localhost:5173
```

Never use a `VITE_` prefix for `GEMINI_API_KEY`.

## Reliability and AI handling

- New generation requests cancel older requests, so stale responses cannot overwrite current UI.
- The server rejects empty/oversized ingredient lists and rate-limits generation requests.
- Gemini calls time out after 20 seconds and are aborted when the client disconnects.
- Model output is stripped of markdown/code fences, parsed, schema-checked, normalized, and safely rendered.
- A malformed AI response shows a retryable error state instead of crashing the application.
- Client-side fallback recipes are reserved for deliberately local/demo scenarios; provider and malformed-response errors remain visible for testing.

## Known limitations

- Rate limiting is in-memory and should be replaced with a shared store for multi-instance deployment.
- Nutrition values are model estimates, not medical or dietary advice.
- Saved data and progress are device-local; there is no account or sync layer.
- Browser speech and voice features depend on browser support.

## Future improvements

- Add backend tests for schema normalization and malformed model responses.
- Add a persistent rate limiter and request observability.
- Add locally hosted recipe photography to remove the external image dependency.
- Add end-to-end tests for cancellation, persistence, and mobile interactions.

## AI assistance disclosure

AI tools were used for scaffolding, UI copy, component implementation, review, and debugging. The structured-data boundary, failure-handling design, and implementation decisions should be understood before submission.

## Time spent

Approximately eight hours across UI construction, interactive state, AI/API resilience, debugging, verification, and documentation.
=======
# 🍳 Fridge2Recipe AI

An AI-powered Fridge-to-Recipe web application that transforms a list of ingredients into an interactive cooking experience.

Instead of displaying raw AI text, the application requests structured JSON from a Large Language Model and renders it into interactive UI components including ingredient checklists, cooking steps, serving controls, nutrition information, and ingredient swaps.

---

## ✨ Features

- Free-form ingredient input
- AI-powered recipe generation using Gemini
- Interactive cooking checklist
- Ingredient checklist
- Scalable servings
- Ingredient swap suggestions
- Nutrition information
- Save favorite recipes
- Recipe history
- Copy, Share and Print recipe
- Dark Mode
- Fully responsive design
- Robust AI error handling
- Retry failed requests
- Prevent stale AI responses
- LocalStorage persistence

---

## 🛠 Tech Stack

### Frontend
- React 19
- Vite
- JavaScript (ES6+)
- Tailwind CSS
- Framer Motion
- React Icons
- React Hot Toast

### Backend
- Node.js
- Express.js

### AI
- Google Gemini API

---

## 📂 Project Structure

```
fridge2recipe-ai/

├── src/
│   ├── components/
│   ├── services/
│   └── App.jsx
│
├── backend/
│   ├── routes/
│   ├── services/
│   ├── server.js
│   └── package.json
│
├── tests/
├── .env.example
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

---

## 🚀 Installation

### 1. Clone Repository

```bash
git clone https://github.com/ANSHIKA-git-29/Fridge2Recipe-AI.git
```

```bash
cd fridge2recipe-ai
```

---

### 2. Install Frontend Dependencies

Run from the project root:

```bash
npm install
```

---

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

---

### 4. Configure Environment Variables

Create a `.env` file inside the `backend` folder (see `.env.example` for the expected keys).

```
GEMINI_API_KEY=YOUR_API_KEY
PORT=5000
```

---

### 5. Start Backend

```bash
cd backend
npm start
```

---

### 6. Start Frontend

In a separate terminal, from the project root:

```bash
npm run dev
```

Open:

```
http://localhost:5173
```

---

## ▶️ Usage

1. Enter ingredients using the input field.
2. Click **Generate Recipe**.
3. The backend sends the ingredients to Gemini.
4. Gemini returns structured JSON.
5. The frontend validates and parses the response.
6. The recipe is displayed as interactive UI.
7. Users can:
   - Check ingredients
   - Complete cooking steps
   - Scale servings
   - Save recipes
   - Print
   - Share

---

## 🤖 AI Usage Note

AI tools were used during development to:

- Brainstorm project architecture
- Improve React component structure
- Generate and refine UI ideas
- Review code quality
- Suggest error-handling improvements
- Assist with debugging
- Improve README documentation

All generated code was reviewed, modified, tested, and integrated manually. I understand the implementation and can explain all architectural and coding decisions during the interview.

---

## 🧠 AI Integration

The application uses the Google Gemini API.

Workflow:

```
React Frontend
        │
        ▼
Express Backend
        │
        ▼
Google Gemini API
        │
        ▼
Structured JSON
        │
        ▼
Interactive React Components
```

The API key is stored securely on the backend and is never exposed to the browser.

---

## 🛡 Handling Bad AI Output

The application is designed to safely handle unreliable AI responses.

Implemented protections include:

- Invalid JSON detection
- JSON extraction from mixed text
- Schema validation
- Missing field handling
- Retry mechanism
- Friendly error messages
- Loading state
- Empty state
- Network failure handling
- Request cancellation using AbortController
- Prevention of stale responses overwriting newer ones

---

## 📱 Responsive Design

The application is optimized for:

- Desktop
- Laptop
- Tablet
- Mobile (320px and above)

---

## ⚠️ Known Limitations

- Recipe quality depends on the AI model.
- Nutrition values are AI-generated estimates.
- Ingredient swaps may not always be available.
- Internet connection is required for AI generation.
- AI responses may vary between requests.

---

## 🔮 Future Improvements

- Recipe image generation
- Voice input
- Speech synthesis
- Streaming AI responses
- Multi-language support
- User authentication
- Cloud recipe synchronization

---

## ⏱ Time Spent

Approximately **8 hours**

Breakdown:

- UI Design – 2 hours
- React Components – 2.5 hours
- AI Integration – 1.5 hours
- Backend – 1 hour
- Testing & Debugging – 1 hour

---

## 🎥 Demo

A screen recording demonstrating:

- Ingredient input
- AI recipe generation
- Loading state
- Error handling
- Interactive checklist
- Serving scaler
- Save/Print/Share
- Responsive layout

---

## 📄 License

Created as part of a Frontend Internship assignment.
>>>>>>> 39fa1ef8ca2c94be8300fc82f53aaf8228323f08
