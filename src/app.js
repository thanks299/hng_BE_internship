import express from 'express';
import { cors } from './middleware/cors.js';
import { errorHandler } from './middleware/errorHandler.js';
import classifyRouter from './routes/classify.js';
import { sendError } from './utils/response.js';

const app = express();

// ── Global middleware ──────────────────────────────────────────────────────────
app.use(cors);
app.use(express.json()); // Add this to parse JSON bodies

// ── Debug logging middleware (remove in production) ───────────────────────────
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ── Root route for health check ───────────────────────────────────────────────
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Gender Classifier API is running',
    endpoints: {
      classify: '/api/classify?name={name}',
      health: '/health'
    }
  });
});

// ── Health check endpoint ─────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api', classifyRouter);

// ── 404 catch-all ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  console.log(`404 Not Found: ${req.method} ${req.url}`);
  sendError(res, 404, `Route ${req.method} ${req.path} not found.`);
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorHandler);

export default app;