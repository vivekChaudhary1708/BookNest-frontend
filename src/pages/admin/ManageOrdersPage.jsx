import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, updateOrderStatus, selectAllOrders, selectOrdersLoading } from '../../redux/slices/orderSlice';
import { PageLoader } from '../../components/Loader';
import { formatPrice, formatDate } from '../../utils/helpers';
import { ORDER_STATUS, ORDER_STATUS_LIST } from '../../utils/constants';
import { Search } from 'lucide-react';

const ManageOrdersPage = () => {
  const dispatch   = useDispatch();
  const orders     = useSelector(selectAllOrders);
  const isLoading  = useSelector(selectOrdersLoading);
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('ALL');
  const [updating, setUpdating] = useState(null);

  useEffect(() => { dispatch(fetchAllOrders()); }, [dispatch]);

  const displayed = orders.filter((o) => {
    const matchesFilter = filter === 'ALL' || o.status === filter;
    const matchesSearch = !search || o.id?.toString().includes(search);
    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = async (orderId, status) => {
    setUpdating(orderId);
    await dispatch(updateOrderStatus({ id: orderId, status }));
    setUpdating(null);
  };

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <h1 className="page-header mb-2">Manage Orders</h1>
      <p className="page-sub mb-6">{orders.length} total orders</p>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID..." className="input pl-10 py-2 text-sm w-52" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['ALL', ...ORDER_STATUS_LIST].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === s ? 'bg-primary-500 text-navy-700' : 'bg-dark-card border border-dark-border text-dark-muted hover:text-dark-text'
              }`}>
              {s === 'ALL' ? 'All' : ORDER_STATUS[s]?.label || s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-dark-bg border-b border-dark-border">
              <tr>
                {['Order ID','Date','Items','Total','Status','Update Status'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-dark-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {displayed.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-dark-muted">No orders found</td></tr>
              ) : displayed.map((order) => {
                const st = ORDER_STATUS[order.status] || ORDER_STATUS.PLACED;
                const isCancelled = order.status === 'CANCELLED';
                const isDelivered = order.status === 'DELIVERED';
                return (
                  <tr key={order.id} className="hover:bg-dark-bg/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-dark-text">#{order.id?.toString().slice(-8)}</td>
                    <td className="px-4 py-3 text-dark-muted text-xs">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3 text-dark-muted">{(order.items || order.orderItems || []).length}</td>
                    <td className="px-4 py-3 text-primary-400 font-semibold">{formatPrice(order.totalAmount)}</td>
                    <td className="px-4 py-3"><span className={`badge text-[10px] ${st.color}`}>{st.label}</span></td>
                    <td className="px-4 py-3">
                      {isCancelled || isDelivered ? (
                        <span className="text-xs text-dark-muted italic">{isCancelled ? 'Cancelled' : 'Delivered'}</span>
                      ) : (
                        <select
                          value={order.status}
                          disabled={updating === order.id}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="input py-1.5 text-xs w-36"
                        >
                          {ORDER_STATUS_LIST.filter((s) => s !== 'CANCELLED').map((s) => (
                            <option key={s} value={s}>{ORDER_STATUS[s]?.label || s}</option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageOrdersPage;
