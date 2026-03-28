import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Calendar,
  Users,
  FileText,
  Star,
  Clock,
  X,
  ChevronRight,
  Settings,
  Mail,
  MessageSquare,  
  TrendingUp,
  Award,
  Gift,
  Info,
} from 'lucide-react';

function showToast(message, type = 'success') {
  const id = `simple-toast-${Date.now()}`;
  const el = document.createElement('div');
  el.id = id;
  el.className = 'fixed right-4 bottom-6 z-50 px-4 py-2 rounded shadow text-white';
  el.style.background = type === 'success' ? '#0ea5e9' : '#ef4444';
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => {
    const e = document.getElementById(id);
    if (e) e.remove();
  }, 2200);
}

function CSGNotificationsPageInner() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [loading, setLoading] = useState(true);

  // Sample notifications data - replace with API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const sampleNotifications = [
        {
          id: 1,
          title: 'Meeting Reminder',
          message: 'CSG General Assembly meeting today at 3:00 PM in Auditorium',
          type: 'meeting',
          priority: 'high',
          isRead: false,
          createdAt: '2024-03-25T10:30:00',
          actionUrl: '/meetings',
          icon: Calendar,
          iconColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
        },
        {
          id: 2,
          title: 'New Attendee Added',
          message: '5 new attendees have been added to the Community Outreach meeting',
          type: 'attendance',
          priority: 'medium',
          isRead: false,
          createdAt: '2024-03-25T09:15:00',
          actionUrl: '/meetings',
          icon: Users,
          iconColor: 'text-green-600',
          bgColor: 'bg-green-50',
        },
        {
          id: 3,
          title: 'Meeting Minutes Uploaded',
          message: 'Minutes for the Sports Fest planning meeting are now available',
          type: 'document',
          priority: 'low',
          isRead: true,
          createdAt: '2024-03-24T16:20:00',
          actionUrl: '/meetings/past',
          icon: FileText,
          iconColor: 'text-purple-600',
          bgColor: 'bg-purple-50',
        },
        {
          id: 4,
          title: 'Performance Update',
          message: 'Your CSG performance score increased by 7% this month!',
          type: 'achievement',
          priority: 'medium',
          isRead: false,
          createdAt: '2024-03-24T14:00:00',
          actionUrl: '/performance',
          icon: TrendingUp,
          iconColor: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
        },
        {
          id: 5,
          title: 'Achievement Unlocked',
          message: 'Congratulations! You\'ve earned the "Excellence Award" badge',
          type: 'achievement',
          priority: 'high',
          isRead: true,
          createdAt: '2024-03-23T11:45:00',
          actionUrl: '/performance',
          icon: Award,
          iconColor: 'text-orange-600',
          bgColor: 'bg-orange-50',
        },
        {
          id: 6,
          title: 'Upcoming Deadline',
          message: 'Project proposal submission deadline in 3 days',
          type: 'deadline',
          priority: 'high',
          isRead: false,
          createdAt: '2024-03-23T09:00:00',
          actionUrl: '/projects',
          icon: Clock,
          iconColor: 'text-red-600',
          bgColor: 'bg-red-50',
        },
        {
          id: 7,
          title: 'New Message',
          message: 'You have a new message from the CSG Adviser',
          type: 'message',
          priority: 'medium',
          isRead: true,
          createdAt: '2024-03-22T15:30:00',
          actionUrl: '/messages',
          icon: MessageSquare,
          iconColor: 'text-indigo-600',
          bgColor: 'bg-indigo-50',
        },
        {
          id: 8,
          title: 'Feedback Received',
          message: 'New feedback submitted for the Tech Summit event',
          type: 'feedback',
          priority: 'low',
          isRead: false,
          createdAt: '2024-03-22T10:00:00',
          actionUrl: '/feedback',
          icon: Star,
          iconColor: 'text-pink-600',
          bgColor: 'bg-pink-50',
        },
      ];
      setNotifications(sampleNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
    showToast('Notification marked as read', 'success');
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
    showToast('All notifications marked as read', 'success');
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
    showToast('Notification deleted', 'success');
  };

  const clearAll = () => {
    setNotifications([]);
    showToast('All notifications cleared', 'success');
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      const diffMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.isRead;
    if (filter === 'read') return notif.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const NotificationCard = ({ notification }) => {
    const IconComponent = notification.icon;
    
    return (
      <Card className={`rounded-xl border transition-all duration-200 hover:shadow-md ${
        !notification.isRead ? 'border-l-4 border-l-blue-500 bg-white' : 'bg-gray-50/50'
      }`}>
        <div className="p-5">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={`p-2 rounded-xl ${notification.bgColor}`}>
              <IconComponent className={`w-5 h-5 ${notification.iconColor}`} />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {notification.title}
                  </h3>
                  <Badge className={getPriorityColor(notification.priority)}>
                    {notification.priority.toUpperCase()}
                  </Badge>
                  {!notification.isRead && (
                    <Badge className="bg-blue-100 text-blue-700">
                      New
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Mark as read"
                  >
                    <CheckCircle className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">
                {notification.message}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(notification.createdAt)}</span>
                </div>
                
                {notification.actionUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 p-0 h-auto"
                    onClick={() => window.location.href = notification.actionUrl}
                  >
                    View Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card className="rounded-xl border-0 shadow-sm p-4 bg-white">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-xs text-gray-500">{title}</p>
          <p className="text-xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Bell className="w-12 h-12 text-gray-300 animate-pulse mx-auto mb-4" />
          <p className="text-gray-500">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
          <p className="text-gray-500">Stay updated with your CSG activities</p>
        </div>
        
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={markAllAsRead}
              className="rounded-xl"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark all as read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="outline"
              onClick={clearAll}
              className="rounded-xl text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4 mr-2" />
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Notifications"
          value={notifications.length}
          icon={Bell}
          color="bg-blue-600"
        />
        <StatCard
          title="Unread"
          value={unreadCount}
          icon={Mail}
          color="bg-yellow-600"
        />
        <StatCard
          title="Read"
          value={notifications.filter(n => n.isRead).length}
          icon={CheckCircle}
          color="bg-green-600"
        />
        <StatCard
          title="High Priority"
          value={notifications.filter(n => n.priority === 'high').length}
          icon={AlertCircle}
          color="bg-red-600"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
            filter === 'all'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
            filter === 'unread'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Unread
          {unreadCount > 0 && (
            <Badge className="ml-2 bg-white/20 text-white">
              {unreadCount}
            </Badge>
          )}
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
            filter === 'read'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Read
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-4">
          {filteredNotifications.map(notification => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </div>
      ) : (
        <Card className="rounded-xl border-0 shadow-sm p-12 text-center bg-gradient-to-b from-gray-50 to-white">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No notifications
            </h3>
            <p className="text-gray-500 mb-6 max-w-sm">
              {filter === 'all' 
                ? "You're all caught up! New notifications will appear here."
                : filter === 'unread'
                ? "No unread notifications. Check back later for updates."
                : "No read notifications. Mark some notifications as read to see them here."
              }
            </p>
            {filter !== 'all' && (
              <Button
                onClick={() => setFilter('all')}
                className="rounded-xl bg-blue-600 hover:bg-blue-700"
              >
                View all notifications
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      {notifications.length > 0 && (
        <Card className="rounded-xl border-0 shadow-sm p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Notification Settings</h3>
                <p className="text-xs text-gray-600">Manage how you receive notifications</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="rounded-xl bg-white hover:bg-gray-50"
              onClick={() => showToast('Settings coming soon', 'info')}
            >
              Configure
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

export default function CSGNotificationsPage() {
  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Notifications</h2>}>
      <Head title="Notifications" />
      <div className="py-8 px-4 lg:px-0 md:px-0">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <CSGNotificationsPageInner />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}