import { listUsers, getCurrentUserProfile, createUser } from '../services/user.service.js';
import { sendResponse } from '../utils/response.js';

export const listUsersController = async (req, res) => {
  const users = await listUsers();
  return sendResponse(res, 200, users, 'Users fetched successfully');
};

export const meController = async (req, res) => {
  const profile = await getCurrentUserProfile(req.user.id);
  return sendResponse(res, 200, profile, 'Profile fetched successfully');
};

export const createUserController = async (req, res) => {
  const user = await createUser(req.validated.body);
  return sendResponse(res, 201, user, 'User created successfully');
};
