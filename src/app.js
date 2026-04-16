import express from 'express';
import { cors } from './middleware/cors.js';
import { errorHandler } from './middleware/errorHandler.js';
import classifyRouter from './routes/classify.js';
import { sendError } from './utils/response.js';

const app = express();

// ── Global middleware ──────────────────────────────────────────────────────────
app.use(cors);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api', classifyRouter);

// ── 404 catch-all ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  sendError(res, 404, `Route ${req.method} ${req.path} not found.`);
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorHandler);

export default app;
