import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import {
  Search,
  Filter,
  Download,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

// Badge component
function Badge({ children, className = '' }) {
  return (
    <span className={['inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', className].join(' ')}>
      {children}
    </span>
  );
}

// Select component
function Select({ value, onValueChange, children, className = '' }) {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={['w-full px-3 py-2 border border-gray-200 rounded-xl bg-white', className].join(' ')}
    >
      {children}
    </select>
  );
}

function SelectItem({ value, children }) {
  return <option value={value}>{children}</option>;
}

// Table components
function Table({ children }) {
  return (
    <table className="w-full border-collapse">
      {children}
    </table>
  );
}

function TableHeader({ children }) {
  return <thead>{children}</thead>;
}

function TableBody({ children }) {
  return <tbody>{children}</tbody>;
}

function TableRow({ children, className = '' }) {
  return <tr className={['border-b border-gray-200', className].join(' ')}>{children}</tr>;
}

function TableHead({ children }) {
  return <th className="text-left py-3 px-4 font-semibold text-gray-900">{children}</th>;
}

function TableCell({ children, className = '' }) {
  return <td className={['py-3 px-4 text-sm', className].join(' ')}>{children}</td>;
}

const mockLogs = [
  {
    id: 1,
    timestamp: '2024-11-20 14:35:22',
    user: 'Sarah Chen',
    role: 'CSG Officer',
    action: 'Created project "Mental Health Awareness Week"',
    module: 'Project',
    status: 'Success',
    ipAddress: '192.168.1.105'
  },
  {
    id: 2,
    timestamp: '2024-11-20 14:28:15',
    user: 'Admin User',
    role: 'Admin',
    action: 'Approved ledger entry TXN-2024-003',
    module: 'Ledger',
    status: 'Success',
    ipAddress: '192.168.1.100'
  },
  {
    id: 3,
    timestamp: '2024-11-20 14:20:45',
    user: 'Michael Torres',
    role: 'CSG Officer',
    action: 'Uploaded proof document PROOF-004',
    module: 'Proof',
    status: 'Success',
    ipAddress: '192.168.1.108'
  },
  {
    id: 4,
    timestamp: '2024-11-20 14:15:30',
    user: 'Emma Johnson',
    role: 'Student',
    action: 'Rated project "Community Outreach Program"',
    module: 'Project',
    status: 'Success',
    ipAddress: '192.168.1.210'
  },
  {
    id: 5,
    timestamp: '2024-11-20 14:10:18',
    user: 'Admin User',
    role: 'Admin',
    action: 'Rejected project "Gaming Tournament"',
    module: 'Project',
    status: 'Warning',
    ipAddress: '192.168.1.100',
    details: 'Insufficient budget justification'
  },
  {
    id: 6,
    timestamp: '2024-11-20 14:05:42',
    user: 'Sarah Chen',
    role: 'CSG Officer',
    action: 'Attempted to delete approved ledger entry',
    module: 'Ledger',
    status: 'Failed',
    ipAddress: '192.168.1.105',
    details: 'Cannot modify approved entries'
  },
  {
    id: 7,
    timestamp: '2024-11-20 13:58:30',
    user: 'James Smith',
    role: 'Student',
    action: 'Unlocked badge "Active Reviewer"',
    module: 'System',
    status: 'Success',
    ipAddress: '192.168.1.215'
  },
  {
    id: 8,
    timestamp: '2024-11-20 13:45:12',
    user: 'Michael Torres',
    role: 'CSG Officer',
    action: 'Created meeting "Budget Planning Session"',
    module: 'Meeting',
    status: 'Success',
    ipAddress: '192.168.1.108'
  },
  {
    id: 9,
    timestamp: '2024-11-20 13:30:55',
    user: 'Admin User',
    role: 'Admin',
    action: 'Approved proof document PROOF-002',
    module: 'Proof',
    status: 'Success',
    ipAddress: '192.168.1.100'
  },
  {
    id: 10,
    timestamp: '2024-11-20 13:22:08',
    user: 'Super Admin',
    role: 'Superadmin',
    action: 'Updated system engagement rules',
    module: 'System',
    status: 'Success',
    ipAddress: '192.168.1.10'
  }
];

const ROWS_PER_PAGE = 5;

