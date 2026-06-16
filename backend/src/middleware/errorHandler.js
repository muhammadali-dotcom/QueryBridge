const { sendError } = require('../utils/response');

/**
 * Error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Groq API errors
  if (err.message && err.message.includes('Groq')) {
    return sendError(res, err.message, 503);
  }

  // Database errors
  if (err.message && err.message.includes('Database')) {
    return sendError(res, err.message, 500);
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return sendError(res, err.message, 422);
  }

  // Default error
  sendError(res, err.message || 'Internal server error', 500);
};

module.exports = errorHandler;
