import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard, BookPlus, BookOpen, ShoppingBag,
  Users, Star, BarChart2, LogOut, Menu, X, BookMarked, Bell
} from 'lucide-react';
import { logout, selectUser } from '../redux/slices/authSlice';
import { clearCartLocal } from '../redux/slices/cartSlice';
import { clearWishlistLocal } from '../redux/slices/wishlistSlice';
import { fetchNotifications, selectUnreadNotificationsCount } from '../redux/slices/notificationSlice';
import { initials } from '../utils/helpers';

const links = [
  { to: '/admin',              label: 'Dashboard',     icon: LayoutDashboard, end: true },
  { to: '/admin/add-book',     label: 'Add Book',      icon: BookPlus },
  { to: '/admin/books',        label: 'Manage Books',  icon: BookOpen },
  { to: '/admin/orders',       label: 'Orders',        icon: ShoppingBag },
  { to: '/admin/users',        label: 'Users',         icon: Users },
  { to: '/admin/reviews',      label: 'Reviews',       icon: Star },
  { to: '/admin/analytics',    label: 'Analytics',     icon: BarChart2 },
  { to: '/admin/notifications',label: 'Notifications', icon: Bell },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const user       = useSelector(selectUser);
  const unreadCount = useSelector(selectUnreadNotificationsCount);

  useEffect(() => {
    // Fetch admin notifications periodically or on mount to update the badge
    dispatch(fetchNotifications(true));
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCartLocal());
    dispatch(clearWishlistLocal());
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-dark-border">
        <div className="w-9 h-9 rounded-xl bg-gold-gradient flex items-center justify-center">
          <BookMarked className="w-5 h-5 text-navy-700" />
        </div>
        <div>
          <p className="font-heading font-bold text-dark-text text-lg leading-none">BookNest</p>
          <p className="text-xs text-primary-500 font-medium">Admin Panel</p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `sidebar-link flex items-center justify-between ${isActive ? 'active' : ''}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-4 h-4" />
              {label}
            </div>
            {label === 'Notifications' && unreadCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div className="p-4 border-t border-dark-border">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-navy-700 font-bold text-sm">
            {initials(user?.name || 'Admin')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-dark-text truncate">{user?.name || 'Admin'}</p>
            <p className="text-xs text-dark-muted truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="sidebar-link w-full text-red-400 hover:bg-red-500/10 hover:text-red-400">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-dark-bg overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 bg-dark-card border-r border-dark-border flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-dark-card border-r border-dark-border flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-4 px-4 lg:px-8 py-4 bg-dark-card border-b border-dark-border">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-dark-border transition-colors"
          >
            <Menu className="w-5 h-5 text-dark-muted" />
          </button>
          <h1 className="font-heading font-semibold text-dark-text text-lg">Admin Dashboard</h1>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
