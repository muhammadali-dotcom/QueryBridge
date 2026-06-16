/**
 * Standardized API response format
 */

const sendSuccess = (res, data, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data,
    error: null,
  });
};

const sendError = (res, error, statusCode = 400) => {
  res.status(statusCode).json({
    success: false,
    data: null,
    error: typeof error === 'string' ? error : error.message,
  });
};

const sendValidationError = (res, errors) => {
  res.status(422).json({
    success: false,
    data: null,
    error: 'Validation failed',
    details: errors,
  });
};

module.exports = {
  sendSuccess,
  sendError,
  sendValidationError,
};
