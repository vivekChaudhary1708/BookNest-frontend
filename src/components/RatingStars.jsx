import { Star } from 'lucide-react';

const RatingStars = ({ rating = 0, max = 5, size = 'sm', showCount = false, count = 0, interactive = false, onRate }) => {
  const sizeMap = { xs: 'w-3 h-3', sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };
  const iconCls = sizeMap[size] || sizeMap.sm;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.floor(rating);
        const half   = !filled && i < rating;
        return (
          <button
            key={i}
            type={interactive ? 'button' : undefined}
            onClick={interactive && onRate ? () => onRate(i + 1) : undefined}
            className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
            aria-label={interactive ? `Rate ${i + 1}` : undefined}
          >
            <Star
              className={`${iconCls} transition-colors ${
                filled ? 'fill-primary-500 text-primary-500'
                : half  ? 'fill-primary-500/50 text-primary-500'
                :         'fill-dark-border text-dark-border'
              }`}
            />
          </button>
        );
      })}
      {showCount && (
        <span className="text-xs text-dark-muted ml-1">({count})</span>
      )}
    </div>
  );
};

export default RatingStars;
