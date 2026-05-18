import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from '../../services/orderService';
import toast from 'react-hot-toast';

export const placeOrder = createAsyncThunk('orders/place', async (data, { rejectWithValue }) => {
  try {
    const res = await orderService.placeOrder(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to place order');
  }
});

export const fetchMyOrders = createAsyncThunk('orders/fetchMy', async (_, { rejectWithValue }) => {
  try {
    const res = await orderService.getMyOrders();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
  }
});

export const fetchAllOrders = createAsyncThunk('orders/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await orderService.getAllOrders();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
  }
});

export const updateOrderStatus = createAsyncThunk('orders/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const res = await orderService.updateStatus(id, status);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update status');
  }
});

export const cancelOrder = createAsyncThunk('orders/cancel', async (id, { rejectWithValue }) => {
  try {
    const res = await orderService.cancelOrder(id);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to cancel order');
  }
});

export const removeOrder = createAsyncThunk('orders/remove', async (id, { rejectWithValue }) => {
  try {
    await orderService.deleteOrder(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete order');
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    myOrders:  [],
    allOrders: [],
    isLoading: false,
    error:     null,
  },
  reducers: {
    clearOrderError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending,  (state) => { state.isLoading = true; state.error = null; })
      .addCase(placeOrder.fulfilled,(state, { payload }) => {
        state.isLoading = false;
        state.myOrders.unshift(payload);
        toast.success('Order placed successfully! 🎉');
      })
      .addCase(placeOrder.rejected, (state, { payload }) => {
        state.isLoading = false; state.error = payload;
        toast.error(payload || 'Could not place order');
      })

      .addCase(fetchMyOrders.pending, (state) => { state.isLoading = true; })
      .addCase(fetchMyOrders.fulfilled,(state, { payload }) => {
        state.isLoading = false;
        state.myOrders  = Array.isArray(payload) ? payload : payload?.content || [];
      })
      .addCase(fetchMyOrders.rejected,(state, { payload }) => { state.isLoading = false; state.error = payload; })

      .addCase(fetchAllOrders.pending, (state) => { state.isLoading = true; })
      .addCase(fetchAllOrders.fulfilled,(state, { payload }) => {
        state.isLoading  = false;
        state.allOrders  = Array.isArray(payload) ? payload : payload?.content || [];
      })
      .addCase(fetchAllOrders.rejected,(state, { payload }) => { state.isLoading = false; state.error = payload; })

      .addCase(updateOrderStatus.fulfilled, (state, { payload }) => {
        const idx = state.allOrders.findIndex((o) => o.id === payload.id);
        if (idx !== -1) state.allOrders[idx] = payload;
        const myIdx = state.myOrders.findIndex((o) => o.id === payload.id);
        if (myIdx !== -1) state.myOrders[myIdx] = payload;
        toast.success('Order status updated');
      })

      .addCase(cancelOrder.fulfilled, (state, { payload }) => {
        const update = (list) => {
          const i = list.findIndex((o) => o.id === payload.id);
          if (i !== -1) list[i] = payload;
        };
        update(state.myOrders);
        update(state.allOrders);
        toast.success('Order cancelled');
      })

      .addCase(removeOrder.fulfilled, (state, { payload }) => {
        state.myOrders = state.myOrders.filter((o) => o.id !== payload);
        state.allOrders = state.allOrders.filter((o) => o.id !== payload);
        toast.success('Order removed from history');
      })
      .addCase(removeOrder.rejected, (state, { payload }) => {
        toast.error(payload || 'Could not delete order');
      });
  },
});

export const { clearOrderError } = orderSlice.actions;

export const selectMyOrders  = (s) => s.orders.myOrders;
export const selectAllOrders = (s) => s.orders.allOrders;
export const selectOrdersLoading = (s) => s.orders.isLoading;
export const selectOrdersError   = (s) => s.orders.error;

export default orderSlice.reducer;
