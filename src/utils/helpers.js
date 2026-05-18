import { STORAGE_KEYS } from './constants';

// Format currency
export const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
    .format(Number.isFinite(Number(price)) ? Number(price) : 0);

// Calculate discount percentage
export const discountPercent = (original, discounted) =>
  original > 0 ? Math.round(((original - discounted) / original) * 100) : 0;

// Format date
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

// Truncate text
export const truncate = (str, len = 80) =>
  str && str.length > len ? str.slice(0, len) + '…' : str;

// Get token
export const getToken = () => localStorage.getItem(STORAGE_KEYS.TOKEN);

// Get user
export const getUser = () => {
  try {
    const u = localStorage.getItem(STORAGE_KEYS.USER);
    return u ? JSON.parse(u) : null;
  } catch { return null; }
};

// Average rating from reviews array
export const avgRating = (reviews = []) => {
  if (!reviews.length) return 0;
  return (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1);
};

// Clamp
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

// Build query string from params object
export const buildQuery = (params) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q.set(k, v);
  });
  return q.toString() ? `?${q.toString()}` : '';
};

// Generate initials avatar
export const initials = (name = '') =>
  name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

// Stock status label
export const stockLabel = (qty) => {
  if (qty <= 0)  return { text: 'Out of Stock', cls: 'badge-red' };
  if (qty <= 5)  return { text: 'Low Stock',    cls: 'badge-gold' };
  return               { text: 'In Stock',      cls: 'badge-green' };
};
