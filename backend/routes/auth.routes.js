import { Router } from 'express';
import { signupController, loginController } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { asyncHandler } from '../middleware/async.middleware.js';
import { signupSchema, loginSchema } from '../validators/auth.schemas.js';

const router = Router();

router.post('/signup', validate(signupSchema), asyncHandler(signupController));
router.post('/login', validate(loginSchema), asyncHandler(loginController));

export default router;
