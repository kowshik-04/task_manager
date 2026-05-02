import { signup, login } from '../services/auth.service.js';
import { sendResponse } from '../utils/response.js';

export const signupController = async (req, res) => {
  const payload = req.validated.body;
  const result = await signup(payload);
  return sendResponse(res, 201, result, 'Signup successful');
};

export const loginController = async (req, res) => {
  const payload = req.validated.body;
  const result = await login(payload);
  return sendResponse(res, 200, result, 'Login successful');
};
