/**
 * Sends a standardised error envelope.
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 */
export const sendError = (res, statusCode, message) =>
  res.status(statusCode).json({ status: 'error', message });
