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

export const wishlistService = {
  getWishlist: () => {
    const userId = getUserId();
    return api.get(`/wishlist/${userId}`);
  },
  addToWishlist: async (productId) => {
    const userId = getUserId();
    const productRes = await productService.getById(productId);
    const book = productRes.data || {};
    return api.post('/wishlist/add', {
      userId,
      productId,
      productName: book.title || book.name || 'Book',
      price: book.discountPrice || book.price || 0,
    });
  },
  removeFromWishlist: (wishlistItemId) => api.delete(`/wishlist/remove/${wishlistItemId}`),
  clearWishlist: () => {
    const userId = getUserId();
    return api.delete(`/wishlist/clear/${userId}`);
  },
};
