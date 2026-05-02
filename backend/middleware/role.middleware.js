import { AppError } from './error.middleware.js';

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new AppError('Forbidden: insufficient permissions', 403);
    }

    next();
  };
};
