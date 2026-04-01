import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Card } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import {
  Bell,
  Star,
  Calendar,
  FolderKanban,
  Award,
  TrendingUp,
  FileText,
  DollarSign,
  Check,
  Filter,
} from 'lucide-react';

const filters = [
  { id: 'all', label: 'All' },
  { id: 'project', label: 'Projects' },
  { id: 'meeting', label: 'Meetings' },
  { id: 'badge', label: 'Badges' },
  { id: 'points', label: 'Points' },
  { id: 'rating', label: 'Ratings' },
  { id: 'system', label: 'System' },
];

function getIcon(icon) {
  switch (icon) {
    case 'star':
      return <Star className="w-5 h-5 text-yellow-600" />;
    case 'calendar':
      return <Calendar className="w-5 h-5 text-blue-600" />;
    case 'project':
      return <FolderKanban className="w-5 h-5 text-blue-600" />;
    case 'badge':
      return <Award className="w-5 h-5 text-purple-600" />;
    case 'points':
      return <TrendingUp className="w-5 h-5 text-green-600" />;
    case 'file':
      return <FileText className="w-5 h-5 text-gray-600" />;
    case 'dollar':
      return <DollarSign className="w-5 h-5 text-blue-600" />;
    default:
      return <Bell className="w-5 h-5 text-gray-600" />;
  }
}

export default function AdviserNotificationsPage({ notificationsData = [], unreadNotificationsCount = 0 }) {
  const [notifications, setNotifications] = useState(notificationsData);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredNotifications = selectedFilter === 'all'
    ? notifications
    : notifications.filter((n) => n.type === selectedFilter);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id) => {
    router.post(route('adviser.notifications.read', id), {}, {
      preserveScroll: true,
      onSuccess: () => {
        setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
        router.reload({ preserveScroll: true });
      },
    });
  };

  const markAllAsRead = () => {
    router.post(route('adviser.notifications.mark-all-read'), {}, {
      preserveScroll: true,
      onSuccess: () => {
        setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
        router.reload({ preserveScroll: true });
      },
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Adviser Notifications" />
      <div className="py-8 px-4 lg:px-0 md:px-0">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-gray-900 text-2xl font-semibold mb-2">Notifications</h1>
              <p className="text-gray-500">
                System-wide notices (
                {unreadCount}
                {' '}
                unread)
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Mark all as read
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
            {filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedFilter === filter.id
                    ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <Card className="rounded-[20px] border-0 shadow-sm p-12 text-center">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-gray-900 font-semibold mb-2">No notifications</h3>
                <p className="text-gray-600">Nothing matches this filter.</p>
              </Card>
            ) : (
              filteredNotifications.map((n) => (
                <Card
                  key={n.id}
                  className={`rounded-[20px] border-0 shadow-sm p-4 flex gap-4 ${!n.isRead ? 'bg-blue-50/40' : ''}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white border flex items-center justify-center flex-shrink-0">
                    {getIcon(n.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900">{n.title}</h3>
                      {!n.isRead && <Badge className="bg-blue-100 text-blue-800">New</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{n.message || '—'}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span>{n.timestamp}</span>
                      {n.userId != null && n.userId !== '' && (
                        <span className="font-mono">User: {String(n.userId).slice(0, 8)}…</span>
                      )}
                      {!n.isRead && (
                        <button type="button" onClick={() => markAsRead(n.id)} className="text-blue-600 hover:underline">
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
