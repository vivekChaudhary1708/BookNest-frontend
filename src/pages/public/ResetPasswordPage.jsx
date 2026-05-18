import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Lock, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { resetPassword } from '../../redux/slices/authSlice';
import AuthShowcase from '../../components/AuthShowcase';

const ResetPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const otp = location.state?.otp;

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (!email || !otp) {
      toast.error('Session expired. Please request OTP again.');
      navigate('/forgot-password');
    }
  }, [email, otp, navigate]);

  const onResetSubmit = async (data) => {
    setIsLoading(true);
    const resultAction = await dispatch(resetPassword({
      email,
      otp,
      newPassword: data.newPassword
    }));
    setIsLoading(false);

    if (resetPassword.fulfilled.match(resultAction)) {
      toast.success('Password reset successfully! You can now login.');
      navigate('/login');
    } else {
      toast.error(resultAction.payload || 'Failed to reset password');
    }
  };

  if (!email || !otp) return null;

  return (
    <div className="min-h-screen bg-hero-gradient px-4 py-10 overflow-hidden">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
        <div className="hidden lg:block animate-slide-up">
          <AuthShowcase />
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="mb-7">
              <Link to="/login" className="inline-flex items-center gap-2 text-dark-muted hover:text-primary-400 transition-colors mb-4">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Cancel</span>
              </Link>
              <h1 className="font-heading font-bold text-3xl text-dark-text">
                Set New Password
              </h1>
              <p className="text-dark-muted mt-2 text-sm">
                Enter your new secure password below.
              </p>
            </div>

            <div className="card p-8 shadow-card-hover animate-slide-up ring-gradient">
              <form onSubmit={handleSubmit(onResetSubmit)} className="space-y-5">
                <div className="animate-fade-in">
                  <label className="input-label">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className={`input pl-10 ${errors.newPassword ? 'input-error' : ''}`}
                      {...register('newPassword', {
                        required: 'New Password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters' }
                      })}
                    />
                  </div>
                  {errors.newPassword && <p className="text-red-400 text-xs mt-1">{errors.newPassword.message}</p>}
                </div>

                <button type="submit" disabled={isLoading} className="btn-primary w-full py-3">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-navy-700/40 border-t-navy-700 rounded-full animate-spin" />
                      Resetting...
                    </span>
                  ) : 'Reset Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
