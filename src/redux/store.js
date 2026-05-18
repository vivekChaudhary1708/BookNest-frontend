import { configureStore } from '@reduxjs/toolkit';
import authReducer     from './slices/authSlice';
import cartReducer     from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import bookReducer     from './slices/bookSlice';
import orderReducer    from './slices/orderSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth:     authReducer,
    cart:     cartReducer,
    wishlist: wishlistReducer,
    books:    bookReducer,
    orders:   orderReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  devTools: import.meta.env.DEV,
});

export default store;
