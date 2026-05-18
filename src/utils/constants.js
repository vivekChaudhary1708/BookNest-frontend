// API Base URL from env
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Auth roles
export const ROLES = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
};

// Order statuses
export const ORDER_STATUS = {
  PLACED:    { label: 'Placed',     color: 'badge-blue' },
  CONFIRMED: { label: 'Confirmed',  color: 'badge-purple' },
  SHIPPED:   { label: 'Shipped',    color: 'badge-gold' },
  DELIVERED: { label: 'Delivered',  color: 'badge-green' },
  CANCELLED: { label: 'Cancelled',  color: 'badge-red' },
};

export const ORDER_STATUS_LIST = ['PLACED','CONFIRMED','SHIPPED','DELIVERED','CANCELLED'];

// Book categories
export const BOOK_CATEGORIES = [
  'Fiction', 'Non-Fiction', 'Science', 'Technology', 'History',
  'Biography', 'Self-Help', 'Romance', 'Mystery', 'Thriller',
  'Fantasy', 'Horror', 'Children', 'Educational', 'Comics',
  'Poetry', 'Philosophy', 'Religion', 'Art', 'Business',
];

// Pagination
export const DEFAULT_PAGE_SIZE = 12;

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN:     'booknest_token',
  USER:      'booknest_user',
};
