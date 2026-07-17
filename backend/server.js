import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import recipeRouter from './routes/recipe.js';

const app = express();
const isProduction = process.argv.includes('--production');
const port = Number(process.env.PORT || process.env.BACKEND_PORT || 8787);
const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const buildDirectory = join(projectRoot, 'dist');
const requests = new Map();

app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  next();
});
app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: '32kb' }));
app.use('/api/recipe', (req, res, next) => {
  const key = req.ip || 'unknown';
  const now = Date.now();
  const history = (requests.get(key) || []).filter((time) => now - time < 60_000);
  if (history.length >= 12) return res.status(429).json({ error: 'Too many recipe requests. Please wait a minute.' });
  history.push(now);
  requests.set(key, history);
  return next();
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, providerConfigured: Boolean(process.env.GEMINI_API_KEY) });
});

app.use('/api/recipe', recipeRouter);

if (isProduction) {
  app.use(express.static(buildDirectory, { index: false, maxAge: '1h' }));
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api/')) return next();
    return res.sendFile(join(buildDirectory, 'index.html'));
  });
}

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'Unexpected server error.' });
});

app.listen(port, () => {
  console.log(`Fridge2Recipe ${isProduction ? 'app' : 'API'} listening on http://localhost:${port}`);
});
