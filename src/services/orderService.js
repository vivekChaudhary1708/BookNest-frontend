import api from './api';
import { STORAGE_KEYS } from '../utils/constants';

const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null');
    return user?.id || user?._id || null;
  } catch {
    return null;
  }
};

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null');
  } catch {
    return null;
  }
};

export const orderService = {
  placeOrder: (data) => {
    const user = getUser();
    return api.post('/orders/place', {
      userId: user?.id || user?._id,
      userName: user?.name,
      userEmail: user?.email,
      ...data,
    });
  },
  getMyOrders: () => {
    const userId = getUserId();
    return api.get(`/orders/${userId}`);
  },
  getAllOrders: () => {
    return api.get('/orders/all');
  },
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  cancelOrder: (id) => api.put(`/orders/cancel/${id}`),
  deleteOrder: (id) => api.delete(`/orders/delete/${id}`),
};
