import { BookOpen } from 'lucide-react';

const EmptyState = ({ title = 'Nothing here yet', description = '', action = null, icon: Icon = BookOpen }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center px-4">
    <div className="w-20 h-20 rounded-2xl bg-dark-border/30 flex items-center justify-center mb-4">
      <Icon className="w-10 h-10 text-dark-muted" />
    </div>
    <h3 className="text-lg font-semibold text-dark-text mb-2">{title}</h3>
    {description && <p className="text-sm text-dark-muted max-w-sm mb-6">{description}</p>}
    {action}
  </div>
);

export default EmptyState;
