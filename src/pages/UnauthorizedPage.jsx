import { Link } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';

const UnauthorizedPage = () => (
  <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
    <div className="text-center max-w-md">
      <div className="w-24 h-24 rounded-3xl bg-red-500/20 flex items-center justify-center mx-auto mb-6">
        <ShieldOff className="w-12 h-12 text-red-400" />
      </div>
      <h1 className="font-heading text-4xl font-bold text-dark-text mb-3">Access Denied</h1>
      <p className="text-dark-muted mb-2">You don't have permission to access this page.</p>
      <p className="text-dark-muted text-sm mb-8">If you're trying to access the admin panel, please use an admin account.</p>
      <div className="flex gap-3 justify-center">
        <Link to="/"      className="btn-primary">Go Home</Link>
        <Link to="/login" className="btn-outline">Login Again</Link>
      </div>
    </div>
  </div>
);

export default UnauthorizedPage;
