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
