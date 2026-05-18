import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '../../services/productService';
import { reviewService } from '../../services/reviewService';

export const fetchProducts = createAsyncThunk('books/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await productService.getAll(params);
    const books = Array.isArray(res.data) ? res.data : [];
    
    let allReviews = [];
    try {
      const revRes = await reviewService.getAllReviews();
      allReviews = Array.isArray(revRes.data) ? revRes.data : [];
    } catch (e) {
      console.warn('Failed to fetch reviews', e);
    }
    
    books.forEach((b) => {
      const bookReviews = allReviews.filter((r) => r.productId === b.id || r.productId === b._id);
      if (bookReviews.length > 0) {
        b.reviewCount = bookReviews.length;
        b.averageRating = bookReviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / bookReviews.length;
      } else {
        b.reviewCount = 0;
        b.averageRating = 0;
      }
    });

    const query = (params?.search || '').trim().toLowerCase();
    const category = (params?.category || '').trim().toLowerCase();
    const minPrice = Number(params?.minPrice || 0);
    const maxPrice = Number(params?.maxPrice || 0);
    const minRating = Number(params?.rating || 0);

    let filtered = books.filter((b) => {
      const title = (b.title || '').toLowerCase();
      const author = (b.author || '').toLowerCase();
      const cat = (b.category || '').toLowerCase();
      const keywords = (b.searchKeywords || '').toLowerCase();
      const amount = Number(b.discountPrice || b.price || 0);
      const rating = Number(b.averageRating || 0);

      const searchMatch = !query || `${title} ${author} ${cat} ${keywords}`.includes(query);
      const categoryMatch = !category || cat === category;
      const minMatch = !minPrice || amount >= minPrice;
      const maxMatch = !maxPrice || amount <= maxPrice;
      const ratingMatch = !minRating || rating >= minRating;
      return searchMatch && categoryMatch && minMatch && maxMatch && ratingMatch;
    });

    if (params?.sort === 'price_asc') filtered = filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    else if (params?.sort === 'price_desc') filtered = filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    else if (params?.sort === 'rating') filtered = filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));

    return filtered;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
  }
});

export const fetchProductById = createAsyncThunk('books/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await productService.getById(id);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Product not found');
  }
});

export const createProduct = createAsyncThunk('books/create', async (data, { rejectWithValue }) => {
  try {
    const res = await productService.create(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create product');
  }
});

export const updateProduct = createAsyncThunk('books/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await productService.update(id, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update product');
  }
});

export const deleteProduct = createAsyncThunk('books/delete', async (id, { rejectWithValue }) => {
  try {
    await productService.delete(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete product');
  }
});

const bookSlice = createSlice({
  name: 'books',
  initialState: {
    items:       [],
    currentBook: null,
    totalPages:  1,
    totalItems:  0,
    currentPage: 0,
    isLoading:   false,
    error:       null,
    filters: {
      search:   '',
      category: '',
      minPrice: '',
      maxPrice: '',
      sort:     'newest',
      rating:   '',
    },
  },
  reducers: {
    setFilters(state, { payload }) {
      state.filters = { ...state.filters, ...payload };
    },
    resetFilters(state) {
      state.filters = { search: '', category: '', minPrice: '', maxPrice: '', sort: 'newest', rating: '' };
    },
    clearCurrentBook(state) {
      state.currentBook = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchProducts.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, { payload }) => {
        state.isLoading  = false;
        // Support both array response and paginated {content, totalPages, ...}
        if (Array.isArray(payload)) {
          state.items      = payload;
          state.totalItems = payload.length;
          state.totalPages = 1;
        } else {
          state.items      = payload.content || payload.items || [];
          state.totalPages = payload.totalPages || 1;
          state.totalItems = payload.totalElements || state.items.length;
          state.currentPage = payload.number || 0;
        }
      })
      .addCase(fetchProducts.rejected, (state, { payload }) => {
        state.isLoading = false; state.error = payload;
      })

      // Fetch by id
      .addCase(fetchProductById.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchProductById.fulfilled, (state, { payload }) => {
        state.isLoading = false; state.currentBook = payload;
      })
      .addCase(fetchProductById.rejected, (state, { payload }) => {
        state.isLoading = false; state.error = payload;
      })

      // Create
      .addCase(createProduct.fulfilled, (state, { payload }) => {
        state.items.unshift(payload);
      })

      // Update
      .addCase(updateProduct.fulfilled, (state, { payload }) => {
        const idx = state.items.findIndex((b) => b.id === payload.id);
        if (idx !== -1) state.items[idx] = payload;
        if (state.currentBook?.id === payload.id) state.currentBook = payload;
      })

      // Delete
      .addCase(deleteProduct.fulfilled, (state, { payload }) => {
        state.items = state.items.filter((b) => b.id !== payload);
      });
  },
});

export const { setFilters, resetFilters, clearCurrentBook } = bookSlice.actions;

export const selectBooks       = (s) => s.books.items;
export const selectCurrentBook = (s) => s.books.currentBook;
export const selectBooksLoading= (s) => s.books.isLoading;
export const selectBooksError  = (s) => s.books.error;
export const selectFilters     = (s) => s.books.filters;
export const selectTotalPages  = (s) => s.books.totalPages;
export const selectTotalItems  = (s) => s.books.totalItems;

export default bookSlice.reducer;
