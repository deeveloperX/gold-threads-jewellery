import { apiRequest } from './api';

const TOKEN_KEY = 'gold-threads-admin-token';

export const authService = {
  login(email, password) {
    return apiRequest('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  },

  getToken() {
    return sessionStorage.getItem(TOKEN_KEY);
  },

  setToken(token) {
    sessionStorage.setItem(TOKEN_KEY, token);
  },

  getProfile(token) {
    return apiRequest('/auth/profile', { authToken: token });
  },

  logout() {
    sessionStorage.removeItem(TOKEN_KEY);
  },
};
