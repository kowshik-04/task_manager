import { Router } from 'express';
import {
  createProjectController,
  deleteProjectController,
  addMemberController,
  removeMemberController,
  listProjectsController,
  getProjectController,
  listProjectTasksController
} from '../controllers/project.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { asyncHandler } from '../middleware/async.middleware.js';
import {
  createProjectSchema,
  projectIdParamSchema,
  addMemberSchema,
  removeMemberSchema
} from '../validators/project.schemas.js';
import { projectTaskListSchema } from '../validators/task.schemas.js';
import { emptyRequestSchema } from '../validators/common.schemas.js';

const router = Router();

router.use(authenticate);

router.get('/', validate(emptyRequestSchema), asyncHandler(listProjectsController));
router.post('/', authorizeRoles('ADMIN'), validate(createProjectSchema), asyncHandler(createProjectController));
router.get('/:projectId', validate(projectIdParamSchema), asyncHandler(getProjectController));
router.delete('/:projectId', authorizeRoles('ADMIN'), validate(projectIdParamSchema), asyncHandler(deleteProjectController));
router.post('/:projectId/members', authorizeRoles('ADMIN'), validate(addMemberSchema), asyncHandler(addMemberController));
router.delete(
  '/:projectId/members/:userId',
  authorizeRoles('ADMIN'),
  validate(removeMemberSchema),
  asyncHandler(removeMemberController)
);
router.get('/:projectId/tasks', validate(projectTaskListSchema), asyncHandler(listProjectTasksController));

export default router;
