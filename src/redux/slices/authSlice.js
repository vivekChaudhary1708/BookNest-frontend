import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import { STORAGE_KEYS, ROLES } from '../../utils/constants';

// ── Async thunks ──────────────────────────────────────────────────────────────
const normalizeRole = (role) => {
  const upper = (role || '').toUpperCase();
  if (upper === 'ADMIN') return ROLES.ADMIN;
  if (upper === 'CUSTOMER' || upper === 'USER') return ROLES.CUSTOMER;
  return upper || ROLES.CUSTOMER;
};

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const res = await authService.login(credentials);
    return res.data;
  } catch (err) {
    const data = err.response?.data;
    return rejectWithValue(data?.message || data?.error || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await authService.register(data);
    return res.data;
  } catch (err) {
    const resp = err.response?.data;
    return rejectWithValue(resp?.message || resp?.error || 'Registration failed');
  }
});

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const res = await authService.getMe();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch user');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const res = await authService.updateProfile(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Update failed');
  }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, { rejectWithValue }) => {
  try {
    const res = await authService.forgotPassword(email);
    return res.data;
  } catch (err) {
    const data = err.response?.data;
    return rejectWithValue(data?.message || data?.error || 'Failed to send OTP');
  }
});

export const verifyOtp = createAsyncThunk('auth/verifyOtp', async (data, { rejectWithValue }) => {
  try {
    const res = await authService.verifyOtp(data);
    return res.data;
  } catch (err) {
    const resp = err.response?.data;
    return rejectWithValue(resp?.message || resp?.error || 'Invalid OTP');
  }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async (data, { rejectWithValue }) => {
  try {
    const res = await authService.resetPassword(data);
    return res.data;
  } catch (err) {
    const resp = err.response?.data;
    return rejectWithValue(resp?.message || resp?.error || 'Failed to reset password');
  }
});

// ── Helpers ───────────────────────────────────────────────────────────────────
const loadFromStorage = () => {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const user  = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null');
    return { token, user: user ? { ...user, role: normalizeRole(user.role) } : null };
  } catch {
    return { token: null, user: null };
  }
};

const { token: storedToken, user: storedUser } = loadFromStorage();

// ── Slice ─────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:        storedUser,
    token:       storedToken,
    isLoading:   false,
    error:       null,
    isAuthenticated: !!storedToken,
  },
  reducers: {
    logout(state) {
      state.user           = null;
      state.token          = null;
      state.isAuthenticated = false;
      state.error          = null;
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    },
    clearError(state) {
      state.error = null;
    },
    setUser(state, action) {
      const normalizedUser = { ...action.payload, role: normalizeRole(action.payload?.role) };
      state.user = normalizedUser;
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(normalizedUser));
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        const normalizedUser = { ...(payload.user || payload), role: normalizeRole((payload.user || payload)?.role) };
        state.isLoading      = false;
        state.token          = payload.token;
        state.user           = normalizedUser;
        state.isAuthenticated = true;
        localStorage.setItem(STORAGE_KEYS.TOKEN, payload.token);
        localStorage.setItem(STORAGE_KEYS.USER,  JSON.stringify(normalizedUser));
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error     = payload;
      });

    // Register
    builder
      .addCase(registerUser.pending,  (state) => { state.isLoading = true; state.error = null; })
      .addCase(registerUser.fulfilled,(state) => { state.isLoading = false; })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error     = payload;
      });

    // Fetch me
    builder
      .addCase(fetchMe.pending,  (state) => { state.isLoading = true; })
      .addCase(fetchMe.fulfilled,(state, { payload }) => {
        const normalizedUser = { ...payload, role: normalizeRole(payload?.role) };
        state.isLoading = false;
        state.user      = normalizedUser;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(normalizedUser));
      })
      .addCase(fetchMe.rejected, (state) => { state.isLoading = false; });

    // Update profile
    builder
      .addCase(updateProfile.pending,  (state) => { state.isLoading = true; state.error = null; })
      .addCase(updateProfile.fulfilled,(state, { payload }) => {
        const normalizedUser = { ...payload, role: normalizeRole(payload?.role) };
        state.isLoading = false;
        state.user      = normalizedUser;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(normalizedUser));
      })
      .addCase(updateProfile.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error     = payload;
      });
  },
});

export const { logout, clearError, setUser } = authSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectAuth          = (s) => s.auth;
export const selectUser          = (s) => s.auth.user;
export const selectToken         = (s) => s.auth.token;
export const selectIsAuth        = (s) => s.auth.isAuthenticated;
export const selectIsAdmin       = (s) => s.auth.user?.role === ROLES.ADMIN;
export const selectIsCustomer    = (s) => s.auth.user?.role === ROLES.CUSTOMER;
export const selectAuthLoading   = (s) => s.auth.isLoading;
export const selectAuthError     = (s) => s.auth.error;

export default authSlice.reducer;
