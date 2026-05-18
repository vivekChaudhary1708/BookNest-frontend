import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BookOpen, ShoppingBag, Users, TrendingUp, BookPlus, ArrowRight, Package } from 'lucide-react';
import { fetchProducts, selectBooks } from '../../redux/slices/bookSlice';
import { fetchAllOrders, selectAllOrders } from '../../redux/slices/orderSlice';
import { formatPrice, formatDate } from '../../utils/helpers';
import { ORDER_STATUS } from '../../utils/constants';
import { authService } from '../../services/authService';
import { useState } from 'react';

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-dark-muted text-sm">{label}</p>
      <p className="text-2xl font-bold text-dark-text">{value}</p>
      {sub && <p className="text-xs text-dark-muted">{sub}</p>}
    </div>
  </div>
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const books    = useSelector(selectBooks);
  const orders   = useSelector(selectAllOrders);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts({}));
    dispatch(fetchAllOrders());
    authService.getAllUsers().then((r) => setUsers(r.data || [])).catch(() => {});
  }, [dispatch]);

  const revenue   = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const pending   = orders.filter((o) => o.status === 'PLACED' || o.status === 'CONFIRMED').length;
  const lowStock  = books.filter((b) => b.stockQuantity <= 5);
  const recent    = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-header">Dashboard</h1>
        <p className="page-sub">Welcome back, Admin! Here's what's happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen}    label="Total Books"   value={books.length}     color="bg-blue-500/20 text-blue-400" />
        <StatCard icon={ShoppingBag} label="Total Orders"  value={orders.length}    sub={`${pending} pending`} color="bg-primary-500/20 text-primary-400" />
        <StatCard icon={Users}       label="Total Users"   value={users.length}     color="bg-purple-500/20 text-purple-400" />
        <StatCard icon={TrendingUp}  label="Revenue"       value={formatPrice(revenue)} color="bg-green-500/20 text-green-400" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-dark-text">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-3">
            {recent.length === 0 ? (
              <p className="text-sm text-dark-muted text-center py-4">No orders yet</p>
            ) : recent.map((order) => {
              const st = ORDER_STATUS[order.status] || ORDER_STATUS.PLACED;
              return (
                <div key={order.id} className="flex items-center justify-between p-3 bg-dark-bg rounded-xl">
                  <div>
                    <p className="text-xs font-mono text-dark-text">#{order.id?.toString().slice(-8)}</p>
                    <p className="text-xs text-dark-muted">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary-400">{formatPrice(order.totalAmount)}</p>
                    <span className={`badge text-[10px] ${st.color}`}>{st.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low stock alert */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-dark-text flex items-center gap-2">
              <Package className="w-4 h-4 text-primary-500" /> Low Stock Alert
            </h3>
            <Link to="/admin/books" className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">Manage <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-3">
            {lowStock.length === 0 ? (
              <p className="text-sm text-dark-muted text-center py-4">All books are well stocked! ✅</p>
            ) : lowStock.slice(0, 6).map((book) => (
              <div key={book.id} className="flex items-center gap-3 p-3 bg-dark-bg rounded-xl">
                <img src={book.imageUrl || `https://placehold.co/36x48/1E293B/F59E0B?text=B`}
                  alt={book.title} onError={(e) => { e.target.src = `https://placehold.co/36x48/1E293B/F59E0B?text=B`; }}
                  className="w-9 h-12 object-cover rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-dark-text line-clamp-1">{book.title}</p>
                  <p className="text-xs text-dark-muted">{book.author}</p>
                </div>
                <span className={`badge text-[10px] ${book.stockQuantity <= 0 ? 'badge-red' : 'badge-gold'}`}>
                  {book.stockQuantity <= 0 ? 'Out' : `${book.stockQuantity} left`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="card p-5">
        <h3 className="font-semibold text-dark-text mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/add-book"  className="btn-primary btn-sm flex items-center gap-2"><BookPlus className="w-4 h-4" />Add New Book</Link>
          <Link to="/admin/orders"    className="btn-outline btn-sm flex items-center gap-2"><ShoppingBag className="w-4 h-4" />View Orders</Link>
          <Link to="/admin/users"     className="btn-outline btn-sm flex items-center gap-2"><Users className="w-4 h-4" />Manage Users</Link>
          <Link to="/admin/analytics" className="btn-outline btn-sm flex items-center gap-2"><TrendingUp className="w-4 h-4" />Analytics</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
