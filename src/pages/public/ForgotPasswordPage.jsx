import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Mail, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { forgotPassword } from '../../redux/slices/authSlice';
import AuthShowcase from '../../components/AuthShowcase';

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onEmailSubmit = async (data) => {
    setIsLoading(true);
    const resultAction = await dispatch(forgotPassword(data.email));
    setIsLoading(false);
    
    if (forgotPassword.fulfilled.match(resultAction)) {
      toast.success('OTP sent to your email!');
      // Navigate to verify-otp and pass email in state
      navigate('/verify-otp', { state: { email: data.email } });
    } else {
      toast.error(resultAction.payload || 'Failed to send OTP');
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
            <div className="mb-7">
              <Link to="/login" className="inline-flex items-center gap-2 text-dark-muted hover:text-primary-400 transition-colors mb-4">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to login</span>
              </Link>
              <h1 className="font-heading font-bold text-3xl text-dark-text">
                Forgot Password?
              </h1>
              <p className="text-dark-muted mt-2 text-sm">
                Enter your email address and we will send you an OTP to reset your password.
              </p>
            </div>

            <div className="card p-8 shadow-card-hover animate-slide-up ring-gradient">
              <form onSubmit={handleSubmit(onEmailSubmit)} className="space-y-5">
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

                <button type="submit" disabled={isLoading} className="btn-primary w-full py-3">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-navy-700/40 border-t-navy-700 rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : 'Send OTP'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
