import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Package, Trash2 } from 'lucide-react';
import { fetchMyOrders, cancelOrder, removeOrder, selectMyOrders, selectOrdersLoading } from '../../redux/slices/orderSlice';
import { PageLoader } from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { formatPrice, formatDate } from '../../utils/helpers';
import { ORDER_STATUS } from '../../utils/constants';

const OrdersPage = () => {
  const dispatch  = useDispatch();
  const orders    = useSelector(selectMyOrders);
  const isLoading = useSelector(selectOrdersLoading);

  useEffect(() => { dispatch(fetchMyOrders()); }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this order from your history?')) {
      dispatch(removeOrder(id));
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <h1 className="page-header mb-2">My Orders</h1>
      <p className="page-sub mb-8">Track and manage your book orders</p>

      {orders.length === 0 ? (
        <EmptyState icon={Package} title="No orders yet"
          description="You haven't placed any orders yet. Start shopping!"
          action={<Link to="/books" className="btn-primary">Shop Now</Link>}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = ORDER_STATUS[order.status] || ORDER_STATUS.PLACED;
            return (
              <div key={order.id} className="card p-5 hover:border-primary-500/30 transition-colors">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs text-dark-muted">Order ID</p>
                    <p className="font-mono font-semibold text-dark-text text-sm">#{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-dark-muted">Placed on</p>
                    <p className="text-sm text-dark-text">{formatDate(order.createdAt || order.orderDate)}</p>
                  </div>
                  <span className={`badge ${status.color}`}>{status.label}</span>
                </div>

                {/* Status bar */}
                <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-1">
                  {['PLACED','CONFIRMED','SHIPPED','DELIVERED'].map((s, i) => {
                    const steps = ['PLACED','CONFIRMED','SHIPPED','DELIVERED'];
                    const cur   = steps.indexOf(order.status);
                    const done  = i <= cur;
                    const cancelled = order.status === 'CANCELLED';
                    return (
                      <div key={s} className="flex items-center gap-1 flex-shrink-0">
                        <div className={`w-2 h-2 rounded-full transition-colors ${cancelled ? 'bg-red-500' : done ? 'bg-primary-500' : 'bg-dark-border'}`} />
                        <span className={`text-[10px] font-medium transition-colors ${cancelled ? 'text-red-400' : done ? 'text-primary-400' : 'text-dark-muted'}`}>{s}</span>
                        {i < 3 && <div className={`h-px w-8 transition-colors ${done && !cancelled && i < cur ? 'bg-primary-500' : 'bg-dark-border'}`} />}
                      </div>
                    );
                  })}
                </div>

                {/* Items */}
                <div className="flex gap-3 overflow-x-auto pb-2 mb-4">
                  {(order.items || order.orderItems || []).slice(0, 4).map((item, i) => (
                    <div key={i} className="flex-shrink-0 flex gap-2 items-center bg-dark-bg rounded-xl p-2 min-w-[180px]">
                      <img src={item.imageUrl || `https://placehold.co/40x56/1E293B/F59E0B?text=B`}
                        alt={item.title} onError={(e) => { e.target.src = `https://placehold.co/40x56/1E293B/F59E0B?text=B`; }}
                        className="w-10 h-14 object-cover rounded-lg flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-dark-text line-clamp-2">{item.title || item.productName}</p>
                        <p className="text-xs text-dark-muted">Qty: {item.quantity}</p>
                        <p className="text-xs text-primary-400 font-semibold">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-dark-border pt-3">
                  <div>
                    <p className="text-xs text-dark-muted">Total Amount</p>
                    <p className="font-bold text-primary-400 text-lg">{formatPrice(order.totalAmount)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-dark-muted">Payment: {order.paymentMethod || 'COD'}</span>
                    {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                      <button
                        onClick={async () => {
                          const res = await dispatch(cancelOrder(order.id));
                          if (cancelOrder.fulfilled.match(res)) {
                            // Delay slightly to ensure backend processed the notification
                            setTimeout(() => {
                              import('../../redux/slices/notificationSlice').then(({ fetchNotifications }) => {
                                dispatch(fetchNotifications());
                              });
                            }, 500);
                          }
                        }}
                        className="btn-ghost btn-sm text-red-400 border border-red-500/40 bg-red-500/5 hover:bg-red-500/15"
                      >
                        Cancel Order
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="btn-ghost btn-sm text-dark-muted hover:text-red-500 transition-colors ml-1 p-2 rounded-lg"
                      title="Delete Order History"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {order.status === 'CANCELLED' && (
                  <p className="text-xs text-green-400 mt-2">
                    Refund status: {order.refundStatus || 'REFUNDED'} {order.refundAmount ? `(${formatPrice(order.refundAmount)})` : ''}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
