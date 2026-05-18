import api from './api';
import { STORAGE_KEYS } from '../utils/constants';
import { productService } from './productService';

const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null');
    return user?.id || user?._id || null;
  } catch {
    return null;
  }
};

export const cartService = {
  getCart: () => {
    const userId = getUserId();
    return api.get(`/cart/${userId}`);
  },
  addItem: async (productId, quantity) => {
    const userId = getUserId();
    const productRes = await productService.getById(productId);
    const book = productRes.data || {};
    return api.post('/cart/add', {
      userId,
      productId,
      quantity,
      productName: book.title || book.name || 'Book',
      price: book.discountPrice || book.price || 0,
      imageUrl: book.imageUrl,
    });
  },
  updateItem: (productId, quantity) => {
    const userId = getUserId();
    return api.put('/cart/update', { userId, productId, quantity });
  },
  removeItem: (cartItemId) => api.delete(`/cart/remove/${cartItemId}`),
  clearCart: () => {
    const userId = getUserId();
    return api.delete(`/cart/clear/${userId}`);
  },
};
