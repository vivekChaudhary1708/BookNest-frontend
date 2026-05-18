import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  BookMarked, ShoppingCart, Heart, User, Menu, X,
  Search, LogOut, LayoutDashboard, Bell
} from 'lucide-react';
import { logout, selectIsAuth, selectUser, selectIsAdmin } from '../redux/slices/authSlice';
import { selectCartCount } from '../redux/slices/cartSlice';
import { selectWishlistCount } from '../redux/slices/wishlistSlice';
import { fetchNotifications, selectUnreadNotificationsCount } from '../redux/slices/notificationSlice';
import { clearCartLocal } from '../redux/slices/cartSlice';
import { clearWishlistLocal } from '../redux/slices/wishlistSlice';
import { initials } from '../utils/helpers';

const navLinks = [
  { to: '/',          label: 'Home',       end: true },
  { to: '/books',     label: 'Books' },
  { to: '/orders',    label: 'Orders' },
  { to: '/about',     label: 'About' },
  { to: '/contact',   label: 'Contact' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const [userMenuOpen, setUserMenu]   = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const isAuth    = useSelector(selectIsAuth);
  const user      = useSelector(selectUser);
  const isAdmin   = useSelector(selectIsAdmin);
  const cartCount = useSelector(selectCartCount);
  const wishCount = useSelector(selectWishlistCount);
  const notificationCount = useSelector(selectUnreadNotificationsCount);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (isAuth) {
      dispatch(fetchNotifications(isAdmin));
    }
  }, [dispatch, isAuth, isAdmin]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCartLocal());
    dispatch(clearWishlistLocal());
    setUserMenu(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-dark-card/95 backdrop-blur-md shadow-lg border-b border-dark-border'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gold-gradient flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
              <BookMarked className="w-5 h-5 text-navy-700" />
            </div>
            <span className="font-heading font-bold text-xl text-dark-text">
              Book<span className="text-gradient">Nest</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {((isAuth && !isAdmin) ? navLinks : navLinks.filter((x) => x.to !== '/orders')).map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-primary-400 bg-primary-500/10'
                      : 'text-dark-muted hover:text-dark-text hover:bg-dark-border/50'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen((p) => !p)}
              className="p-2 rounded-xl text-dark-muted hover:text-dark-text hover:bg-dark-border/50 transition-all"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>



            {isAuth ? (
              <>
                {/* Wishlist */}
                <Link to="/wishlist" className="relative p-2 rounded-xl text-dark-muted hover:text-dark-text hover:bg-dark-border/50 transition-all">
                  <Heart className="w-5 h-5" />
                  {wishCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-dark-text text-[10px] font-bold flex items-center justify-center">
                      {wishCount > 9 ? '9+' : wishCount}
                    </span>
                  )}
                </Link>

                {/* Cart */}
                <Link to="/cart" className="relative p-2 rounded-xl text-dark-muted hover:text-dark-text hover:bg-dark-border/50 transition-all">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 rounded-full text-navy-700 text-[10px] font-bold flex items-center justify-center">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>

                <Link
                  to={isAdmin ? '/admin/notifications' : '/notifications'}
                  className="relative p-2 rounded-xl text-dark-muted hover:text-dark-text hover:bg-dark-border/50 transition-all"
                >
                  <Bell className="w-5 h-5" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </Link>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenu((p) => !p)}
                    className="flex items-center gap-2 p-1 pl-2 rounded-xl hover:bg-dark-border/50 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-navy-700 font-bold text-sm">
                      {initials(user?.name || 'U')}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-dark-text max-w-[100px] truncate">
                      {user?.name?.split(' ')[0] || 'User'}
                    </span>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-12 w-52 card shadow-card-hover py-2 animate-slide-down">
                      {isAdmin ? (
                        <Link to="/admin" onClick={() => setUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-muted hover:text-dark-text hover:bg-dark-border/50 transition-all">
                          <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                        </Link>
                      ) : (
                        <Link to="/profile" onClick={() => setUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-muted hover:text-dark-text hover:bg-dark-border/50 transition-all">
                          <User className="w-4 h-4" /> My Profile
                        </Link>
                      )}
                      <hr className="border-dark-border my-1" />
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="btn-ghost btn-sm">Login</Link>
                <Link to="/register" className="btn-primary btn-sm">Sign Up</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen((p) => !p)}
              className="md:hidden p-2 rounded-xl text-dark-muted hover:text-dark-text hover:bg-dark-border/50 transition-all"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search bar dropdown */}
        {searchOpen && (
          <div className="pb-3 animate-slide-down">
            <form onSubmit={handleSearch} className="relative">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books by title, author, category..."
                className="input pr-12"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-500 hover:text-primary-400">
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-dark-card border-t border-dark-border animate-slide-down">
          <nav className="px-4 py-3 space-y-1">
            {((isAuth && !isAdmin) ? navLinks : navLinks.filter((x) => x.to !== '/orders')).map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive ? 'text-primary-400 bg-primary-500/10' : 'text-dark-muted hover:text-dark-text'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            {!isAuth && (
              <div className="flex gap-2 pt-2">
                <Link to="/login"    onClick={() => setMobileOpen(false)} className="btn-ghost btn-sm flex-1 justify-center">Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary btn-sm flex-1 justify-center">Sign Up</Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
