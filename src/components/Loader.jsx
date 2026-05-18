import { BookOpen } from 'lucide-react';

const Loader = ({ size = 'md', text = '' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div className={`${sizes[size]} border-3 border-dark-border border-t-primary-500 rounded-full animate-spin`}
           style={{ borderWidth: '3px' }} />
      {text && <p className="text-sm text-dark-muted animate-pulse">{text}</p>}
    </div>
  );
};

export const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-dark-border border-t-primary-500 rounded-full animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <BookOpen className="w-6 h-6 text-primary-500" />
      </div>
    </div>
    <p className="text-dark-muted text-sm font-medium animate-pulse">Loading...</p>
  </div>
);

export default Loader;
