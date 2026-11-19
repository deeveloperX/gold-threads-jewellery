import { apiRequest } from './api';

export const settingsService = {
  getSettings() {
    return apiRequest('/settings');
  },

  updateSettings(token, settings) {
    return apiRequest('/settings', {
      method: 'PUT',
      authToken: token,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
  },
};
