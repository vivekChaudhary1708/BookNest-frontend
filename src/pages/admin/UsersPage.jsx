import { useEffect, useState } from 'react';
import { Search, Ban, Trash2, Users } from 'lucide-react';
import { authService } from '../../services/authService';
import { PageLoader } from '../../components/Loader';
import { formatDate, initials } from '../../utils/helpers';
import toast from 'react-hot-toast';

const UsersPage = () => {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  const load = () => {
    setLoading(true);
    authService.getAllUsers()
      .then((r) => setUsers(r.data || []))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleBlock = async (id, name) => {
    if (!window.confirm(`Block user "${name}"?`)) return;
    try { await authService.blockUser(id); toast.success('User blocked'); load(); }
    catch { toast.error('Failed to block user'); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Permanently delete user "${name}"? This cannot be undone.`)) return;
    try { await authService.deleteUser(id); toast.success('User deleted'); load(); }
    catch { toast.error('Failed to delete user'); }
  };

  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="page-header">Manage Users</h1>
          <p className="page-sub">{users.length} registered users</p>
        </div>
      </div>

      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..." className="input pl-10" />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-dark-bg border-b border-dark-border">
              <tr>
                {['User','Email','Mobile','Role','Joined','Status','Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-dark-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-dark-muted">No users found</td></tr>
              ) : filtered.map((user) => (
                <tr key={user.id} className="hover:bg-dark-bg/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 font-semibold text-xs flex-shrink-0">
                        {initials(user.name || 'U')}
                      </div>
                      <span className="font-medium text-dark-text">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-dark-muted text-xs">{user.email}</td>
                  <td className="px-4 py-3 text-dark-muted text-xs">{user.mobile || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`badge text-[10px] ${user.role === 'ADMIN' ? 'badge-red' : 'badge-blue'}`}>{user.role}</span>
                  </td>
                  <td className="px-4 py-3 text-dark-muted text-xs">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge text-[10px] ${user.blocked ? 'badge-red' : 'badge-green'}`}>
                      {user.blocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {user.role !== 'ADMIN' && (
                        <button onClick={() => handleBlock(user.id, user.name)}
                          className="p-1.5 rounded-lg text-dark-muted hover:text-yellow-400 hover:bg-yellow-500/10 transition-all" title="Block user">
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                      {user.role !== 'ADMIN' && (
                        <button onClick={() => handleDelete(user.id, user.name)}
                          className="p-1.5 rounded-lg text-dark-muted hover:text-red-400 hover:bg-red-500/10 transition-all" title="Delete user">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      {user.role === 'ADMIN' && <span className="text-xs text-dark-muted italic">Protected</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
