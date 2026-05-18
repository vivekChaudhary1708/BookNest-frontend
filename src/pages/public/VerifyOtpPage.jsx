import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Key, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { verifyOtp } from '../../redux/slices/authSlice';
import AuthShowcase from '../../components/AuthShowcase';

const VerifyOtpPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (!email) {
      toast.error('Session expired. Please request OTP again.');
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const onVerifySubmit = async (data) => {
    setIsLoading(true);
    const resultAction = await dispatch(verifyOtp({ email, otp: data.otp }));
    setIsLoading(false);

    if (verifyOtp.fulfilled.match(resultAction)) {
      toast.success('OTP Verified!');
      navigate('/reset-password', { state: { email, otp: data.otp } });
    } else {
      toast.error(resultAction.payload || 'Invalid OTP');
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen bg-hero-gradient px-4 py-10 overflow-hidden">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
        <div className="hidden lg:block animate-slide-up">
          <AuthShowcase />
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="mb-7">
              <Link to="/forgot-password" className="inline-flex items-center gap-2 text-dark-muted hover:text-primary-400 transition-colors mb-4">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back</span>
              </Link>
              <h1 className="font-heading font-bold text-3xl text-dark-text">
                Verify OTP
              </h1>
              <p className="text-dark-muted mt-2 text-sm">
                Enter the 6-digit OTP sent to {email}.
              </p>
            </div>

            <div className="card p-8 shadow-card-hover animate-slide-up ring-gradient">
              <form onSubmit={handleSubmit(onVerifySubmit)} className="space-y-5">
                <div className="animate-fade-in">
                  <label className="input-label">OTP</label>
                  <div className="relative">
                    <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      className={`input pl-10 ${errors.otp ? 'input-error' : ''}`}
                      {...register('otp', {
                        required: 'OTP is required',
                        minLength: { value: 6, message: 'OTP must be 6 digits' },
                        maxLength: { value: 6, message: 'OTP must be 6 digits' }
                      })}
                    />
                  </div>
                  {errors.otp && <p className="text-red-400 text-xs mt-1">{errors.otp.message}</p>}
                </div>

                <button type="submit" disabled={isLoading} className="btn-primary w-full py-3">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-navy-700/40 border-t-navy-700 rounded-full animate-spin" />
                      Verifying...
                    </span>
                  ) : 'Verify OTP'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
