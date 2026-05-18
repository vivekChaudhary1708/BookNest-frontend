import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, BookMarked, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { loginUser, selectAuthLoading, selectAuthError, clearError } from '../../redux/slices/authSlice';
import { fetchCart } from '../../redux/slices/cartSlice';
import { fetchWishlist } from '../../redux/slices/wishlistSlice';
import { ROLES } from '../../utils/constants';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import AuthShowcase from '../../components/AuthShowcase';

const LoginPage = () => {
  const [showPass, setShowPass]   = useState(false);
  const [loginRole, setLoginRole] = useState(ROLES.CUSTOMER);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const isLoading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => { dispatch(clearError()); }, [dispatch]);

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser({ ...data, role: loginRole }));
    if (loginUser.fulfilled.match(result)) {
      const user = result.payload?.user || result.payload;
      if (loginRole === ROLES.ADMIN && user?.role !== ROLES.ADMIN) {
        navigate('/unauthorized');
        return;
      }
      if (loginRole === ROLES.CUSTOMER && user?.role !== ROLES.CUSTOMER) {
        toast.error('Please use Admin login for admin accounts.');
        return;
      }
      toast.success(`Welcome back, ${user?.name || 'User'}!`);
      dispatch(fetchCart());
      dispatch(fetchWishlist());
      navigate(user?.role === ROLES.ADMIN ? '/admin' : '/books');
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient px-4 py-10 overflow-hidden">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
        <div className="hidden lg:block animate-slide-up">
          <AuthShowcase />
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="mb-7">
              <Link to="/" className="inline-flex items-center gap-2.5">
                <div className="w-12 h-12 rounded-2xl bg-gold-gradient flex items-center justify-center shadow-glow transition-transform duration-300 hover:scale-[1.03]">
                  <BookMarked className="w-6 h-6 text-navy-700" />
                </div>
                <span className="font-heading font-bold text-2xl text-dark-text">Book<span className="text-gradient">Nest</span></span>
              </Link>
              <p className="text-dark-muted mt-2 text-sm">Sign in to your account</p>
            </div>

            <div className="card p-8 shadow-card-hover animate-slide-up ring-gradient">
          {/* Role tabs */}
          <div className="flex gap-2 mb-6 p-1 bg-dark-bg rounded-xl">
            {[ROLES.CUSTOMER, ROLES.ADMIN].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setLoginRole(role)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  loginRole === role
                    ? 'bg-primary-500 text-navy-700 shadow'
                    : 'text-dark-muted hover:text-dark-text'
                }`}
              >
                {role === ROLES.CUSTOMER ? '👤 Customer' : '🛡️ Admin'}
              </button>
            ))}
          </div>

          {authError && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-5">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-400">{authError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="animate-fade-in">
              <label className="input-label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                  })}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-1.5">
                <label className="input-label mb-0">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                  {...register('password', { required: 'Password is required' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-muted hover:text-dark-text transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2 animate-fade-in">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-dark-border accent-primary-500" />
              <label htmlFor="remember" className="text-sm text-dark-muted">Remember me for 30 days</label>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-navy-700/40 border-t-navy-700 rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : `Sign in as ${loginRole === ROLES.ADMIN ? 'Admin' : 'Customer'}`}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-dark-muted">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-400 font-semibold hover:text-primary-300 transition-colors">
                Create account
              </Link>
            </p>
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
