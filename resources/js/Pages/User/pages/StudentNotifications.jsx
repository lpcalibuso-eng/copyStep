import { useState } from 'react';
import { Card } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
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
  Filter
} from 'lucide-react';

const mockNotifications = [
  {
    id: 1,
    type: 'badge',
    title: 'Badge Unlocked!',
    message: 'You earned the "Active Reviewer" badge for rating 5 projects',
    timestamp: '5 minutes ago',
    isRead: false,
    icon: 'badge'
  },
  {
    id: 2,
    type: 'points',
    title: 'Points Earned',
    message: 'You gained 10 points for rating "Community Outreach Program"',
    timestamp: '1 hour ago',
    isRead: false,
    icon: 'points'
  },
  {
    id: 3,
    type: 'project',
    title: 'Project Updated',
    message: 'Community Outreach Program status changed to "Completed"',
    timestamp: '2 hours ago',
    isRead: false,
    icon: 'project'
  },
  {
    id: 4,
    type: 'meeting',
    title: 'New Meeting Posted',
    message: 'General Assembly scheduled for Nov 28, 2024 at 2:00 PM',
    timestamp: '3 hours ago',
    isRead: true,
    icon: 'calendar'
  },
  {
    id: 5,
    type: 'system',
    title: 'Ledger Update',
    message: 'New expense entry added to "Annual Sports Fest" - ₱15,000',
    timestamp: '5 hours ago',
    isRead: true,
    icon: 'dollar'
  },
  {
    id: 6,
    type: 'project',
    title: 'Proof Document Uploaded',
    message: 'Receipt uploaded for "Campus Sustainability Initiative"',
    timestamp: '1 day ago',
    isRead: true,
    icon: 'file'
  },
  {
    id: 7,
    type: 'rating',
    title: 'Rating Approved',
    message: 'Your rating for "Tech Innovation Summit" has been approved',
    timestamp: '1 day ago',
    isRead: true,
    icon: 'star'
  },
  {
    id: 8,
    type: 'points',
    title: 'Points Earned',
    message: 'You gained 5 points for attending "Budget Planning Session"',
    timestamp: '2 days ago',
    isRead: true,
    icon: 'points'
  },
  {
    id: 9,
    type: 'badge',
    title: 'Badge Progress',
    message: 'You\'re 2 meetings away from unlocking "Regular Attendee" badge',
    timestamp: '2 days ago',
    isRead: true,
    icon: 'badge'
  },
  {
    id: 10,
    type: 'meeting',
    title: 'Meeting Minutes Posted',
    message: 'Minutes for "Project Review Meeting" are now available',
    timestamp: '3 days ago',
    isRead: true,
    icon: 'calendar'
  }
];

const filters = [
  { id: 'all', label: 'All' },
  { id: 'project', label: 'Projects' },
  { id: 'meeting', label: 'Meetings' },
  { id: 'badge', label: 'Badges' },
  { id: 'points', label: 'Points' },
  { id: 'rating', label: 'Ratings' },
  { id: 'system', label: 'System' }
];

const getIcon = (icon) => {
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
};

export default function StudentNotificationsPage({ onNavigate, notificationsData = [] }) {
  const [notifications, setNotifications] = useState(notificationsData.length ? notificationsData : mockNotifications);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredNotifications = selectedFilter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === selectedFilter);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-gray-900 text-2xl font-semibold mb-2">Notifications</h1>
          <p className="text-gray-500">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Check className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
        {filters.map((filter) => (
          <button
            key={filter.id}
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

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card className="rounded-[20px] border-0 shadow-sm p-12 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-900 font-semibold mb-2">No notifications</h3>
            <p className="text-gray-600">
              {selectedFilter === 'all' 
                ? 'You\'re all caught up!' 
                : `No ${selectedFilter} notifications`}
            </p>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`rounded-[20px] border-0 shadow-sm p-4 transition-all hover:shadow-md ${
                !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
              }`}
            >
              <div className="flex gap-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  !notification.isRead ? 'bg-white shadow-sm' : 'bg-gray-100'
                }`}>
                  {getIcon(notification.icon)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="text-gray-900 font-semibold">{notification.title}</h3>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">{notification.timestamp}</p>
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Load More (if needed) */}
      {filteredNotifications.length > 0 && (
        <div className="text-center">
          <button
            className="px-6 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Load more notifications
          </button>
        </div>
      )}
    </div>
  );
}
