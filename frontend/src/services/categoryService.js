import { apiRequest } from './api';

export const categoryService = {
  getCategories() {
    return apiRequest('/categories');
  },

  getPopularCategories() {
    return apiRequest('/categories/popular');
  },

  createCategory(token, category) {
    return apiRequest('/categories', {
      method: 'POST',
      authToken: token,
      body: category,
    });
  },

  updateCategory(token, id, category) {
    return apiRequest(`/categories/${id}`, {
      method: 'PUT',
      authToken: token,
      body: category,
    });
  },

  deleteCategory(token, id) {
    return apiRequest(`/categories/${id}`, {
      method: 'DELETE',
      authToken: token,
    });
  },
};
