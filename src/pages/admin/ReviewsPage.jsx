import { useEffect, useState } from 'react';
import { Star, Trash2, Search } from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import { PageLoader } from '../../components/Loader';
import RatingStars from '../../components/RatingStars';
import { formatDate, initials } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  const load = () => {
    setLoading(true);
    reviewService.getAllReviews()
      .then((r) => setReviews(r.data || []))
      .catch(() => toast.error('Failed to load reviews'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try { await reviewService.deleteReview(id); toast.success('Review deleted'); load(); }
    catch { toast.error('Failed to delete review'); }
  };

  const filtered = reviews.filter((r) =>
    r.userName?.toLowerCase().includes(search.toLowerCase()) ||
    r.comment?.toLowerCase().includes(search.toLowerCase())
  );

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 0;

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="page-header">Manage Reviews</h1>
          <p className="page-sub">{reviews.length} reviews · Avg rating: {avg} ★</p>
        </div>
      </div>

      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search reviews..." className="input pl-10" />
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="card p-10 text-center text-dark-muted">No reviews found</div>
        ) : filtered.map((rev) => (
          <div key={rev.id} className="card p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 font-semibold text-sm flex-shrink-0">
                  {initials(rev.userName || 'U')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-semibold text-dark-text text-sm">{rev.userName || 'Anonymous'}</p>
                    <RatingStars rating={rev.rating} size="xs" />
                    <span className="text-xs text-dark-muted">{formatDate(rev.createdAt)}</span>
                  </div>
                  {rev.comment && <p className="text-sm text-dark-muted leading-relaxed">{rev.comment}</p>}
                  {rev.productTitle && (
                    <p className="text-xs text-primary-500/70 mt-1">📚 {rev.productTitle}</p>
                  )}
                </div>
              </div>
              <button onClick={() => handleDelete(rev.id)}
                className="p-1.5 rounded-lg text-dark-muted hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsPage;
