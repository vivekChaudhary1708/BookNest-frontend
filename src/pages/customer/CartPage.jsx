import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { selectCartItems, selectCartTotal, removeFromCart, updateCartItem, fetchCart } from '../../redux/slices/cartSlice';
import { selectBooks } from '../../redux/slices/bookSlice';
import { PageLoader } from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { formatPrice } from '../../utils/helpers';

const DELIVERY_CHARGE = 49;
const FREE_DELIVERY_ABOVE = 500;

const CartPage = () => {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const items      = useSelector(selectCartItems);
  const allBooks   = useSelector(selectBooks);
  const subtotal   = useSelector(selectCartTotal);
  const isLoading  = useSelector((s) => s.cart.isLoading);

  useEffect(() => { dispatch(fetchCart()); }, [dispatch]);

  const delivery = subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_CHARGE;
  const total    = subtotal + delivery;

  if (isLoading && items.length === 0) return <PageLoader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-header">My Cart</h1>
          <p className="page-sub">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
        </div>
        <Link to="/books" className="btn-ghost btn-sm flex items-center gap-2">
          ← Continue Shopping
        </Link>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added any books yet. Browse our collection and find your next great read!"
          action={<Link to="/books" className="btn-primary">Browse Books</Link>}
        />
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const pid   = item.productId || item.id;
              const rowId = item.id || pid;
              const bookDetails = allBooks.find(b => b.id === pid) || {};
              const price = item.discountPrice || item.price || 0;
              return (
                <div key={pid} className="card p-4 flex gap-4">
                  <img
                    src={bookDetails.imageUrl || item.imageUrl || `https://placehold.co/80x110/1E293B/F59E0B?text=B`}
                    alt={bookDetails.title || item.title}
                    onError={(e) => { e.target.src = `https://placehold.co/80x110/1E293B/F59E0B?text=B`; }}
                    className="w-20 h-28 object-cover rounded-xl flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <Link to={`/books/${pid}`} className="font-semibold text-dark-text hover:text-primary-400 transition-colors line-clamp-2 text-sm">
                      {item.title}
                    </Link>
                    <p className="text-xs text-dark-muted mt-1">{item.author}</p>
                    <p className="text-primary-400 font-bold mt-2">{formatPrice(price)}</p>

                    <div className="flex items-center justify-between mt-3">
                      {/* Qty control */}
                      <div className="flex items-center border border-dark-border rounded-xl overflow-hidden">
                        <button
                          onClick={() => {
                            if (item.quantity <= 1) dispatch(removeFromCart(rowId));
                            else dispatch(updateCartItem({ productId: pid, quantity: item.quantity - 1 }));
                          }}
                          className="px-3 py-1.5 text-dark-muted hover:text-dark-text hover:bg-dark-border transition-all"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 py-1.5 text-dark-text text-sm font-semibold border-x border-dark-border min-w-[2.5rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => dispatch(updateCartItem({ productId: pid, quantity: item.quantity + 1 }))}
                          className="px-3 py-1.5 text-dark-muted hover:text-dark-text hover:bg-dark-border transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold text-dark-text">{formatPrice(price * item.quantity)}</span>
                        <button onClick={() => dispatch(removeFromCart(rowId))}
                          className="p-1.5 text-dark-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20 space-y-4">
              <h3 className="font-heading text-lg font-bold text-dark-text">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-dark-muted">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="text-dark-text">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-dark-muted">
                  <span>Delivery Charges</span>
                  <span className={delivery === 0 ? 'text-green-400 font-semibold' : 'text-dark-text'}>
                    {delivery === 0 ? 'FREE' : formatPrice(delivery)}
                  </span>
                </div>
                {delivery > 0 && (
                  <p className="text-xs text-primary-400">Add {formatPrice(FREE_DELIVERY_ABOVE - subtotal)} more for free delivery</p>
                )}
                <div className="border-t border-dark-border pt-3 flex justify-between font-bold text-base">
                  <span className="text-dark-text">Total</span>
                  <span className="text-primary-400">{formatPrice(total)}</span>
                </div>
              </div>
              <button onClick={() => navigate('/checkout')} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-xs text-dark-muted text-center">Free delivery on orders above {formatPrice(FREE_DELIVERY_ABOVE)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
