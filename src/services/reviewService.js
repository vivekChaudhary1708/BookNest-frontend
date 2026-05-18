import api from './api';

export const reviewService = {
  getByProduct: (productId) => api.get(`/reviews/product/${productId}`),
  addReview: (data) => api.post('/reviews/add', data),
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/reviews/delete/${id}`),
  getAllReviews: () => api.get('/reviews/all'),
};
