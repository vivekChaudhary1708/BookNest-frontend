import api from './api';
import { STORAGE_KEYS } from '../utils/constants';

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null');
  } catch {
    return null;
  }
};

export const notificationService = {
  getMyNotifications: (isAdmin = false) => {
    const user = getUser();
    const recipientType = isAdmin ? 'ADMIN' : 'CUSTOMER';
    const recipientId = isAdmin ? 'ADMIN' : (user?.id || user?._id || '');
    return api.get('/notifications', { params: { recipientType, recipientId } });
  },
};
