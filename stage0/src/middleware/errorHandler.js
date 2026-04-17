import { sendError } from '../utils/response.js';

/**
 * Express 4-arg error handler — must keep all four parameters.
 * Catches anything passed to next(err).
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error('[Unhandled Error]', err);
  sendError(res, 500, 'An unexpected internal server error occurred.');
}
