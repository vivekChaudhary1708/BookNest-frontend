import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  getMe:    ()     => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  getAllUsers: () => api.get('/auth/users'),
  blockUser:   (id) => api.put(`/auth/users/${id}/block`),
  deleteUser:  (id) => api.delete(`/auth/users/${id}`),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};
