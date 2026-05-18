import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BarChart2, TrendingUp, BookOpen, ShoppingBag, Users, DollarSign } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import { fetchProducts, selectBooks } from '../../redux/slices/bookSlice';
import { fetchAllOrders, selectAllOrders } from '../../redux/slices/orderSlice';
import { authService } from '../../services/authService';
import { formatPrice } from '../../utils/helpers';
import { ORDER_STATUS } from '../../utils/constants';
import { PageLoader } from '../../components/Loader';

const COLORS = ['#F59E0B','#6366f1','#10b981','#ef4444','#8b5cf6'];

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-dark-muted text-sm">{label}</p>
      <p className="text-2xl font-bold text-dark-text">{value}</p>
    </div>
  </div>
);

const AnalyticsPage = () => {
  const dispatch  = useDispatch();
  const books     = useSelector(selectBooks);
  const orders    = useSelector(selectAllOrders);
  const isLoading = useSelector((s) => s.books.isLoading || s.orders.isLoading);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts({}));
    dispatch(fetchAllOrders());
    authService.getAllUsers().then((r) => setUsers(r.data || [])).catch(() => {});
  }, [dispatch]);

  const revenue    = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const lowStock   = books.filter((b) => b.stockQuantity <= 5);

  // Revenue by month (derived from orders)
  const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
    const d   = new Date(); d.setMonth(d.getMonth() - (5 - i));
    const key = d.toLocaleString('default', { month: 'short' });
    const amt = orders
      .filter((o) => {
        const od = new Date(o.createdAt || 0);
        return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
      })
      .reduce((s, o) => s + (o.totalAmount || 0), 0);
    return { month: key, revenue: amt };
  });

  // Orders by status
  const statusData = Object.keys(ORDER_STATUS).map((s) => ({
    name:  ORDER_STATUS[s].label,
    value: orders.filter((o) => o.status === s).length,
  })).filter((d) => d.value > 0);

  // Top 5 books by title (mock scoring by position in array)
  const topBooks = books.slice(0, 5).map((b, i) => ({
    name:  b.title?.slice(0, 20) + (b.title?.length > 20 ? '…' : ''),
    sales: Math.max(1, 50 - i * 8),
  }));

  // Category distribution
  const catMap = {};
  books.forEach((b) => { catMap[b.category] = (catMap[b.category] || 0) + 1; });
  const catData = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, value]) => ({ name, value }));

  if (isLoading && books.length === 0) return <PageLoader />;

  const tooltipStyle = { backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '12px', color: '#E2E8F0' };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-header">Analytics</h1>
        <p className="page-sub">Business overview and insights</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen}    label="Total Books"  value={books.length}       color="bg-blue-500/20 text-blue-400" />
        <StatCard icon={ShoppingBag} label="Total Orders" value={orders.length}      color="bg-primary-500/20 text-primary-400" />
        <StatCard icon={Users}       label="Total Users"  value={users.length}       color="bg-purple-500/20 text-purple-400" />
        <StatCard icon={DollarSign}  label="Revenue"      value={formatPrice(revenue)} color="bg-green-500/20 text-green-400" />
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly revenue */}
        <div className="card p-5">
          <h3 className="font-semibold text-dark-text mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary-500" /> Monthly Revenue
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyRevenue}>
              <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [formatPrice(v), 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={2.5} dot={{ fill: '#F59E0B', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by status */}
        <div className="card p-5">
          <h3 className="font-semibold text-dark-text mb-4 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-primary-500" /> Orders by Status
          </h3>
          {statusData.length === 0 ? (
            <div className="flex items-center justify-center h-52 text-dark-muted text-sm">No orders data</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94A3B8' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top books */}
        <div className="card p-5">
          <h3 className="font-semibold text-dark-text mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary-500" /> Top 5 Books
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topBooks} layout="vertical">
              <XAxis type="number" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} width={120} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="sales" fill="#F59E0B" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Low stock */}
        <div className="card p-5">
          <h3 className="font-semibold text-dark-text mb-4">⚠️ Low Stock Books</h3>
          {lowStock.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-dark-muted text-sm">All books well stocked ✅</div>
          ) : (
            <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
              {lowStock.map((b) => (
                <div key={b.id} className="flex items-center gap-3 p-3 bg-dark-bg rounded-xl">
                  <img src={b.imageUrl || `https://placehold.co/36x48/1E293B/F59E0B?text=B`}
                    alt={b.title} onError={(e) => { e.target.src = `https://placehold.co/36x48/1E293B/F59E0B?text=B`; }}
                    className="w-9 h-12 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-dark-text line-clamp-1">{b.title}</p>
                    <p className="text-xs text-dark-muted">{b.author}</p>
                  </div>
                  <span className={`badge text-[10px] flex-shrink-0 ${b.stockQuantity <= 0 ? 'badge-red' : 'badge-gold'}`}>
                    {b.stockQuantity <= 0 ? 'Out' : `${b.stockQuantity} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
