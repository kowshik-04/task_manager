import {
  createProject,
  deleteProject,
  addMemberToProject,
  removeMemberFromProject,
  listProjectsByAccess,
  getProjectByAccess
} from '../services/project.service.js';
import { listTasksByProject } from '../services/task.service.js';
import { sendResponse } from '../utils/response.js';

export const createProjectController = async (req, res) => {
  const payload = req.validated.body;
  const project = await createProject({ ...payload, createdById: req.user.id });
  return sendResponse(res, 201, project, 'Project created successfully');
};

export const deleteProjectController = async (req, res) => {
  const { projectId } = req.validated.params;
  await deleteProject(projectId);
  return sendResponse(res, 200, {}, 'Project deleted successfully');
};

export const addMemberController = async (req, res) => {
  const { projectId } = req.validated.params;
  const { userId } = req.validated.body;
  const member = await addMemberToProject({ projectId, userId });
  return sendResponse(res, 201, member, 'Member added successfully');
};

export const removeMemberController = async (req, res) => {
  const { projectId, userId } = req.validated.params;
  await removeMemberFromProject({ projectId, userId });
  return sendResponse(res, 200, {}, 'Member removed successfully');
};

export const listProjectsController = async (req, res) => {
  const projects = await listProjectsByAccess(req.user);
  return sendResponse(res, 200, projects, 'Projects fetched successfully');
};

export const getProjectController = async (req, res) => {
  const { projectId } = req.validated.params;
  const project = await getProjectByAccess({ projectId, currentUser: req.user });
  return sendResponse(res, 200, project, 'Project fetched successfully');
};

export const listProjectTasksController = async (req, res) => {
  const { projectId } = req.validated.params;
  const tasks = await listTasksByProject({ projectId, currentUser: req.user });
  return sendResponse(res, 200, tasks, 'Project tasks fetched successfully');
};
