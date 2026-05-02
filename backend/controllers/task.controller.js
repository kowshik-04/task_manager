import { createTask, updateTaskStatus, getDashboardStats } from '../services/task.service.js';
import { sendResponse } from '../utils/response.js';

export const createTaskController = async (req, res) => {
  const payload = req.validated.body;
  const task = await createTask({ ...payload, createdById: req.user.id });
  return sendResponse(res, 201, task, 'Task created successfully');
};

export const updateTaskStatusController = async (req, res) => {
  const { taskId } = req.validated.params;
  const { status } = req.validated.body;
  const task = await updateTaskStatus({ taskId, status, currentUser: req.user });
  return sendResponse(res, 200, task, 'Task status updated successfully');
};

export const getDashboardStatsController = async (req, res) => {
  const stats = await getDashboardStats(req.user);
  return sendResponse(res, 200, stats, 'Dashboard stats fetched successfully');
};