export function SystemLogsPage() {
  const [logs] = useState(mockLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModule, setFilterModule] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule = filterModule === 'all' || log.module === filterModule;
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    const matchesRole = filterRole === 'all' || log.role === filterRole;
    return matchesSearch && matchesModule && matchesStatus && matchesRole;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Success':
        return 'bg-green-100 text-green-700';
      case 'Failed':
        return 'bg-red-100 text-red-700';
      case 'Warning':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'Warning':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Superadmin':
        return 'bg-purple-100 text-purple-700';
      case 'Admin':
        return 'bg-blue-100 text-blue-700';
      case 'CSG Officer':
        return 'bg-green-100 text-green-700';
      case 'Student':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const successCount = logs.filter(l => l.status === 'Success').length;
  const failedCount = logs.filter(l => l.status === 'Failed').length;
  const warningCount = logs.filter(l => l.status === 'Warning').length;

  // Pagination logic
  const totalPages = Math.ceil(filteredLogs.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const endIndex = startIndex + ROWS_PER_PAGE;
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterModule, filterStatus, filterRole, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">System Logs</h1>
          <p className="text-gray-500">Monitor all system activities and user actions</p>
        </div>
        <Button variant="outline" className="rounded-xl">
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="rounded-[20px] p-4 border-0 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Logs</p>
              <p className="text-2xl text-gray-900">{logs.length}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="rounded-[20px] p-4 border-0 shadow-sm bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Success</p>
              <p className="text-2xl text-green-900">{successCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card className="rounded-[20px] p-4 border-0 shadow-sm bg-yellow-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700">Warnings</p>
              <p className="text-2xl text-yellow-900">{warningCount}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
        </Card>

        <Card className="rounded-[20px] p-4 border-0 shadow-sm bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700">Failed</p>
              <p className="text-2xl text-red-900">{failedCount}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="rounded-[20px] border-0 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-gray-900">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-200 outline-none transition"
            />
          </div>

          {/* Module Filter */}
          <Select 
          className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-200 outline-none transition"
          value={filterModule} onValueChange={setFilterModule}>
            <SelectItem value="all">All Modules</SelectItem>
            <SelectItem value="Project">Project</SelectItem>
            <SelectItem value="Ledger">Ledger</SelectItem>
            <SelectItem value="Proof">Proof</SelectItem>
            <SelectItem value="Meeting">Meeting</SelectItem>
            <SelectItem value="User">User</SelectItem>
            <SelectItem value="System">System</SelectItem>
          </Select>

          {/* Status Filter */}
          <Select 
          className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-200 outline-none transition" 
          value={filterStatus} onValueChange={setFilterStatus}>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Success">Success</SelectItem>
            <SelectItem value="Warning">Warning</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
          </Select>

          {/* Role Filter */}
          <Select 
          className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-200 outline-none transition" 
            value={filterRole} onValueChange={setFilterRole}>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="Superadmin">Superadmin</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="CSG Officer">CSG Officer</SelectItem>
            <SelectItem value="Student">Student</SelectItem>
          </Select>
        </div>
      </Card>

      {/* Logs Table - Desktop */}
      <Card className="rounded-[20px] border-0 shadow-sm p-6 hidden md:block">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-50">
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLogs.map((log) => (
                <TableRow key={log.id} className="hover:bg-gray-50">
                  <TableCell className="font-mono text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {log.timestamp}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-900">{log.user}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(log.role)}>
                      {log.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div>
                      <p className="text-sm text-gray-900">{log.action}</p>
                      {log.details && (
                        <p className="text-xs text-gray-500 mt-1">{log.details}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.module}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(log.status)}
                      <Badge className={getStatusColor(log.status)}>
                        {log.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-gray-600">
                    {log.ipAddress}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 rounded-[20px] border-0 shadow-sm bg-white">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredLogs.length)} of {filteredLogs.length} logs
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm"
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Logs Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {filteredLogs.map((log) => (
          <Card key={log.id} className="rounded-[20px] border-0 shadow-sm p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(log.status)}
                  <Badge className={getStatusColor(log.status)}>
                    {log.status}
                  </Badge>
                </div>
                <Badge className={getRoleBadgeColor(log.role)}>
                  {log.role}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-gray-900 mb-1">{log.action}</p>
                {log.details && (
                  <p className="text-xs text-gray-500">{log.details}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{log.user}</span>
                <Badge variant="outline">{log.module}</Badge>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                <span className="font-mono">{log.timestamp}</span>
                <span className="font-mono">{log.ipAddress}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredLogs.length === 0 && (
        <Card className="rounded-[20px] border-0 shadow-sm p-12 text-center">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">No logs found</h3>
          <p className="text-gray-600">Try adjusting your filters</p>
        </Card>
      )}
    </div>
  );
}

export default function AdviserSystemLogsPage() {
  return (
    <AuthenticatedLayout>
      <Head title="System Logs" />
      <div className="py-8">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <SystemLogsPage />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
