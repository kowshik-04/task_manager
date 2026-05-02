import api from './api.js';

export const fetchUsers = async () => {
  const response = await api.get('/api/users');
  return response.data;
};

export const fetchMe = async () => {
  const response = await api.get('/api/users/me');
  return response.data;
};

export const createUser = async (userData) => {
  const response = await api.post('/api/users', userData);
  return response.data;
};
