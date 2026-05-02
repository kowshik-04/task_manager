import { Router } from 'express';
import {
  createTaskController,
  updateTaskStatusController,
  getDashboardStatsController
} from '../controllers/task.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { asyncHandler } from '../middleware/async.middleware.js';
import { createTaskSchema, updateTaskStatusSchema } from '../validators/task.schemas.js';
import { emptyRequestSchema } from '../validators/common.schemas.js';

const router = Router();

router.use(authenticate);

router.get('/dashboard/stats', validate(emptyRequestSchema), asyncHandler(getDashboardStatsController));
router.post('/', authorizeRoles('ADMIN'), validate(createTaskSchema), asyncHandler(createTaskController));
router.patch('/:taskId/status', validate(updateTaskStatusSchema), asyncHandler(updateTaskStatusController));

export default router;
