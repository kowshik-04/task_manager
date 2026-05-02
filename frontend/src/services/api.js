import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: inject JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle auth failures and provide clear error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // No response from server (network error)
    if (!error.response) {
      if (error.message === 'Network Error') {
        error.userMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.code === 'ECONNABORTED') {
        error.userMessage = 'Request timed out. The server took too long to respond. Please try again.';
      } else {
        error.userMessage = 'Unable to connect to the server. Please try again later.';
      }
      return Promise.reject(error);
    }

    const status = error.response.status;
    const apiMessage = error.response?.data?.message;

    // 400 Bad Request: validation or client error
    if (status === 400) {
      error.userMessage = apiMessage || 'Invalid input. Please check your entries and try again.';
      return Promise.reject(error);
    }

    // 401 Unauthorized: token expired or invalid
    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      error.userMessage = 'Your session has expired. Please log in again.';
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // 403 Forbidden: user lacks permission
    if (status === 403) {
      error.userMessage = apiMessage || 'You do not have permission to perform this action.';
      return Promise.reject(error);
    }

    // 404 Not Found
    if (status === 404) {
      error.userMessage = apiMessage || 'The requested resource was not found.';
      return Promise.reject(error);
    }

    // 409 Conflict: duplicate, conflict state
    if (status === 409) {
      error.userMessage = apiMessage || 'This action conflicts with an existing entry.';
      return Promise.reject(error);
    }

    // 500+ Server Error
    if (status >= 500) {
      error.userMessage = 'Server error. Our team has been notified. Please try again later.';
      return Promise.reject(error);
    }

    // Fallback for any other error
    error.userMessage = apiMessage || 'An unexpected error occurred. Please try again.';
    return Promise.reject(error);
  }
);

export default api;
