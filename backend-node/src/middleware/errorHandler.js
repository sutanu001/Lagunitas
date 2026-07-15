/**
 * Centralised error handler — must be registered AFTER all routes.
 * Express identifies it by its 4-argument signature (err, req, res, next).
 */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  const status  = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[ERROR] ${req.method} ${req.url} → ${status}: ${message}`);
  if (status >= 500) console.error(err.stack);

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
