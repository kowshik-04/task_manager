import api from './api.js';

export const fetchDashboardStats = async () => {
  const response = await api.get('/api/tasks/dashboard/stats');
  return response.data;
};

export const createTask = async (payload) => {
  const response = await api.post('/api/tasks', payload);
  return response.data;
};

export const updateTaskStatus = async (taskId, status) => {
  const response = await api.patch(`/api/tasks/${taskId}/status`, { status });
  return response.data;
};
