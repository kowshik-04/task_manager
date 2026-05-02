import { AppError } from './error.middleware.js';

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query
  });

  if (!result.success) {
    // Extract the first validation error for a cleaner message
    const firstError = result.error.issues[0];
    const fieldPath = firstError.path.filter((p) => p !== 'body').join('.');
    const errorMessage = firstError.message || 'Invalid input';
    
    throw new AppError(errorMessage, 400);
  }

  req.validated = result.data;
  next();
};
