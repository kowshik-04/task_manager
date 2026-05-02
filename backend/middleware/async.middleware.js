/**
 * Async error handler middleware.
 * Catches rejected promises from async route handlers and passes to error handler.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    console.error(`Async handler error on ${req.method} ${req.path}:`, error);
    next(error);
  });
};
