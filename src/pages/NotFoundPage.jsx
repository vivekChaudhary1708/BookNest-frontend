import { Link } from 'react-router-dom';
import { BookX } from 'lucide-react';

const NotFoundPage = () => (
  <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
    <div className="text-center max-w-md">
      <div className="w-24 h-24 rounded-3xl bg-dark-card flex items-center justify-center mx-auto mb-6 border border-dark-border">
        <BookX className="w-12 h-12 text-dark-muted" />
      </div>
      <h1 className="font-heading text-7xl font-bold text-gradient mb-2">404</h1>
      <h2 className="font-heading text-2xl font-bold text-dark-text mb-3">Page Not Found</h2>
      <p className="text-dark-muted mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <div className="flex gap-3 justify-center">
        <Link to="/"     className="btn-primary">Go Home</Link>
        <Link to="/books" className="btn-outline">Browse Books</Link>
      </div>
    </div>
  </div>
);

export default NotFoundPage;
