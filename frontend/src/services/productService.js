import { apiRequest } from './api';

export const productService = {
  getProducts({ category } = {}) {
    const query = category ? `?${new URLSearchParams({ category })}` : '';
    return apiRequest(`/products${query}`);
  },

  getProduct(id) {
    return apiRequest(`/products/${encodeURIComponent(id)}`);
  },

  getAdminProducts(token) {
    return apiRequest('/products/admin', { authToken: token });
  },

  createProduct(token, product) {
    return apiRequest('/products', {
      method: 'POST',
      authToken: token,
      body: product,
    });
  },

  updateProduct(token, id, product) {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      authToken: token,
      body: product,
    });
  },

  deleteProduct(token, id) {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE',
      authToken: token,
    });
  },
};
