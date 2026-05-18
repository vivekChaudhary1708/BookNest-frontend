import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '../../services/cartService';
import toast from 'react-hot-toast';

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await cartService.getCart();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch cart');
  }
});

export const addToCart = createAsyncThunk('cart/add', async ({ productId, quantity = 1 }, { rejectWithValue }) => {
  try {
    const res = await cartService.addItem(productId, quantity);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add to cart');
  }
});

export const updateCartItem = createAsyncThunk('cart/update', async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const res = await cartService.updateItem(productId, quantity);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update cart');
  }
});

export const removeFromCart = createAsyncThunk('cart/remove', async (cartItemId, { rejectWithValue }) => {
  try {
    const res = await cartService.removeItem(cartItemId);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to remove item');
  }
});

export const clearCartAsync = createAsyncThunk('cart/clear', async (_, { rejectWithValue }) => {
  try {
    await cartService.clearCart();
    return true;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to clear cart');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items:     [],
    isLoading: false,
    error:     null,
  },
  reducers: {
    clearCartLocal(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    const setLoading = (state)           => { state.isLoading = true; state.error = null; };
    const setItems = (state, { payload }) => {
      const rawItems = payload?.items || payload || [];
      state.isLoading = false;
      state.items = rawItems.map((item) => ({
        ...item,
        title: item.title || item.productName || 'Book',
      }));
    };
    const setError   = (state, { payload }) => { state.isLoading = false; state.error = payload; };

    builder
      .addCase(fetchCart.pending, setLoading)
      .addCase(fetchCart.fulfilled, setItems)
      .addCase(fetchCart.rejected, setError)

      .addCase(addToCart.pending, setLoading)
      .addCase(addToCart.fulfilled, (state, action) => {
        setItems(state, action);
        toast.success('Added to cart!');
      })
      .addCase(addToCart.rejected, (state, { payload }) => {
        setError(state, { payload });
        toast.error(payload || 'Could not add to cart');
      })

      .addCase(updateCartItem.pending, setLoading)
      .addCase(updateCartItem.fulfilled, setItems)
      .addCase(updateCartItem.rejected, setError)

      .addCase(removeFromCart.pending, setLoading)
      .addCase(removeFromCart.fulfilled, (state, action) => {
        setItems(state, action);
        toast.success('Removed from cart');
      })
      .addCase(removeFromCart.rejected, setError)

      .addCase(clearCartAsync.fulfilled, (state) => { state.items = []; });
  },
});

export const { clearCartLocal } = cartSlice.actions;

export const selectCart      = (s) => s.cart;
export const selectCartItems = (s) => s.cart.items;
export const selectCartCount = (s) => s.cart.items.reduce((n, i) => n + (i.quantity || 1), 0);
export const selectCartTotal = (s) =>
  s.cart.items.reduce((t, i) => t + ((i.price || i.discountPrice || 0) * (i.quantity || 1)), 0);

export default cartSlice.reducer;
