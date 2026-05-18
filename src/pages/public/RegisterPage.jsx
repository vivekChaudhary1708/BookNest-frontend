import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, BookMarked, Mail, Lock, User, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import { registerUser, selectAuthLoading, selectAuthError, clearError } from '../../redux/slices/authSlice';
import { passwordStrength } from '../../utils/validators';
import toast from 'react-hot-toast';
import AuthShowcase from '../../components/AuthShowcase';

const RegisterPage = () => {
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passStr, setPassStr]         = useState({ score: 0, label: 'Too Short', color: 'bg-red-500' });
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const isLoading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password', '');

  useEffect(() => { setPassStr(passwordStrength(password)); }, [password]);
  useEffect(() => { dispatch(clearError()); }, [dispatch]);

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) { toast.error('Passwords do not match!'); return; }
    const result = await dispatch(registerUser({ name: data.name, email: data.email, mobile: data.mobile, password: data.password, role: 'CUSTOMER' }));
    if (registerUser.fulfilled.match(result)) { toast.success('Account created successfully. Please login.'); navigate('/login'); }
  };

  const requirements = [
    { test: password.length >= 8,           label: 'At least 8 chars' },
    { test: /[A-Z]/.test(password),         label: 'Uppercase letter' },
    { test: /[0-9]/.test(password),         label: 'One number' },
    { test: /[^A-Za-z0-9]/.test(password),  label: 'Special character' },
  ];

  return (
    <div className="min-h-screen bg-hero-gradient px-4 py-10 overflow-hidden">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
        <div className="hidden lg:block animate-slide-up">
          <AuthShowcase />
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="mb-7">
              <Link to="/" className="inline-flex items-center gap-2.5">
                <div className="w-12 h-12 rounded-2xl bg-gold-gradient flex items-center justify-center shadow-glow transition-transform duration-300 hover:scale-[1.03]">
                  <BookMarked className="w-6 h-6 text-navy-700" />
                </div>
                <span className="font-heading font-bold text-2xl text-dark-text">Book<span className="text-gradient">Nest</span></span>
              </Link>
              <p className="text-dark-muted mt-2 text-sm">Create your free account</p>
            </div>

            <div className="card p-8 shadow-card-hover animate-slide-up ring-gradient">
              <div className="flex items-center gap-2 mb-5 p-3 rounded-xl bg-primary-500/10 border border-primary-500/20">
                <User className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <p className="text-xs text-primary-300">
                  Customer registration only. Admin accounts are managed by the system.
                </p>
              </div>

              {authError && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-5">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-400">{authError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="animate-fade-in">
              <label className="input-label">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                <input type="text" placeholder="John Doe" className={`input pl-10 ${errors.name ? 'input-error' : ''}`}
                  {...register('name', { required: 'Full name is required', minLength: { value: 2, message: 'Name too short' } })} />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div className="animate-fade-in">
              <label className="input-label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                <input type="email" placeholder="you@example.com" className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                  {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' } })} />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div className="animate-fade-in">
              <label className="input-label">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                <input type="tel" placeholder="9876543210" className={`input pl-10 ${errors.mobile ? 'input-error' : ''}`}
                  {...register('mobile', { required: 'Mobile is required', pattern: { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit number' } })} />
              </div>
              {errors.mobile && <p className="text-red-400 text-xs mt-1">{errors.mobile.message}</p>}
            </div>

            <div className="animate-fade-in">
              <label className="input-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                <input type={showPass ? 'text' : 'password'} placeholder="Create a strong password"
                  className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                  {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })} />
                <button type="button" onClick={() => setShowPass((p) => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-muted hover:text-dark-text transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
              {password && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < passStr.score ? passStr.color : 'bg-dark-border'}`} />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${passStr.score >= 3 ? 'text-green-400' : passStr.score >= 2 ? 'text-yellow-400' : 'text-red-400'}`}>{passStr.label}</p>
                  <div className="grid grid-cols-2 gap-1">
                    {requirements.map(({ test, label }) => (
                      <div key={label} className={`flex items-center gap-1.5 text-xs ${test ? 'text-green-400' : 'text-dark-muted'}`}>
                        <CheckCircle className={`w-3 h-3 ${test ? 'opacity-100' : 'opacity-30'}`} />{label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="animate-fade-in">
              <label className="input-label">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                <input type={showConfirm ? 'text' : 'password'} placeholder="Repeat your password"
                  className={`input pl-10 pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                  {...register('confirmPassword', { required: 'Please confirm password', validate: (val) => val === password || 'Passwords do not match' })} />
                <button type="button" onClick={() => setShowConfirm((p) => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-muted hover:text-dark-text transition-colors">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3 mt-2">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-navy-700/40 border-t-navy-700 rounded-full animate-spin" />
                  Creating...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-dark-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 font-semibold hover:text-primary-300 transition-colors">
                Sign in
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

export default RegisterPage;
