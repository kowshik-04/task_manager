export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

export const notFoundHandler = (req, res) => {
  return res.status(404).json({
    success: false,
    data: {},
    message: `Route not found: ${req.originalUrl}`
  });
};

export const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  if (res.headersSent) {
    return next(err);
  }

  return res.status(statusCode).json({
    success: false,
    data: {},
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};
