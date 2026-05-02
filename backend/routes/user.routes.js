import { Router } from 'express';
import { listUsersController, meController, createUserController } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { asyncHandler } from '../middleware/async.middleware.js';
import { emptyRequestSchema } from '../validators/common.schemas.js';
import { createUserSchema } from '../validators/user.schemas.js';

const router = Router();

router.use(authenticate);

router.get('/me', validate(emptyRequestSchema), asyncHandler(meController));
router.get('/', authorizeRoles('ADMIN'), validate(emptyRequestSchema), asyncHandler(listUsersController));
router.post('/', authorizeRoles('ADMIN'), validate(createUserSchema), asyncHandler(createUserController));

export default router;
