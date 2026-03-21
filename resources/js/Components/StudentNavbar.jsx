import { useState, useRef, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/react';
import { useLogout } from '../hooks/useLogout';
import { useSupabase } from '../context/SupabaseContext';
import {
  LayoutDashboard,
  FolderKanban,
  Calendar,
  TrendingUp,
  Award,
  Trophy,
  User,
  Menu,
  X,
  LogOut,
  Repeat,
  ChevronDown,
  Bell
} from 'lucide-react';

export function StudentNavbar({
  currentView,
  onNavigate,
  onLogout: onLogoutCallback,
  onSwitchRole,
  userData,
  notificationsData = [],
  unreadNotificationsCount = 0,
}) {
  const { logout: supabaseLogout } = useLogout();
  const { user } = useSupabase();
  const { props } = usePage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const notificationsMenuRef = useRef(null);

  // Get display name from user object
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student';
  const userInitials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  const profilePicture = user?.user_metadata?.avatar_url;

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (notificationsMenuRef.current && !notificationsMenuRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'meetings', label: 'Meetings', icon: Calendar },
    // { id: 'points', label: 'Points', icon: TrendingUp },
    { id: 'badges', label: 'Badges', icon: Award },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  ];
  const navbarNotifications = (notificationsData || []).slice(0, 5);

  return ( 
    <>
      {/* Desktop Top Navbar */}
      <nav className="hidden lg:block fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 rounded-xl flex items-center justify-center">
                {/* <span className="text-white">S</span> */}
                <img
              src="/images/Logo.png" alt="Step Logo"
              className="w-full object-cover"/>
              </div>
              <div className='w-10'>
                {/* <h1 className="text-blue-600">STEP</h1> */}
                <img
              src="/images/step_dark.png" alt="Step"
              className="w-full object-cover"/>
              </div>
            </div>

            {/* Nav Links */}
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md'
                        : 'text-gray-600 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Notifications & Profile */}
            <div className="flex items-center gap-3 relative">
              {/* Notifications Icon */}
              <div className="relative" ref={notificationsMenuRef}>
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
                    </span>
                  )}
                </button>
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b">
                      <p className="font-medium">Notifications</p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {navbarNotifications.length > 0 ? navbarNotifications.map((item) => (
                        <div key={item.id} className="p-3 hover:bg-gray-50 cursor-pointer">
                          <p className="text-sm text-gray-900">{item.title}</p>
                          <p className="text-xs text-gray-500">{item.timestamp}</p>
                        </div>
                      )) : (
                        <div className="p-3 text-sm text-gray-500">No notifications</div>
                      )}
                    </div>
                    <div className="p-3 border-t text-center">
                      <button onClick={() => onNavigate('notifications')} className="text-sm text-blue-600">
                        View all
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                >
                  {profilePicture ? (
                    <img 
                      src={profilePicture} 
                      alt={displayName}
                      className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                      {userInitials}
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-sm text-gray-900">{displayName}</p>
                    <p className="text-xs text-blue-600">500 pts</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                    <button
                      onClick={() => { onNavigate('profile'); setIsProfileMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-left"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <button
                      onClick={() => { onNavigate('notifications'); setIsProfileMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-left"
                    >
                      <Award className="w-4 h-4" />
                      Notifications
                    </button>
                    {onSwitchRole && userData?.canSwitch && (
                      <>
                        <div className="border-t my-1"></div>
                        <button
                          onClick={() => { onSwitchRole(); setIsProfileMenuOpen(false); }}
                          className="w-full flex items-center gap-2 px-4 py-3 text-orange-600 hover:bg-orange-50 text-left"
                        >
                          <Repeat className="w-4 h-4" />
                          Switch to Officer Mode
                        </button>
                      </>
                    )}
                    <div className="border-t my-1"></div>
                    <button
                      onClick={() => { 
                        setIsProfileMenuOpen(false);
                        // Try callback first, then Supabase logout
                        if (typeof onLogoutCallback === 'function') {
                          onLogoutCallback();
                        } else {
                          supabaseLogout();
                        }
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 rounded-lg flex items-center justify-center">
            <img
              src="/images/Logo.png" alt="Step Logo"
              className="w-full object-cover"/>
          </div>
          <div className="w-10">
            <img
              src="/images/step_dark.png" alt="Step"
              className="w-full object-cover"/>
          </div>
        </div>
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
          ST
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 shadow-xl z-50 transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 rounded-xl flex items-center justify-center">
              <img
                src="/images/Logo.png" alt="Step Logo"
                className="w-full object-cover"/>
            </div>
            <div class="w-full">
              <div class="w-8">
              <img
                src="/images/step_dark.png" alt="Step"
                className="w-full object-cover"/>
              </div>
              <p class="text-xs text-gray-500">Super Admin</p>
              </div>
            {/* <div className="w-8">
              <img
                src="/images/step_dark.png" alt="Step"
                className="w-full object-cover"/>
              <p className="text-xs text-gray-500">Student Portal</p>
            </div> */}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto h-[calc(100vh-270px)]">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onNavigate(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md'
                        : 'text-gray-600 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
            
            {/* Divider */}
            <li className="my-2 border-t border-gray-200"></li>

            {/* Notifications */}
            <li>
              <button
                onClick={() => {
                  onNavigate('notifications');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                  currentView === 'notifications'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md'
                    : 'text-gray-600 hover:bg-blue-50'
                }`}
              >
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
                {unreadNotificationsCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
                    {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
                  </span>
                )}
              </button>
            </li>

            {/* Profile */}
            <li>
              <button
                onClick={() => {
                  onNavigate('profile');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                  currentView === 'profile'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md'
                    : 'text-gray-600 hover:bg-blue-50'
                }`}
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Profile & Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            {profilePicture ? (
              <img 
                src={profilePicture} 
                alt={displayName}
                className="w-8 h-8 rounded-full object-cover border border-gray-200 flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
                {userInitials}
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm text-gray-900">{displayName}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          {onSwitchRole && userData?.canSwitch && (
            <button
              onClick={() => {
                onSwitchRole();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 rounded-xl transition-all shadow-md"
            >
              <Repeat className="w-5 h-5" />
              <span>Switch to Officer Mode</span>
            </button>
          )}
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        // Try callback first, then Supabase logout
                        if (typeof onLogoutCallback === 'function') {
                          onLogoutCallback();
                        } else {
                          supabaseLogout();
                        }
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
        </div>
      </aside>

      {/* Mobile Bottom Quick Access Bar (Points & Badges) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 px-4 py-3">
        <div className="flex gap-3">
          <button
            onClick={() => onNavigate('badges')}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-md"
          >
            <Award className="w-4 h-4" />
            <div className="text-left">
              <p className="text-xs opacity-90">Badges</p>
              <p className="text-sm">12</p>
            </div>
          </button>
          <button
            onClick={() => onNavigate('leaderboard')}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-gradient-to-br from-yellow-400 to-yellow-600 text-white rounded-lg shadow-md"
          >
            <Trophy className="w-4 h-4" />
            {/* <TrendingUp className="w-4 h-4" /> */}
            <div className="text-left">
              <p className="text-xs opacity-90">Leaderboard</p>
              <p className="text-sm">#24</p>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}