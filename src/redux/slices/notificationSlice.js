import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { notificationService } from '../../services/notificationService';
import { STORAGE_KEYS } from '../../utils/constants';

// Get local state for notifications
const getLocalState = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
};

const saveLocalState = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (isAdmin = false, { rejectWithValue }) => {
    try {
      const res = await notificationService.getMyNotifications(isAdmin);
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { 
    list: [], 
    isLoading: false, 
    error: null,
    readIds: getLocalState('booknest_read_notifications'),
    deletedIds: getLocalState('booknest_deleted_notifications'),
  },
  reducers: {
    markAsRead(state, { payload }) {
      if (!state.readIds.includes(payload)) {
        state.readIds.push(payload);
        saveLocalState('booknest_read_notifications', state.readIds);
      }
    },
    markAllAsRead(state) {
      const newReadIds = [...new Set([...state.readIds, ...state.list.map(n => n.id)])];
      state.readIds = newReadIds;
      saveLocalState('booknest_read_notifications', newReadIds);
    },
    deleteNotification(state, { payload }) {
      if (!state.deletedIds.includes(payload)) {
        state.deletedIds.push(payload);
        saveLocalState('booknest_deleted_notifications', state.deletedIds);
      }
      state.list = state.list.filter(n => n.id !== payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        // Filter out deleted notifications on fetch
        state.list = payload.filter(n => !state.deletedIds.includes(n.id));
      })
      .addCase(fetchNotifications.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });
  },
});

export const { markAsRead, markAllAsRead, deleteNotification } = notificationSlice.actions;

export const selectNotifications = (s) => s.notifications.list;
export const selectNotificationLoading = (s) => s.notifications.isLoading;
export const selectUnreadNotificationsCount = (s) => s.notifications.list.filter(n => !s.notifications.readIds.includes(n.id)).length;

export default notificationSlice.reducer;
