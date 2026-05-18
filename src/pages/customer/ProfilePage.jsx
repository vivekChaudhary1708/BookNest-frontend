import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, Lock, LogOut, Edit3, Save, X, Eye, EyeOff } from 'lucide-react';
import { logout, selectUser, updateProfile } from '../../redux/slices/authSlice';
import { clearCartLocal } from '../../redux/slices/cartSlice';
import { clearWishlistLocal } from '../../redux/slices/wishlistSlice';
import { authService } from '../../services/authService';
import { initials } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const user      = useSelector(selectUser);
  const [editing, setEditing]     = useState(false);
  const [changePwd, setChangePwd] = useState(false);
  const [showOld, setShowOld]     = useState(false);
  const [showNew, setShowNew]     = useState(false);

  const { register: regProfile, handleSubmit: submitProfile, reset: resetProfile, formState: { errors: errP } } = useForm({
    defaultValues: { name: user?.name || '', mobile: user?.mobile || '' },
  });
  const { register: regPwd, handleSubmit: submitPwd, reset: resetPwd, formState: { errors: errPwd } } = useForm();

  const handleLogout = () => {
    dispatch(logout()); dispatch(clearCartLocal()); dispatch(clearWishlistLocal()); navigate('/');
  };

  const onSaveProfile = async (data) => {
    const result = await dispatch(updateProfile(data));
    if (updateProfile.fulfilled.match(result)) { toast.success('Profile updated!'); setEditing(false); }
  };

  const onChangePwd = async (data) => {
    if (data.newPassword !== data.confirm) { toast.error('Passwords do not match'); return; }
    try {
      await authService.changePassword({ oldPassword: data.oldPassword, newPassword: data.newPassword });
      toast.success('Password changed successfully!');
      resetPwd(); setChangePwd(false);
    } catch { toast.error('Failed to change password. Check your old password.'); }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="page-header mb-2">My Profile</h1>
      <p className="page-sub mb-8">Manage your account information</p>

      {/* Avatar + basic info */}
      <div className="card p-6 mb-5">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-primary-500 flex items-center justify-center text-navy-700 font-bold text-2xl font-heading">
            {initials(user?.name || 'U')}
          </div>
          <div>
            <h2 className="text-xl font-bold text-dark-text">{user?.name}</h2>
            <p className="text-dark-muted text-sm">{user?.email}</p>
            <span className="badge badge-gold mt-1">{user?.role || 'CUSTOMER'}</span>
          </div>
        </div>

        {!editing ? (
          <>
            <div className="space-y-4">
              {[
                { icon: User,  label: 'Full Name', value: user?.name },
                { icon: Mail,  label: 'Email',     value: user?.email },
                { icon: Phone, label: 'Mobile',    value: user?.mobile || '—' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4 p-3 bg-dark-bg rounded-xl">
                  <Icon className="w-4 h-4 text-primary-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-dark-muted">{label}</p>
                    <p className="text-sm font-medium text-dark-text">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setEditing(true)} className="btn-outline btn-sm mt-5 flex items-center gap-2">
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          </>
        ) : (
          <form onSubmit={submitProfile(onSaveProfile)} className="space-y-4">
            <div>
              <label className="input-label">Full Name</label>
              <input className={`input ${errP.name ? 'input-error' : ''}`}
                {...regProfile('name', { required: 'Name is required' })} />
              {errP.name && <p className="text-red-400 text-xs mt-1">{errP.name.message}</p>}
            </div>
            <div>
              <label className="input-label">Mobile</label>
              <input className={`input ${errP.mobile ? 'input-error' : ''}`}
                {...regProfile('mobile', { pattern: { value: /^[6-9]\d{9}$/, message: 'Invalid mobile' } })} />
              {errP.mobile && <p className="text-red-400 text-xs mt-1">{errP.mobile.message}</p>}
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary btn-sm flex items-center gap-2"><Save className="w-4 h-4" />Save</button>
              <button type="button" onClick={() => { setEditing(false); resetProfile(); }} className="btn-ghost btn-sm flex items-center gap-2"><X className="w-4 h-4" />Cancel</button>
            </div>
          </form>
        )}
      </div>

      {/* Change password */}
      <div className="card p-6 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-dark-text flex items-center gap-2"><Lock className="w-4 h-4 text-primary-500" />Change Password</h3>
          <button onClick={() => setChangePwd((p) => !p)} className="btn-ghost btn-sm">{changePwd ? 'Cancel' : 'Change'}</button>
        </div>
        {changePwd && (
          <form onSubmit={submitPwd(onChangePwd)} className="space-y-4">
            <div>
              <label className="input-label">Current Password</label>
              <div className="relative">
                <input type={showOld ? 'text' : 'password'} className={`input pr-10 ${errPwd.oldPassword ? 'input-error' : ''}`}
                  {...regPwd('oldPassword', { required: 'Current password required' })} />
                <button type="button" onClick={() => setShowOld((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-muted">
                  {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="input-label">New Password</label>
              <div className="relative">
                <input type={showNew ? 'text' : 'password'} className={`input pr-10 ${errPwd.newPassword ? 'input-error' : ''}`}
                  {...regPwd('newPassword', { required: 'New password required', minLength: { value: 8, message: 'Min 8 chars' } })} />
                <button type="button" onClick={() => setShowNew((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-muted">
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="input-label">Confirm New Password</label>
              <input type="password" className={`input ${errPwd.confirm ? 'input-error' : ''}`}
                {...regPwd('confirm', { required: 'Please confirm new password' })} />
            </div>
            <button type="submit" className="btn-primary btn-sm">Update Password</button>
          </form>
        )}
      </div>

      {/* Logout */}
      <button onClick={handleLogout} className="btn-danger w-full py-3 flex items-center justify-center gap-2">
        <LogOut className="w-4 h-4" /> Logout
      </button>
    </div>
  );
};

export default ProfilePage;
