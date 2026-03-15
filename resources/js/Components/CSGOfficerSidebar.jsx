import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage, router } from '@inertiajs/react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  BookOpen, 
  Calendar, 
  Star,
  TrendingUp,
  User,
  Menu,
  X,
  LogOut,
  Plus,
  DollarSign,
  FileText,
  Repeat,
  Users,
  ChevronRight
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog';

export default function CSGOfficerSidebar({ currentView = null, onNavigate = null, onLogout = null, onSwitchRole = null, userData = null, isSwitchedView = null }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOnlineModalOpen, setIsOnlineModalOpen] = useState(false);

  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

  // Mock online CSG officers data
  const onlineOfficers = [
    { id: 1, name: 'John Reyes', position: 'President', avatar: 'JR', status: 'online', lastSeen: 'Active now' },
    { id: 2, name: 'Maria Santos', position: 'Vice President', avatar: 'MS', status: 'online', lastSeen: 'Active now' },
    { id: 3, name: 'Carlos De Leon', position: 'Treasurer', avatar: 'CD', status: 'online', lastSeen: 'Active now' },
    { id: 4, name: 'Ana Martinez', position: 'Secretary', avatar: 'AM', status: 'idle', lastSeen: '5 mins ago' },
    { id: 5, name: 'Rafael Cruz', position: 'Auditor', avatar: 'RC', status: 'offline', lastSeen: '2 hours ago' },
  ];

  const onlineCount = onlineOfficers.filter(o => o.status === 'online').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'ledger', label: 'Ledger', icon: BookOpen },
    { id: 'proof', label: 'Proof', icon: FileText },
    { id: 'meetings', label: 'Meetings', icon: Calendar },
    { id: 'ratings', label: 'Ratings', icon: Star },
    { id: 'performance-panel', label: 'Performance', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // Derive active view from pathname when parent doesn't provide `currentView`
  function getViewFromPath() {
    if (typeof window === 'undefined') return 'dashboard';
    const p = window.location.pathname;
    if (p.startsWith('/csg/projects')) return 'projects';
    if (p.startsWith('/csg/ledger')) return 'ledger';
    if (p.startsWith('/csg/proof')) return 'proof';
    if (p.startsWith('/csg/meetings')) return 'meetings';
    if (p.startsWith('/csg/ratings')) return 'ratings';
    if (p.startsWith('/csg/performance-panel')) return 'performance-panel';
    if (p.startsWith('/csg/profile')) return 'profile';
    if (p === '/csg' || p.startsWith('/csg')) return 'dashboard';
    return 'dashboard';
  }

  const initialSelected = currentView || getViewFromPath();
  const [selectedView, setSelectedView] = useState(initialSelected);

  // Keep selectedView in sync when Inertia's page URL changes or browser history changes
  const { url } = usePage();
  useEffect(() => {
    setSelectedView(getViewFromPath());
    const onPop = () => setSelectedView(getViewFromPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [url]);

  // Quick actions for mobile bottom bar
  const quickActions = [
    { icon: Plus, label: 'New Project', color: 'bg-green-600' },
    { icon: DollarSign, label: 'Add Entry', color: 'bg-blue-600' },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 overflow-hidden">
            <img src="/images/Logo.png" alt="Step Logo" className="w-full h-full object-cover" />
          </div>
          <div className="w-10">
            <img src="/images/step_dark.png" alt="STEP" className="w-full object-cover" />
          </div>
        </div>
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md text-xs">CO</AvatarFallback>
        </Avatar>
      </div>

      {/* Mobile Quick Actions Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 px-4 py-3">
        <div className="flex gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                className={`flex-1 flex items-center justify-center gap-2 py-3 ${action.color} text-white rounded-xl shadow-md hover:opacity-90 transition-opacity`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{action.label}</span>
              </button>
            );
          })}
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
      <aside className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 shadow-xl z-50 transform transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 overflow-hidden">
                <img src="/images/Logo.png" alt="Step Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="w-10">
                  <img src="/images/step_dark.png" alt="STEP" className="w-full object-cover" />
                </div>
                <p className="text-xs text-gray-500">CSG Officer</p>
              </div>
            </div>
            
            {/* Online Officers Indicator Button */}
            <button
              onClick={() => setIsOnlineModalOpen(true)}
              className="flex items-center gap-2 px-2 py-1.5 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200 group"
            >
              {/* Pulsing Indicator */}
              <div className="relative flex items-center justify-center w-3 h-3">
                <div className="absolute w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="absolute w-2 h-2 bg-green-500 rounded-full animate-ping opacity-75"></div>
              </div>
              
              {/* Stacked Avatars */}
              <div className="flex items-center -space-x-1.5">
                {onlineOfficers.filter(o => o.status === 'online').slice(0, 1).map((officer) => (
                  <Avatar key={officer.id} className="w-6 h-6 border-2 border-white ring-1 ring-green-200">
                    <AvatarFallback className="bg-green-600 text-white text-[9px]">
                      {officer.avatar}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {onlineCount > 1 && (
                  <div className="w-6 h-6 rounded-full bg-green-600 border-2 border-white ring-1 ring-green-200 flex items-center justify-center">
                    <span className="text-white text-[9px] font-medium">+{onlineCount - 1}</span>
                  </div>
                )}
              </div>
              
              {/* Chevron Icon */}
              <ChevronRight className="w-3.5 h-3.5 text-green-600 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto h-[calc(100vh-180px)]">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = (currentView ? currentView === item.id : selectedView === item.id);
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setSelectedView(item.id);
                      if (typeof onNavigate === 'function') return onNavigate(item.id);
                      // Navigate via Inertia to the appropriate CSG route
                      const map = {
                        dashboard: '/csg',
                        projects: '/csg/projects',
                        ledger: '/csg/ledger',
                        proof: '/csg/proof',
                        meetings: '/csg/meetings',
                        ratings: '/csg/ratings',
                        'performance-panel': '/csg/performance-panel',
                        profile: '/csg/profile',
                      };
                      const url = map[item.id] || '/csg';
                      router.visit(url);
                      return null;
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
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          {/* Switch Role Button */}
          {onSwitchRole && userData?.canSwitch && (
            <div className="mb-2">
              <p className="text-xs text-gray-500 px-4 mb-2">Switch Role</p>
              <button
                onClick={() => {
                  onSwitchRole();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 rounded-xl transition-all shadow-md"
              >
                <Repeat className="w-5 h-5" />
                <span>Switch to Student View</span>
              </button>
            </div>
          )}
          
          <form method="POST" action="/logout" className="w-full">
            <input type="hidden" name="_token" value={csrfToken} />
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex-col shadow-sm z-40">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 overflow-hidden">
                <img src="/images/Logo.png" alt="Step Logo" className="w-full object-cover" />
              </div>
              <div>
                <div className="w-10">
                  <img src="/images/step_dark.png" alt="STEP" className="w-full object-cover" />
                </div>
                <p className="text-xs text-gray-500">CSG Officer</p>
              </div>
            </div>
            
            {/* Online Officers Indicator Button */}
            <button
              onClick={() => setIsOnlineModalOpen(true)}
              className="flex items-center gap-1.5 px-2 py-1.5 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200 group"
            >
              {/* Pulsing Indicator */}
              <div className="relative flex items-center justify-center w-3 h-3">
                <div className="absolute w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="absolute w-2 h-2 bg-green-500 rounded-full animate-ping opacity-75"></div>
              </div>
              
              {/* Stacked Avatars */}
              <div className="flex items-center -space-x-1.5">
                {onlineOfficers.filter(o => o.status === 'online').slice(0, 1).map((officer) => (
                  <Avatar key={officer.id} className="w-6 h-6 border-2 border-white ring-1 ring-green-200">
                    <AvatarFallback className="bg-green-600 text-white text-[9px]">
                      {officer.avatar}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {onlineCount > 1 && (
                  <div className="w-6 h-6 rounded-full bg-green-600 border-2 border-white ring-1 ring-green-200 flex items-center justify-center">
                    <span className="text-white text-[9px] font-medium">+{onlineCount - 1}</span>
                  </div>
                )}
              </div>
              
              {/* Chevron Icon */}
              <ChevronRight className="w-3.5 h-3.5 text-green-600 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = (currentView ? currentView === item.id : selectedView === item.id);
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setSelectedView(item.id);
                      if (typeof onNavigate === 'function') return onNavigate(item.id);
                      // Navigate via Inertia to the appropriate CSG route
                      const map = {
                        dashboard: '/csg',
                        projects: '/csg/projects',
                        ledger: '/csg/ledger',
                        proof: '/csg/proof',
                        meetings: '/csg/meetings',
                        ratings: '/csg/ratings',
                        'performance-panel': '/csg/performance-panel',
                        profile: '/csg/profile',
                      };
                      const url = map[item.id] || '/csg';
                      router.visit(url);
                      return null;
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
          </ul>
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          {/* Switch Role Button */}
          {onSwitchRole && userData?.canSwitch && (
            <div className="mb-2">
              <p className="text-xs text-gray-500 px-4 mb-2">Switch Role</p>
              <button
                onClick={onSwitchRole}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 rounded-xl transition-all shadow-md"
              >
                <Repeat className="w-5 h-5" />
                <span className="text-sm">Switch to Student View</span>
              </button>
            </div>
          )}
          
          <div className="flex items-center gap-3 px-4 py-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md text-white text-xs">CO</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm text-gray-900">CSG Officer</p>
              <p className="text-xs text-gray-500">officer@step.edu</p>
            </div>
          </div>
          <form method="POST" action="/logout" className="w-full">
            <input type="hidden" name="_token" value={csrfToken} />
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Online Officers Modal */}
      <Dialog open={isOnlineModalOpen} onOpenChange={setIsOnlineModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <DialogTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                CSG Officers Status
              </DialogTitle>
              <button
                type="button"
                onClick={() => setIsOnlineModalOpen(false)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </DialogHeader>
          
          <div className="space-y-1">
            {/* Online Officers Section */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2 px-2">● Online ({onlineOfficers.filter(o => o.status === 'online').length})</p>
              {onlineOfficers.filter(o => o.status === 'online').map((officer) => (
                <div 
                  key={officer.id} 
                  className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl transition-colors"
                >
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-blue-600 text-white text-xs">
                        {officer.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{officer.name}</p>
                    <p className="text-xs text-gray-500">{officer.position}</p>
                  </div>
                  <span className="text-xs text-green-600 font-medium">{officer.lastSeen}</span>
                </div>
              ))}
            </div>

            {/* Idle Officers Section */}
            {onlineOfficers.filter(o => o.status === 'idle').length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2 px-2">⏸ Idle ({onlineOfficers.filter(o => o.status === 'idle').length})</p>
                {onlineOfficers.filter(o => o.status === 'idle').map((officer) => (
                  <div 
                    key={officer.id} 
                    className="flex items-center gap-3 p-3 hover:bg-yellow-50 rounded-xl transition-colors"
                  >
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-yellow-500 text-white text-xs">
                          {officer.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{officer.name}</p>
                      <p className="text-xs text-gray-500">{officer.position}</p>
                    </div>
                    <span className="text-xs text-gray-400">{officer.lastSeen}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Offline Officers Section */}
            {onlineOfficers.filter(o => o.status === 'offline').length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-2 px-2">○ Offline ({onlineOfficers.filter(o => o.status === 'offline').length})</p>
                {onlineOfficers.filter(o => o.status === 'offline').map((officer) => (
                  <div 
                    key={officer.id} 
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gray-400 text-white text-xs">
                          {officer.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-400 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">{officer.name}</p>
                      <p className="text-xs text-gray-400">{officer.position}</p>
                    </div>
                    <span className="text-xs text-gray-400">{officer.lastSeen}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Stats */}
          <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Total CSG Officers:</span>
              <span className="font-medium text-gray-900">{onlineOfficers.length}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}