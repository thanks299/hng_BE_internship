import { Router } from 'express';
import { fetchGender } from '../services/genderize.js';
import { sendError } from '../utils/response.js';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.VERCEL_ENV || 'development'
  });
});

router.get('/classify', async (req, res) => {
  const { name } = req.query;

  // 400 – missing or empty
  if (name === undefined || name === '') {
    return sendError(res, 400, 'Query parameter "name" is required and cannot be empty.');
  }

  // 422 – must be a single string (duplicate keys arrive as an array in Express)
  if (Array.isArray(name)) {
    return sendError(res, 422, 'Query parameter "name" must be a single string value.');
  }

  // Fetch from upstream
  let result;
  try {
    result = await fetchGender(name.trim());
  } catch (err) {
    if (err.kind === 'timeout') return sendError(res, 504, err.message);
    if (err.kind === 'upstream') return sendError(res, 502, err.message);
    return sendError(res, 500, err.message);
  }

  const { gender, probability, count } = result;

  // 404 – no prediction available
  if (!gender || count === 0) {
    return sendError(res, 404, 'No prediction available for the given name.');
  }

  const sample_size = count;
  const is_confident = probability >= 0.7 && sample_size >= 100;
  const processed_at = new Date().toISOString();

  return res.status(200).json({
    status: 'success',
    data: {
      name: result.name,
      gender,
      probability,
      sample_size,
      is_confident,
      processed_at,
    },
  });
});

export default router;
