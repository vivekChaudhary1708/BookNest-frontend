import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Heart, Zap, ArrowLeft, Package, Tag } from 'lucide-react';
import { fetchProductById, selectCurrentBook, selectBooksLoading, fetchProducts, selectBooks } from '../../redux/slices/bookSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist, selectInWishlist } from '../../redux/slices/wishlistSlice';
import { selectIsAuth } from '../../redux/slices/authSlice';
import { selectUser } from '../../redux/slices/authSlice';
import { reviewService } from '../../services/reviewService';
import RatingStars from '../../components/RatingStars';
import BookCard from '../../components/BookCard';
import { PageLoader } from '../../components/Loader';
import { formatPrice, discountPercent, stockLabel, formatDate, initials } from '../../utils/helpers';
import toast from 'react-hot-toast';

const BookDetailPage = () => {
  const { id }      = useParams();
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const book        = useSelector(selectCurrentBook);
  const isLoading   = useSelector(selectBooksLoading);
  const isAuth      = useSelector(selectIsAuth);
  const user        = useSelector(selectUser);
  const inWishlist  = useSelector(selectInWishlist(id));
  const related     = useSelector(selectBooks).filter((b) => b.id !== id).slice(0, 4);

  const [reviews, setReviews]     = useState([]);
  const [myRating, setMyRating]   = useState(0);
  const [reviewText, setRevText]  = useState('');
  const [submitting, setSubmit]   = useState(false);
  const [qty, setQty]             = useState(1);
  const [cartBusy, setCartBusy]   = useState(false);

  useEffect(() => { dispatch(fetchProductById(id)); dispatch(fetchProducts({})); }, [id, dispatch]);

  useEffect(() => {
    reviewService.getByProduct(id).then((r) => setReviews(r.data || [])).catch(() => {});
  }, [id]);

  if (isLoading) return <PageLoader />;
  if (!book) return <div className="text-center py-20 text-dark-muted">Book not found.</div>;

  const { title, author, imageUrl, price, discountPrice, description, isbn, category, stockQuantity = 0 } = book;
  const stock    = stockLabel(stockQuantity);
  const discount = discountPercent(price, discountPrice || price);
  const final    = discountPrice || price;

  const dynamicRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / reviews.length 
    : 0;

  const handleCart = async () => {
    if (!isAuth) { navigate('/login'); return; }
    setCartBusy(true);
    await dispatch(addToCart({ productId: id, quantity: qty }));
    setCartBusy(false);
  };

  const handleWishlist = () => {
    if (!isAuth) { navigate('/login'); return; }
    inWishlist ? dispatch(removeFromWishlist(id)) : dispatch(addToWishlist(id));
  };

  const handleBuyNow = async () => {
    if (!isAuth) { navigate('/login'); return; }
    setCartBusy(true);
    const result = await dispatch(addToCart({ productId: id, quantity: qty }));
    setCartBusy(false);
    if (addToCart.fulfilled.match(result)) {
      navigate('/checkout');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuth) { navigate('/login'); return; }
    if (!myRating) { toast.error('Please select a rating'); return; }
    setSubmit(true);
    try {
      await reviewService.addReview({
        productId: id,
        rating: myRating,
        comment: reviewText,
        userId: user?.id || user?._id,
        userName: user?.name || 'Reader',
      });
      toast.success('Review submitted!');
      setMyRating(0); setRevText('');
      const r = await reviewService.getByProduct(id);
      setReviews(r.data || []);
    } catch { toast.error('Could not submit review'); }
    finally { setSubmit(false); }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await reviewService.deleteReview(reviewId);
      toast.success('Review deleted');
      const r = await reviewService.getByProduct(id);
      setReviews(r.data || []);
      dispatch(fetchProductById(id));
      dispatch(fetchProducts({}));
    } catch {
      toast.error('Could not delete review');
    }
  };

  return (
    <div className="bg-dark-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate(-1)} className="btn-ghost btn-sm mb-6 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Main detail */}
        <div className="grid lg:grid-cols-2 gap-10 mb-12">
          {/* Image */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-72 sm:w-80">
              <img src={imageUrl || `https://placehold.co/320x440/1E293B/F59E0B?text=${encodeURIComponent(title?.charAt(0)||'B')}`}
                alt={title}
                onError={(e) => { e.target.src = `https://placehold.co/320x440/1E293B/F59E0B?text=B`; }}
                className="w-full rounded-2xl shadow-card-hover" />
              {discount > 0 && <span className="absolute top-3 left-3 badge-red badge text-sm">-{discount}% OFF</span>}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-5">
            {category && <span className="badge-gold badge">{category}</span>}
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-dark-text">{title}</h1>
            <p className="text-dark-muted text-base">by <span className="text-primary-400 font-semibold">{author}</span></p>

            <div className="flex items-center gap-2">
              <RatingStars rating={dynamicRating} size="md" />
              <span className="text-sm font-bold text-dark-text ml-1">{dynamicRating > 0 ? dynamicRating.toFixed(1) : '0'} <span className="text-dark-muted font-normal">/ 5</span></span>
              <span className="text-sm text-dark-muted ml-1">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary-400">{formatPrice(final)}</span>
              {discount > 0 && <span className="text-xl text-dark-muted line-through">{formatPrice(price)}</span>}
              {discount > 0 && <span className="badge-green badge">Save {formatPrice(price - final)}</span>}
            </div>

            <div className="flex items-center gap-3 text-sm">
              <span className={`badge ${stock.cls}`}>{stock.text}</span>
              {isbn && <span className="text-dark-muted flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> ISBN: {isbn}</span>}
            </div>

            {description && <p className="text-dark-muted leading-relaxed text-sm border-t border-dark-border pt-4">{description}</p>}

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-dark-muted">Qty:</span>
              <div className="flex items-center border border-dark-border rounded-xl overflow-hidden">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2 text-dark-muted hover:text-dark-text hover:bg-dark-border transition-all">−</button>
                <span className="px-4 py-2 text-dark-text font-semibold text-sm border-x border-dark-border">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(stockQuantity, q + 1))} className="px-3 py-2 text-dark-muted hover:text-dark-text hover:bg-dark-border transition-all">+</button>
              </div>
              <span className="flex items-center gap-1 text-xs text-dark-muted"><Package className="w-3.5 h-3.5" />{stockQuantity} in stock</span>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button onClick={handleCart} disabled={stockQuantity <= 0 || cartBusy} className="btn-primary flex-1 py-3 min-w-36">
                <ShoppingCart className="w-4 h-4" /> {cartBusy ? 'Adding...' : 'Add to Cart'}
              </button>
              <button onClick={handleBuyNow} disabled={stockQuantity <= 0 || cartBusy} className="btn-outline flex-1 py-3 min-w-36">
                <Zap className="w-4 h-4" /> {cartBusy ? 'Please wait...' : 'Buy Now'}
              </button>
              <button onClick={handleWishlist}
                className={`p-3 rounded-xl border transition-all ${inWishlist ? 'border-red-500 text-red-400 bg-red-500/10' : 'border-dark-border text-dark-muted hover:border-red-500 hover:text-red-400'}`}>
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Add review */}
          <div className="card p-6">
            <h3 className="font-heading text-lg font-bold text-dark-text mb-4">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <p className="text-sm text-dark-muted mb-2">Your Rating</p>
                <RatingStars rating={myRating} size="lg" interactive onRate={setMyRating} />
              </div>
              <textarea value={reviewText} onChange={(e) => setRevText(e.target.value)}
                placeholder="Share your thoughts about this book..."
                rows={4} className="input resize-none" />
              <button type="submit" disabled={submitting || !isAuth} className="btn-primary w-full">
                {submitting ? 'Submitting...' : isAuth ? 'Submit Review' : 'Login to Review'}
              </button>
            </form>
          </div>

          {/* Reviews list */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-heading text-lg font-bold text-dark-text">Customer Reviews ({reviews.length})</h3>
            {reviews.length === 0 ? (
              <div className="card p-6 text-center text-dark-muted text-sm">No reviews yet. Be the first!</div>
            ) : (
              reviews.map((rev, i) => (
                <div key={i} className="card p-4 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 font-semibold text-sm">
                        {initials(rev.userName || 'U')}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-dark-text">{rev.userName || 'Anonymous'}</p>
                        <p className="text-xs text-dark-muted">{formatDate(rev.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <RatingStars rating={rev.rating} size="sm" />
                      {(user?.id === rev.userId || user?._id === rev.userId) && (
                        <button onClick={() => handleDeleteReview(rev.id || rev._id)} className="text-xs text-red-500 hover:text-red-600 transition-colors mt-1">
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                  {rev.comment && <p className="text-sm text-dark-muted">{rev.comment}</p>}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Related books */}
        {related.length > 0 && (
          <div>
            <h3 className="font-heading text-2xl font-bold text-dark-text mb-6">Related Books</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((b) => <BookCard key={b.id} book={b} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetailPage;
