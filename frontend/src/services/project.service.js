import api from './api.js';

export const fetchProjects = async () => {
  const response = await api.get('/api/projects');
  return response.data;
};

export const createProject = async (payload) => {
  const response = await api.post('/api/projects', payload);
  return response.data;
};

export const fetchProjectById = async (projectId) => {
  const response = await api.get(`/api/projects/${projectId}`);
  return response.data;
};

export const addProjectMember = async (projectId, userId) => {
  const response = await api.post(`/api/projects/${projectId}/members`, { userId });
  return response.data;
};

export const removeProjectMember = async (projectId, userId) => {
  const response = await api.delete(`/api/projects/${projectId}/members/${userId}`);
  return response.data;
};

export const deleteProject = async (projectId) => {
  const response = await api.delete(`/api/projects/${projectId}`);
  return response.data;
};

export const fetchProjectTasks = async (projectId) => {
  const response = await api.get(`/api/projects/${projectId}/tasks`);
  return response.data;
};
