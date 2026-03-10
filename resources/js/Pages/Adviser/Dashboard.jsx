import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Card } from '../../Components/ui/card';
import { CheckSquare, Clock, AlertCircle, TrendingUp, FileText, CheckCircle2 } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

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

// Placeholder sub-pages (project can replace with full implementations)
function ApprovalCenterPage() { return <Card className="p-8">Approval Center (placeholder)</Card>; }
function RatingsAnalyticsPage() { return <Card className="p-8"> Analytics (placeholder)</Card>; }
function OrganizationsPage() { return <Card className="p-8">Organizations / CSG Overview (placeholder)</Card>; }
function SystemLogsPage() { return <Card className="p-8">System Logs (placeholder)</Card>; }
function AdminProfilePage() { return <Card className="p-8">Profile (placeholder)</Card>; }
function LedgerOversightPage() { return <Card className="p-8">Ledger Oversight (placeholder)</Card>; }
function RolePermissionsPage() { return <Card className="p-8">Role & Permissions (placeholder)</Card>; }

export function AdminAdviserDashboard({ currentView, onNavigate }) {
  // Simple subcomponents to mirror the STEP AdminAdviser layout
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

  function ApprovalItem({ item }) {
    return (
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
            <FileText className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm text-gray-900">{item.title}</p>
              <Badge variant={item.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                {item.type}
              </Badge>
            </div>
            <p className="text-xs text-gray-500">Submitted by {item.submittedBy} • {item.time}</p>
          </div>
        </div>
        {item.amount && <p className="text-sm text-gray-900">{item.amount}</p>}
      </div>
    );
  }

  // Route other subpages to their components if requested
  if (['approvals', 'ledger-verification', 'project-verification', 'meeting-minutes'].includes(currentView)) {
    return <ApprovalCenterPage />;
  }

  if (currentView === 'ledger-view') return <LedgerOversightPage />;
  if (currentView === 'feedback-review') return <RolePermissionsPage />;
  if (currentView === 'ratings-analytics') return <RatingsAnalyticsPage />;
  if (currentView === 'organizations') return <OrganizationsPage />;
  if (currentView === 'system-logs') return <SystemLogsPage />;
  if (currentView === 'profile') return <AdminProfilePage />;

  // Default dashboard view
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-gray-900 text-2xl font-semibold">Admin/Adviser Dashboard</h1>
        <p className="text-gray-500">Approvals, verification, and oversight</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Pending Approvals" value="8" hint="Requires attention" icon={<Clock />} iconBg="bg-orange-50" iconColor="text-orange-600" />
        <StatsCard title="Approved Today" value="24" hint="↑ 15% from yesterday" icon={<CheckCircle2 />} iconBg="bg-green-50" iconColor="text-green-600" />
        <StatsCard title="Avg. Rating" value="4.7" hint="CSG Performance" icon={<TrendingUp />} iconBg="bg-blue-50" iconColor="text-blue-600" />
        <StatsCard title="System Alerts" value="2" hint="Review required" icon={<AlertCircle />} iconBg="bg-red-50" iconColor="text-red-600" />
      </div>

      <Card className="p-6 rounded-2xl border-0 shadow-sm bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-900">Pending Approvals</h2>
          <button onClick={() => Inertia.visit('/adviser/approvals')} className="text-sm text-[#2563EB] hover:underline">View All</button>
        </div>

        <div className="space-y-3">
          {[
            { type: 'Ledger Entry', title: 'Sports Fest Equipment Purchase', amount: '₱15,450.00', submittedBy: 'John Doe', time: '2 hours ago', priority: 'high' },
            { type: 'Project Verification', title: 'Community Outreach Program', amount: '₱25,000.00', submittedBy: 'Jane Smith', time: '5 hours ago', priority: 'medium' },
            { type: 'Meeting Minutes', title: 'General Assembly - October 2024', amount: null, submittedBy: 'Mike Johnson', time: '1 day ago', priority: 'low' },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200 shadow-sm">
                  <FileText className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm text-gray-900">{item.title}</p>
                    <Badge variant={item.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                      {item.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">Submitted by {item.submittedBy} • {item.time}</p>
                </div>
              </div>
              {item.amount && <p className="text-sm text-gray-900">{item.amount}</p>}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 rounded-2xl border-0 shadow-sm bg-white">
          <h2 className="text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button onClick={() => Inertia.visit('/adviser/ledger')} className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 shadow-sm transition-colors text-left">
              <div className="flex items-center gap-3"><CheckSquare className="w-5 h-5 text-[#2563EB]" /><span className="text-sm text-gray-900">Verify Ledger Entries</span></div>
              <Badge variant="secondary">5</Badge>
            </button>

            <button onClick={() => Inertia.visit('/adviser/approvals')} className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 shadow-sm transition-colors text-left">
              <div className="flex items-center gap-3"><CheckSquare className="w-5 h-5 text-[#2563EB]" /><span className="text-sm text-gray-900">Approve Projects</span></div>
              <Badge variant="secondary">2</Badge>
            </button>

            <button onClick={() => Inertia.visit('/adviser/approvals?tab=meetings')} className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 shadow-sm transition-colors text-left">
              <div className="flex items-center gap-3"><CheckSquare className="w-5 h-5 text-[#2563EB]" /><span className="text-sm text-gray-900">Review Meeting Minutes</span></div>
              <Badge variant="secondary">1</Badge>
            </button>
          </div>
        </Card>

        <Card className="p-6 rounded-2xl border-0 shadow-sm bg-white">
          <h2 className="text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[{ action: 'Approved ledger entry', time: '10 minutes ago', status: 'approved' }, { action: 'Rejected project status change', time: '1 hour ago', status: 'rejected' }, { action: 'Verified meeting minutes', time: '3 hours ago', status: 'approved' }].map((activity, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${activity.status === 'approved' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div className="flex-1"><p className="text-sm text-gray-900">{activity.action}</p><p className="text-xs text-gray-500">{activity.time}</p></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// Provide a default export so Inertia's page resolver receives a component (not a module object)
// Page wrapper that provides the authenticated layout (sidebar + header)
export default function AdviserDashboardPage(props) {
  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Admin/Adviser Dashboard</h2>}>
      <Head title="Adviser" />

      <div className="py-8">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <AdminAdviserDashboard {...props} />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}