import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { addToCart } from '../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist, selectInWishlist } from '../redux/slices/wishlistSlice';
import { selectIsAuth } from '../redux/slices/authSlice';
import { formatPrice, discountPercent, stockLabel, truncate } from '../utils/helpers';
import RatingStars from './RatingStars';
import { useNavigate } from 'react-router-dom';

const BookCard = ({ book }) => {
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const isAuth      = useSelector(selectIsAuth);
  const inWishlist  = useSelector(selectInWishlist(book?.id));

  if (!book) return null;

  const {
    id, title, author, imageUrl, price, discountPrice,
    averageRating = 0, reviewCount = 0, stockQuantity = 0, category,
  } = book;

  const stock    = stockLabel(stockQuantity);
  const discount = discountPercent(price, discountPrice || price);
  const finalPrice = discountPrice || price;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!isAuth) { navigate('/login'); return; }
    dispatch(addToCart({ productId: id, quantity: 1 }));
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!isAuth) { navigate('/login'); return; }
    inWishlist ? dispatch(removeFromWishlist(id)) : dispatch(addToWishlist(id));
  };

  return (
    <Link to={`/books/${id}`} className="group relative card-hover overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-dark-border/30">
        <img
          src={imageUrl || `https://covers.openlibrary.org/b/isbn/placeholder-L.jpg`}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = `https://placehold.co/300x400/1E293B/F59E0B?text=${encodeURIComponent(title?.charAt(0) || 'B')}`;
          }}
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <span className="badge-red badge text-[10px]">-{discount}%</span>
          )}
          <span className={`badge text-[10px] ${stock.cls}`}>{stock.text}</span>
        </div>

        {/* Hover actions */}
        <div className="absolute inset-0 bg-dark-bg/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={handleWishlist}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
              inWishlist ? 'bg-red-500 text-dark-text' : 'bg-dark-card/90 text-dark-muted hover:text-red-400'
            }`}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleAddToCart}
            disabled={stockQuantity <= 0}
            className="w-10 h-10 rounded-full bg-primary-500 text-navy-700 flex items-center justify-center hover:bg-primary-400 hover:scale-110 transition-all disabled:opacity-50"
            title="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
          <div className="w-10 h-10 rounded-full bg-dark-card/90 text-dark-muted flex items-center justify-center hover:text-dark-text hover:scale-110 transition-all" title="Quick view">
            <Eye className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        {category && (
          <span className="text-[10px] font-semibold text-primary-500 uppercase tracking-wider">{category}</span>
        )}
        <h3 className="font-semibold text-dark-text text-sm line-clamp-2 group-hover:text-primary-400 transition-colors leading-snug">
          {title}
        </h3>
        <p className="text-xs text-dark-muted">{truncate(author, 30)}</p>
        <p className="text-[11px] text-dark-muted">Available: {stockQuantity}</p>

        <div className="flex items-center gap-1 mt-0.5">
          <RatingStars rating={averageRating} size="xs" />
          <span className="text-[10px] font-bold text-dark-text ml-0.5">{averageRating > 0 ? averageRating.toFixed(1) : '0'} <span className="font-normal text-dark-muted">/ 5</span></span>
          <span className="text-[10px] text-dark-muted ml-0.5">({reviewCount})</span>
        </div>

        <div className="flex items-center gap-2 mt-auto pt-2">
          <span className="font-bold text-primary-400 text-base">{formatPrice(finalPrice)}</span>
          {discount > 0 && (
            <span className="text-xs text-dark-muted line-through">{formatPrice(price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
