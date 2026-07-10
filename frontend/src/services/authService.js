import apiClient from './api';

const authService = {
  signup: async (fullName, email, password) => {
    const response = await apiClient.post('/auth/signup', {
      full_name: fullName,
      email,
      password
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password
    });
    // Store access token & user profile
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  me: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      console.warn("Logout endpoint error:", e);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  verifyEmail: async (email, code) => {
    const response = await apiClient.post('/auth/verify', { email, code });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (email, code, newPassword) => {
    const response = await apiClient.post('/auth/reset-password', { email, code, new_password: newPassword });
    return response.data;
  },

  updateProfile: async (payload) => {
    const response = await apiClient.put('/auth/profile', payload);
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  deleteAccount: async () => {
    const response = await apiClient.delete('/auth/account');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return response.data;
  }
};

export default authService;
