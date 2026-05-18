import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  const left  = Math.max(0, currentPage - delta);
  const right = Math.min(totalPages - 1, currentPage + delta);

  for (let i = left; i <= right; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="p-2 rounded-xl border border-dark-border text-dark-muted hover:border-primary-500 hover:text-primary-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {left > 0 && (
        <>
          <button onClick={() => onPageChange(0)} className="w-9 h-9 rounded-xl border border-dark-border text-dark-muted hover:border-primary-500 hover:text-primary-400 text-sm transition-all">1</button>
          {left > 1 && <span className="text-dark-muted px-1">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 rounded-xl border text-sm font-medium transition-all ${
            p === currentPage
              ? 'border-primary-500 bg-primary-500 text-navy-700 shadow-glow'
              : 'border-dark-border text-dark-muted hover:border-primary-500 hover:text-primary-400'
          }`}
        >
          {p + 1}
        </button>
      ))}

      {right < totalPages - 1 && (
        <>
          {right < totalPages - 2 && <span className="text-dark-muted px-1">…</span>}
          <button onClick={() => onPageChange(totalPages - 1)} className="w-9 h-9 rounded-xl border border-dark-border text-dark-muted hover:border-primary-500 hover:text-primary-400 text-sm transition-all">{totalPages}</button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        className="p-2 rounded-xl border border-dark-border text-dark-muted hover:border-primary-500 hover:text-primary-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
