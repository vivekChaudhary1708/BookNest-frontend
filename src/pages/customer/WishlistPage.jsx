import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingCart, Trash2, Zap } from 'lucide-react';
import { fetchWishlist, removeFromWishlist, selectWishlistItems } from '../../redux/slices/wishlistSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import { selectBooks } from '../../redux/slices/bookSlice';
import { PageLoader } from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { formatPrice, discountPercent } from '../../utils/helpers';
import RatingStars from '../../components/RatingStars';

const WishlistPage = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const items     = useSelector(selectWishlistItems);
  const allBooks  = useSelector(selectBooks);
  const isLoading = useSelector((s) => s.wishlist.isLoading);

  useEffect(() => { dispatch(fetchWishlist()); }, [dispatch]);

  if (isLoading && items.length === 0) return <PageLoader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-header">My Wishlist</h1>
          <p className="page-sub">{items.length} saved {items.length === 1 ? 'book' : 'books'}</p>
        </div>
        <Link to="/books" className="btn-ghost btn-sm">← Browse More</Link>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save books you love to revisit and buy them later."
          action={<Link to="/books" className="btn-primary">Explore Books</Link>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((item) => {
            const pid      = item.productId || item.id;
            const rowId    = item.id || pid;
            const bookDetails = allBooks.find(b => b.id === pid) || {};
            const final    = item.discountPrice || item.price || 0;
            const disc     = discountPercent(item.price, final);
            return (
              <div key={pid} className="card-hover overflow-hidden flex flex-col">
                <Link to={`/books/${pid}`} className="relative aspect-[3/4] overflow-hidden bg-dark-border/30">
                  <img
                    src={bookDetails.imageUrl || item.imageUrl || `https://placehold.co/200x280/1E293B/F59E0B?text=B`}
                    alt={bookDetails.title || item.title}
                    onError={(e) => { e.target.src = `https://placehold.co/200x280/1E293B/F59E0B?text=B`; }}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  {disc > 0 && <span className="absolute top-2 left-2 badge-red badge text-[10px]">-{disc}%</span>}
                </Link>
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <Link to={`/books/${pid}`} className="font-semibold text-dark-text text-sm hover:text-primary-400 transition-colors line-clamp-2">
                    {bookDetails.title || item.title}
                  </Link>
                  <p className="text-xs text-dark-muted">{bookDetails.author || item.author}</p>
                  <RatingStars rating={bookDetails.averageRating || item.averageRating || 0} size="xs" />
                  <div className="flex items-center gap-2">
                    <span className="text-primary-400 font-bold">{formatPrice(final)}</span>
                    {disc > 0 && <span className="text-xs text-dark-muted line-through">{formatPrice(item.price)}</span>}
                  </div>
                  <div className="flex gap-2 mt-auto pt-2">
                    <button
                      onClick={() => { 
                        dispatch(addToCart({ productId: pid, quantity: 1 })); 
                        dispatch(removeFromWishlist(rowId));
                        navigate('/cart'); 
                      }}
                      className="btn-primary btn-sm flex-1 justify-center"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> Cart
                    </button>
                    <button
                      onClick={() => dispatch(removeFromWishlist(rowId))}
                      className="p-1.5 rounded-xl border border-dark-border text-dark-muted hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
