import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { MapPin, Phone, User, Home, CheckCircle } from 'lucide-react';
import { placeOrder, selectOrdersLoading } from '../../redux/slices/orderSlice';
import { selectCartItems, selectCartTotal, clearCartLocal } from '../../redux/slices/cartSlice';
import { fetchCart } from '../../redux/slices/cartSlice';
import { selectBooks } from '../../redux/slices/bookSlice';
import { selectUser } from '../../redux/slices/authSlice';
import { formatPrice } from '../../utils/helpers';
import { PageLoader } from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

import api from '../../services/api';
import { productService } from '../../services/productService';

const DELIVERY = 49;

const CheckoutPage = () => {
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const user        = useSelector(selectUser);
  const items       = useSelector(selectCartItems);
  const allBooks    = useSelector(selectBooks);
  const subtotal    = useSelector(selectCartTotal);
  const isLoading   = useSelector(selectOrdersLoading);
  const [ordered, setOrdered] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const delivery = subtotal >= 500 ? 0 : DELIVERY;
  const total    = subtotal + delivery;

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: user?.name || '', mobile: user?.mobile || '' },
  });

  useEffect(() => { 
    dispatch(fetchCart()); 
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [dispatch]);

  const processOrder = async (orderData, paymentId = null) => {
    if (paymentId) {
      orderData.paymentId = paymentId;
    }
    const result = await dispatch(placeOrder(orderData));
    if (placeOrder.fulfilled.match(result)) {
      for (const item of items) {
        try {
          const p = await productService.getById(item.productId || item.id);
          const currentStock = p.data.stockQuantity || p.data.stock || 0;
          const newStock = Math.max(0, currentStock - item.quantity);
          await productService.updateStock(item.productId || item.id, newStock);
        } catch (e) {
          console.error('Failed to update stock for item', item, e);
        }
      }
      dispatch(clearCartLocal());
      
      // Delay slightly to ensure backend processed the notification via RabbitMQ
      setTimeout(() => {
        import('../../redux/slices/notificationSlice').then(({ fetchNotifications }) => {
          dispatch(fetchNotifications());
        });
      }, 500);

      setOrdered(true);
    }
  };

  const onSubmit = async (data) => {
    const orderData = {
      shippingAddress: {
        fullName: data.name,
        mobile:   data.mobile,
        address:  data.address,
        city:     data.city,
        state:    data.state,
        pincode:  data.pincode,
      },
      paymentMethod,
      items: items.map((i) => ({
        productId: i.productId || i.id,
        productName: i.title || i.productName || 'Book',
        quantity:  i.quantity,
        price:     Number(i.discountPrice || i.price || 0),
        imageUrl:  i.imageUrl || '',
      })),
      totalAmount: total,
    };

    if (paymentMethod === 'COD') {
      await processOrder(orderData);
    } else {
      try {
        // Create Razorpay order on backend
        const res = await api.post('/orders/create-payment', { amount: total });
        const { orderId } = res.data;

        const options = {
          key: 'rzp_test_SjQeXp4dG1NeqV', // Test API Key
          amount: total * 100,
          currency: 'INR',
          name: 'BookNest',
          description: 'Payment for your books',
          order_id: orderId,
          handler: async function (response) {
            await processOrder(orderData, response.razorpay_payment_id);
          },
          prefill: {
            name: data.name,
            email: user?.email || '',
            contact: data.mobile,
          },
          theme: {
            color: '#10B981', // primary-500
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          toast.error('Payment failed: ' + response.error.description);
        });
        rzp.open();
      } catch (error) {
        console.error('Payment error', error);
        toast.error('Could not initiate payment. Please try again.');
      }
    }
  };

  if (ordered) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-5">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>
        <h2 className="font-heading text-3xl font-bold text-dark-text mb-2">Order Placed! 🎉</h2>
        <p className="text-dark-muted mb-6">Your books are on their way. You'll receive a confirmation soon.</p>
        <div className="flex gap-3">
          <Link to="/orders" className="btn-primary">View My Orders</Link>
          <Link to="/books"  className="btn-outline">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState icon={ShoppingBag} title="Your cart is empty"
        description="Add books to cart before checking out."
        action={<Link to="/books" className="btn-primary">Browse Books</Link>}
      />
    );
  }

  return (
    <div>
      <h1 className="page-header mb-2">Checkout</h1>
      <p className="page-sub mb-8">Complete your order</p>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Address form */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-5">
          <div className="card p-6">
            <h3 className="font-semibold text-dark-text mb-5 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary-500" /> Delivery Address
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                  <input className={`input pl-10 ${errors.name ? 'input-error' : ''}`} placeholder="John Doe"
                    {...register('name', { required: 'Name is required' })} />
                </div>
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="input-label">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                  <input className={`input pl-10 ${errors.mobile ? 'input-error' : ''}`} placeholder="9876543210"
                    {...register('mobile', { required: 'Mobile is required', pattern: { value: /^[6-9]\d{9}$/, message: 'Invalid mobile' } })} />
                </div>
                {errors.mobile && <p className="text-red-400 text-xs mt-1">{errors.mobile.message}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="input-label">Full Address</label>
                <div className="relative">
                  <Home className="absolute left-3.5 top-3.5 w-4 h-4 text-dark-muted" />
                  <textarea rows={2} className={`input pl-10 resize-none ${errors.address ? 'input-error' : ''}`}
                    placeholder="House/Flat No., Street, Landmark"
                    {...register('address', { required: 'Address is required' })} />
                </div>
                {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address.message}</p>}
              </div>

              <div>
                <label className="input-label">City</label>
                <input className={`input ${errors.city ? 'input-error' : ''}`} placeholder="Mumbai"
                  {...register('city', { required: 'City is required' })} />
                {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>}
              </div>

              <div>
                <label className="input-label">State</label>
                <input className={`input ${errors.state ? 'input-error' : ''}`} placeholder="Maharashtra"
                  {...register('state', { required: 'State is required' })} />
                {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state.message}</p>}
              </div>

              <div>
                <label className="input-label">Pincode</label>
                <input className={`input ${errors.pincode ? 'input-error' : ''}`} placeholder="400001"
                  {...register('pincode', { required: 'Pincode is required', pattern: { value: /^\d{6}$/, message: 'Enter valid 6-digit pincode' } })} />
                {errors.pincode && <p className="text-red-400 text-xs mt-1">{errors.pincode.message}</p>}
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="card p-6">
            <h3 className="font-semibold text-dark-text mb-4">Payment Method</h3>
            <div className="space-y-3">
              <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer ${paymentMethod === 'UPI' ? 'border-primary-500 bg-primary-500/10' : 'border-dark-border'}`}>
                <input type="radio" checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} className="accent-primary-500" />
                <div>
                  <p className="font-semibold text-dark-text text-sm">UPI / Online Payment</p>
                  <p className="text-xs text-dark-muted">Google Pay, PhonePe, Paytm and BHIM supported</p>
                </div>
              </label>
              <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer ${paymentMethod === 'CARD' ? 'border-primary-500 bg-primary-500/10' : 'border-dark-border'}`}>
                <input type="radio" checked={paymentMethod === 'CARD'} onChange={() => setPaymentMethod('CARD')} className="accent-primary-500" />
                <div>
                  <p className="font-semibold text-dark-text text-sm">Credit / Debit Card</p>
                  <p className="text-xs text-dark-muted">Visa, MasterCard, RuPay and Amex accepted</p>
                </div>
              </label>
              <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer ${paymentMethod === 'NETBANKING' ? 'border-primary-500 bg-primary-500/10' : 'border-dark-border'}`}>
                <input type="radio" checked={paymentMethod === 'NETBANKING'} onChange={() => setPaymentMethod('NETBANKING')} className="accent-primary-500" />
                <div>
                  <p className="font-semibold text-dark-text text-sm">Net Banking</p>
                  <p className="text-xs text-dark-muted">Pay directly using your bank account</p>
                </div>
              </label>
              <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer ${paymentMethod === 'COD' ? 'border-primary-500 bg-primary-500/10' : 'border-dark-border'}`}>
                <input type="radio" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="accent-primary-500" />
                <div>
                  <p className="font-semibold text-dark-text text-sm">Cash on Delivery</p>
                  <p className="text-xs text-dark-muted">Pay when your books arrive at your doorstep</p>
                </div>
              </label>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary w-full py-4 text-base">
            {isLoading
              ? <span className="flex items-center gap-2"><span className="w-5 h-5 border-2 border-navy-700/40 border-t-navy-700 rounded-full animate-spin" />Placing Order...</span>
              : `Place Order — ${formatPrice(total)}`
            }
          </button>
        </form>

        {/* Summary */}
        <div className="card p-6 h-fit sticky top-20 space-y-4">
          <h3 className="font-heading font-bold text-dark-text text-lg">Order Summary</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {items.map((item) => {
              const pid = item.productId || item.id;
              const bookDetails = allBooks.find(b => b.id === pid) || {};
              return (
                <div key={pid} className="flex gap-3">
                  <img src={bookDetails.imageUrl || item.imageUrl || `https://placehold.co/48x64/1E293B/F59E0B?text=B`}
                    alt={bookDetails.title || item.title} onError={(e) => { e.target.src = `https://placehold.co/48x64/1E293B/F59E0B?text=B`; }}
                    className="w-12 h-16 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-dark-text line-clamp-2">{bookDetails.title || item.title}</p>
                    <p className="text-xs text-dark-muted mt-0.5">Qty: {item.quantity}</p>
                    <p className="text-xs text-primary-400 font-semibold">{formatPrice((item.discountPrice || item.price) * item.quantity)}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="border-t border-dark-border pt-3 space-y-2 text-sm">
            <div className="flex justify-between text-dark-muted"><span>Subtotal</span><span className="text-dark-text">{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between text-dark-muted">
              <span>Delivery</span>
              <span className={delivery === 0 ? 'text-green-400' : 'text-dark-text'}>{delivery === 0 ? 'FREE' : formatPrice(delivery)}</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t border-dark-border pt-2">
              <span className="text-dark-text">Total</span>
              <span className="text-primary-400">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
