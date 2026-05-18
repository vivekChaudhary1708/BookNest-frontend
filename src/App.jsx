import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PageLoader } from './components/Loader';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';
import PublicLayout from './layouts/PublicLayout';
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';
import { ROLES } from './utils/constants';

// ── Lazy-loaded pages ─────────────────────────────────────────────────────────
const LandingPage      = lazy(() => import('./pages/public/LandingPage'));
const LoginPage        = lazy(() => import('./pages/public/LoginPage'));
const RegisterPage     = lazy(() => import('./pages/public/RegisterPage'));
const ForgotPasswordPage= lazy(() => import('./pages/public/ForgotPasswordPage'));
const VerifyOtpPage    = lazy(() => import('./pages/public/VerifyOtpPage'));
const ResetPasswordPage= lazy(() => import('./pages/public/ResetPasswordPage'));
const BooksPage        = lazy(() => import('./pages/public/BooksPage'));
const AboutPage        = lazy(() => import('./pages/public/AboutPage'));
const ContactPage      = lazy(() => import('./pages/public/ContactPage'));

const BookDetailPage   = lazy(() => import('./pages/customer/BookDetailPage'));
const CartPage         = lazy(() => import('./pages/customer/CartPage'));
const WishlistPage     = lazy(() => import('./pages/customer/WishlistPage'));
const CheckoutPage     = lazy(() => import('./pages/customer/CheckoutPage'));
const OrdersPage       = lazy(() => import('./pages/customer/OrdersPage'));
const NotificationsPage = lazy(() => import('./pages/customer/NotificationsPage'));
const ProfilePage      = lazy(() => import('./pages/customer/ProfilePage'));

const AdminDashboard   = lazy(() => import('./pages/admin/AdminDashboard'));
const AddBookPage      = lazy(() => import('./pages/admin/AddBookPage'));
const ManageBooksPage  = lazy(() => import('./pages/admin/ManageBooksPage'));
const ManageOrdersPage = lazy(() => import('./pages/admin/ManageOrdersPage'));
const UsersPage        = lazy(() => import('./pages/admin/UsersPage'));
const ReviewsPage      = lazy(() => import('./pages/admin/ReviewsPage'));
const AnalyticsPage    = lazy(() => import('./pages/admin/AnalyticsPage'));
const AdminNotificationsPage = lazy(() => import('./pages/admin/AdminNotificationsPage'));

const UnauthorizedPage = lazy(() => import('./pages/UnauthorizedPage'));
const NotFoundPage     = lazy(() => import('./pages/NotFoundPage'));

const App = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      {/* ── Public layout ─────────────────────────────────────────── */}
      <Route element={<PublicLayout />}>
        <Route path="/"         element={<LandingPage />} />
        <Route path="/books"    element={<BooksPage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="/about"    element={<AboutPage />} />
        <Route path="/contact"  element={<ContactPage />} />
      </Route>

      {/* Auth (standalone, no navbar) */}
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-otp"      element={<VerifyOtpPage />} />
      <Route path="/reset-password"  element={<ResetPasswordPage />} />

      {/* ── Customer layout (must be logged in as CUSTOMER) ────────── */}
      <Route
        element={
          <ProtectedRoute>
            <RoleRoute role={ROLES.CUSTOMER}>
              <CustomerLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route path="/cart"      element={<CartPage />} />
        <Route path="/wishlist"  element={<WishlistPage />} />
        <Route path="/checkout"  element={<CheckoutPage />} />
        <Route path="/orders"    element={<OrdersPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile"   element={<ProfilePage />} />
      </Route>

      {/* ── Admin layout (must be logged in as ADMIN) ─────────────── */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleRoute role={ROLES.ADMIN}>
              <AdminLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index              element={<AdminDashboard />} />
        <Route path="add-book"    element={<AddBookPage />} />
        <Route path="books"       element={<ManageBooksPage />} />
        <Route path="orders"      element={<ManageOrdersPage />} />
        <Route path="users"       element={<UsersPage />} />
        <Route path="reviews"     element={<ReviewsPage />} />
        <Route path="analytics"   element={<AnalyticsPage />} />
        <Route path="notifications" element={<AdminNotificationsPage />} />
      </Route>

      {/* ── Utility ────────────────────────────────────────────────── */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*"             element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);

export default App;
