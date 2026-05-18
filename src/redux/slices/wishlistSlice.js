import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wishlistService } from '../../services/wishlistService';
import toast from 'react-hot-toast';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await wishlistService.getWishlist();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch wishlist');
  }
});

export const addToWishlist = createAsyncThunk('wishlist/add', async (productId, { rejectWithValue }) => {
  try {
    const res = await wishlistService.addToWishlist(productId);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add to wishlist');
  }
});

export const removeFromWishlist = createAsyncThunk('wishlist/remove', async (wishlistItemId, { rejectWithValue }) => {
  try {
    const res = await wishlistService.removeFromWishlist(wishlistItemId);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to remove from wishlist');
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items:     [],
    isLoading: false,
    error:     null,
  },
  reducers: {
    clearWishlistLocal(state) { state.items = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => { state.isLoading = true; })
      .addCase(fetchWishlist.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        const raw = payload?.items || payload || [];
        state.items = raw.map((item) => ({ ...item, title: item.title || item.productName || 'Book' }));
      })
      .addCase(fetchWishlist.rejected, (state, { payload }) => {
        state.isLoading = false; state.error = payload;
      })

      .addCase(addToWishlist.pending, (state) => { state.isLoading = true; })
      .addCase(addToWishlist.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        const raw = payload?.items || payload || [];
        state.items = raw.map((item) => ({ ...item, title: item.title || item.productName || 'Book' }));
        toast.success('Added to wishlist!');
      })
      .addCase(addToWishlist.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload || 'Could not add to wishlist');
      })

      .addCase(removeFromWishlist.pending, (state) => { state.isLoading = true; })
      .addCase(removeFromWishlist.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        const raw = payload?.items || payload || [];
        state.items = raw.map((item) => ({ ...item, title: item.title || item.productName || 'Book' }));
        toast.success('Removed from wishlist');
      })
      .addCase(removeFromWishlist.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload || 'Could not remove');
      });
  },
});

export const { clearWishlistLocal } = wishlistSlice.actions;

export const selectWishlist      = (s) => s.wishlist;
export const selectWishlistItems = (s) => s.wishlist.items;
export const selectWishlistCount = (s) => s.wishlist.items.length;
export const selectInWishlist    = (productId) => (s) =>
  s.wishlist.items.some((i) => (i.productId || i.id) === productId);

export default wishlistSlice.reducer;
