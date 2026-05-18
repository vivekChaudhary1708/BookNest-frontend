import api from './api';

const toUiBook = (product = {}) => ({
  ...product,
  title: product.title || product.name || product.productName || 'Untitled Book',
  author: product.author || 'Unknown Author',
  price: Number.isFinite(Number(product.price)) ? Number(product.price) : 0,
  stockQuantity: Number.isFinite(Number(product.stockQuantity))
    ? Number(product.stockQuantity)
    : Number(product.stock ?? 0),
  discountPrice: Number.isFinite(Number(product.discountPrice))
    ? Number(product.discountPrice)
    : (Number.isFinite(Number(product.price)) ? Number(product.price) : 0),
});

const toBackendPayload = (data = {}) => ({
  name: data.title || data.name || '',
  description: data.description || '',
  price: Number(data.price || 0),
  category: data.category || '',
  stock: Number(data.stockQuantity ?? data.stock ?? 0),
  imageUrl: data.imageUrl || '',
});

export const productService = {
  async getAll() {
    const res = await api.get('/products/all');
    return { ...res, data: (Array.isArray(res.data) ? res.data : []).map(toUiBook) };
  },
  async getById(id) {
    const res = await api.get(`/products/${id}`);
    return { ...res, data: toUiBook(res.data) };
  },
  async create(data) {
    const res = await api.post('/products/add', toBackendPayload(data));
    return {
      ...res,
      data: { id: crypto.randomUUID(), ...toUiBook(data) },
    };
  },
  async update(id, data) {
    const res = await api.put(`/products/update/${id}`, toBackendPayload(data));
    return { ...res, data: { id, ...toUiBook(data) } };
  },
  delete: (id) => api.delete(`/products/delete/${id}`),
  search: (query) => api.get('/products/all', { params: { q: query } }),
  getByCategory: (cat) => api.get('/products/all', { params: { category: cat } }),
  updateStock: (id, qty) => api.put(`/products/stock/${id}?stock=${qty}`),
};
