import React from 'react';
import { router } from '@inertiajs/react';
import { Card } from '@/Components/ui/card';
import { FolderKanban, Calendar, DollarSign, Star, Users, Plus } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
// import CSGProjectsPage from '/Projects';

// Small inline Badge component (keeps this file self-contained)
function Badge({ children, variant = 'secondary', className = '' }) {
  const base = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium';
  const variants = {
    destructive: 'bg-red-100 text-red-700',
    secondary: 'bg-gray-100 text-gray-700',
  };
  return (
    <span className={`${base} ${variants[variant] || variants.secondary} ${className}`}>
      {children}
    </span>
  );
}

// Placeholder sub-pages
function CSGLedgerPage() { return <Card className="p-8">Ledger (placeholder)</Card>; }
function CSGProofPage() { return <Card className="p-8">Proof (placeholder)</Card>; }
function CSGMeetingsPage() { return <Card className="p-8">Meetings (placeholder)</Card>; }
function CSGRatingsPage() { return <Card className="p-8">Ratings (placeholder)</Card>; }
function CSGPerformancePage() { return <Card className="p-8">Performance (placeholder)</Card>; }
function CSGProfilePage() { return <Card className="p-8">Profile (placeholder)</Card>; }

export function CSGOfficerDashboard({ currentView, onNavigate }) {

  function StatsCard({ title, value, hint, icon, iconBg = 'bg-gray-100', iconColor = 'text-gray-700' }) {
    return (
      <Card className="p-6 rounded-[20px] border-0 shadow-sm bg-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl text-gray-900 mt-1">{value}</p>
            {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
          </div>
          <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center`}>
            {icon && React.cloneElement(icon, { className: `w-6 h-6 ${iconColor}` })}
          </div>
        </div>
      </Card>
    );
  }

  // Subpage routing
  if (currentView === 'projects') return <CSGProjectsPage />;
  if (currentView === 'ledger') return <CSGLedgerPage />;
  if (currentView === 'proof') return <CSGProofPage />;
  if (currentView === 'meetings') return <CSGMeetingsPage />;
  if (currentView === 'ratings') return <CSGRatingsPage />;
  if (currentView === 'performance-panel') return <CSGPerformancePage />;
  if (currentView === 'profile') return <CSGProfilePage />;

  // Default dashboard view
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-2xl font-semibold">CSG Officer Dashboard</h1>
          <p className="text-gray-500">Manage projects, ledger, and student engagement</p>
        </div>
        <div className="hidden md:flex gap-3">
          <button
            onClick={() => Inertia.visit('/officer/projects/create')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
          <button
            onClick={() => Inertia.visit('/officer/ledger/create')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm rounded-xl transition-colors"
          >
            <DollarSign className="w-4 h-4" />
            Add Entry
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Active Projects" value="12" hint="3 pending approval" icon={<FolderKanban />} iconBg="bg-blue-50" iconColor="text-blue-600" />
        <StatsCard title="Budget Balance" value="₱45.2K" hint="72% of total budget" icon={<DollarSign />} iconBg="bg-green-50" iconColor="text-green-600" />
        <StatsCard title="Avg. Rating" value="4.5" hint="★★★★☆ (245 ratings)" icon={<Star />} iconBg="bg-yellow-50" iconColor="text-yellow-600" />
        <StatsCard title="Student Engagement" value="87%" hint="↑ 8% from last month" icon={<Users />} iconBg="bg-purple-50" iconColor="text-purple-600" />
      </div>

      {/* Active Projects */}
      <Card className="p-6 rounded-2xl border-0 shadow-sm bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-900">Active Projects</h2>
          <button onClick={() => onNavigate('projects')} className="text-sm text-blue-600 hover:underline">View All</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Community Outreach Program', status: 'In Progress', budget: '₱25,000', spent: '₱18,500', progress: 74, deadline: 'Dec 15, 2024' },
            { title: 'Annual Sports Fest', status: 'Planning', budget: '₱35,000', spent: '₱5,200', progress: 15, deadline: 'Jan 20, 2025' },
          ].map((project, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-900">{project.title}</p>
                  <p className="text-xs text-gray-500 mt-1">Due: {project.deadline}</p>
                </div>
                <Badge variant="secondary" className="text-xs">{project.status}</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Progress</span>
                  <span className="text-gray-900">{project.progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${project.progress}%` }}></div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Budget: {project.spent} / {project.budget}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Ledger & Upcoming Meetings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 rounded-2xl border-0 shadow-sm bg-white">
          <h2 className="text-gray-900 mb-4">Recent Ledger Entries</h2>
          <div className="space-y-3">
            {[
              { desc: 'Sports Equipment Purchase', amount: '-₱15,450', status: 'Pending', type: 'expense' },
              { desc: 'Student Council Fund', amount: '+₱50,000', status: 'Verified', type: 'income' },
              { desc: 'Event Supplies', amount: '-₱8,250', status: 'Verified', type: 'expense' },
            ].map((entry, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${entry.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                    <DollarSign className={`w-4 h-4 ${entry.type === 'income' ? 'text-green-600' : 'text-red-600'}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">{entry.desc}</p>
                    <p className="text-xs text-gray-500">{entry.status}</p>
                  </div>
                </div>
                <p className={`text-sm ${entry.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{entry.amount}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 rounded-2xl border-0 shadow-sm bg-white">
          <h2 className="text-gray-900 mb-4">Upcoming Meetings</h2>
          <div className="space-y-3">
            {[
              { title: 'General Assembly', date: 'Nov 28, 2024', time: '2:00 PM', attendees: 250 },
              { title: 'Budget Planning Session', date: 'Dec 2, 2024', time: '10:00 AM', attendees: 15 },
              { title: 'Project Review Meeting', date: 'Dec 5, 2024', time: '3:00 PM', attendees: 30 },
            ].map((meeting, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{meeting.title}</p>
                  <p className="text-xs text-gray-500">{meeting.date} • {meeting.time}</p>
                  <p className="text-xs text-gray-400 mt-1">{meeting.attendees} expected attendees</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// Default export — Inertia page wrapper with AuthenticatedLayout
export default function CSGOfficerDashboardPage(props) {
  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">CSG Officer Dashboard</h2>}>
      <Head title="CSG Officer" />

      <div className="py-8 px-4 lg:px-0 md:px-0">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <CSGOfficerDashboard {...props} />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}