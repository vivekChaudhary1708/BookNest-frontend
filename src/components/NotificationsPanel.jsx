import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, Trash2 } from 'lucide-react';
import { fetchNotifications, selectNotifications, selectNotificationLoading, markAllAsRead, deleteNotification } from '../redux/slices/notificationSlice';
import { formatDate } from '../utils/helpers';

const NotificationsPanel = ({ isAdmin = false }) => {
  const dispatch = useDispatch();
  const list = useSelector(selectNotifications);
  const loading = useSelector(selectNotificationLoading);

  useEffect(() => {
    dispatch(fetchNotifications(isAdmin));
  }, [dispatch, isAdmin]);

  useEffect(() => {
    if (list.length > 0) {
      dispatch(markAllAsRead());
    }
  }, [dispatch, list.length]);

  return (
    <div>
      <h1 className="page-header mb-2">Notifications</h1>
      <p className="page-sub mb-6">Order updates, cancellations and refunds</p>
      {loading ? (
        <p className="text-dark-muted">Loading notifications...</p>
      ) : list.length === 0 ? (
        <div className="card p-8 text-center text-dark-muted">
          <Bell className="w-8 h-8 mx-auto mb-2" />
          No notifications yet.
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((n) => (
            <div key={n.id} className="card p-4 flex justify-between items-start gap-4">
              <div className="flex-1">
                <p className="font-semibold text-dark-text">{n.title || 'Notification'}</p>
                <p className="text-sm text-dark-muted mt-1">{n.message}</p>
                {n.orderId && <p className="text-xs text-primary-400 mt-2">Order: #{n.orderId}</p>}
                <p className="text-xs text-dark-muted mt-1">{formatDate(n.createdAt)}</p>
              </div>
              <button 
                onClick={() => dispatch(deleteNotification(n.id))}
                className="p-1.5 text-dark-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                title="Delete Notification"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPanel;
