import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
  FileText,
  Download,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Hash,
  Clock,
  RotateCcw,
  Search,
  TrendingUp,
  TrendingDown,
  Activity,
  FileCheck,
} from 'lucide-react';

// Simple toast (unchanged)
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

// Modal (your improved version with portal, scroll lock, backdrop click)
function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (open) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [open]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-2xl shadow-lg flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <div className="overflow-y-auto p-6 pt-0">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function LedgerApprovalsPage() {
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isCorrectionDialogOpen, setIsCorrectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [correctionReason, setCorrectionReason] = useState('');
  const [activeTab, setActiveTab] = useState('ledger'); // 'ledger' or 'audit'

  // Filters
  const [filterProject, setFilterProject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock ledger data (unchanged)
  const [ledgerEntries, setLedgerEntries] = useState([
    {
      id: 'LED001',
      ledgerHash: 'a7f3c8e2d1b4f6a9c5e8d2f1a3b6c9e4d7f2a5b8c1e4d7f0a3b6c9e2d5f8a1b4',
      predecessorHash: 'b3e6f1a9d2c5e8b4f7a0c3e6d9f2a5b8c1e4d7f0a3b6c9e2d5f8a1b4c7e0f3a6',
      projectName: 'Annual Science Fair',
      enteredBy: 'John Doe',
      role: 'Treasurer',
      amount: 3500,
      transactionType: 'Expense',
      category: 'Academic Events',
      description: 'Purchase of science fair equipment including microscopes, lab materials, and display boards',
      date: '2026-02-15',
      status: 'Pending',
      proofAttached: true,
      proofFiles: [
        { id: '1', name: 'purchase_invoice.pdf', hash: 'f2a5b8c1e4d7f0a3b6c9e2d5f8a1b4c7', url: '#' },
        { id: '2', name: 'supplier_receipt.pdf', hash: 'e4d7f0a3b6c9e2d5f8a1b4c7e0f3a6b9', url: '#' }
      ],
      verificationState: { submitted: '2026-02-15 09:30 AM' }
    },
    {
      id: 'LED002',
      ledgerHash: 'c9f2e5a8b1d4e7f0a3b6c9e2d5f8a1b4c7e0f3a6b9d2e5f8a1b4c7e0f3a6b9d2',
      predecessorHash: 'a7f3c8e2d1b4f6a9c5e8d2f1a3b6c9e4d7f2a5b8c1e4d7f0a3b6c9e2d5f8a1b4',
      projectName: 'Sports Fest 2026',
      enteredBy: 'Jane Smith',
      role: 'President',
      amount: 12500,
      transactionType: 'Income',
      category: 'Fundraising',
      description: 'Sponsorship from Alumni Association for Sports Fest 2026',
      date: '2026-02-12',
      status: 'Approved',
      proofAttached: true,
      proofFiles: [
        { id: '3', name: 'sponsorship_agreement.pdf', hash: 'd5f8a1b4c7e0f3a6b9d2e5f8a1b4c7e0', url: '#' }
      ],
      verificationState: {
        submitted: '2026-02-12 02:15 PM',
        reviewed: '2026-02-13 10:00 AM',
        approvedRejected: '2026-02-13 10:30 AM'
      }
    },
    {
      id: 'LED003',
      ledgerHash: 'e1d4f7a0b3c6e9f2a5b8d1e4f7a0c3e6d9f2a5b8c1e4d7f0a3b6c9e2d5f8a1b4',
      predecessorHash: 'c9f2e5a8b1d4e7f0a3b6c9e2d5f8a1b4c7e0f3a6b9d2e5f8a1b4c7e0f3a6b9d2',
      projectName: 'Community Outreach',
      enteredBy: 'Mike Johnson',
      role: 'Secretary',
      amount: 2800,
      transactionType: 'Expense',
      category: 'Community Service',
      description: 'Food packages and educational materials for outreach program',
      date: '2026-02-10',
      status: 'Rejected',
      proofAttached: false,
      proofFiles: [],
      verificationState: {
        submitted: '2026-02-10 03:45 PM',
        reviewed: '2026-02-11 09:00 AM',
        approvedRejected: '2026-02-11 09:15 AM'
      }
    },
    {
      id: 'LED004',
      ledgerHash: 'f3a6b9c2d5e8f1a4b7c0d3e6f9a2b5c8d1e4f7a0b3c6e9f2a5b8d1e4f7a0c3e6',
      predecessorHash: 'e1d4f7a0b3c6e9f2a5b8d1e4f7a0c3e6d9f2a5b8c1e4d7f0a3b6c9e2d5f8a1b4',
      projectName: 'Cultural Festival',
      enteredBy: 'Sarah Williams',
      role: 'Treasurer',
      amount: 5200,
      transactionType: 'Expense',
      category: 'Cultural Events',
      description: 'Stage setup, sound system rental, and performer fees for Cultural Festival',
      date: '2026-02-08',
      status: 'Corrected',
      proofAttached: true,
      proofFiles: [
        { id: '4', name: 'rental_contract.pdf', hash: 'a1b4c7e0f3a6b9d2e5f8a1b4c7e0f3a6', url: '#' }
      ],
      verificationState: {
        submitted: '2026-02-08 11:20 AM',
        reviewed: '2026-02-09 01:00 PM',
        corrected: '2026-02-09 02:30 PM'
      },
      correctionReason: 'Amount was incorrectly entered as 5200 instead of 5600. Original entry reversed and corrected.'
    }
  ]);

  // Mock audit trail
  const auditTrail = [
    { id: '1', action: 'Ledger Entry Approved', performedBy: 'Dr. Maria Santos', role: 'Adviser', timestamp: '2026-02-13 10:30 AM', ipAddress: '192.168.1.45', details: 'LED002 - Sports Fest 2026 Sponsorship' },
    { id: '2', action: 'Ledger Entry Rejected', performedBy: 'Dr. Maria Santos', role: 'Adviser', timestamp: '2026-02-11 09:15 AM', ipAddress: '192.168.1.45', details: 'LED003 - Missing proof documentation' },
    { id: '3', action: 'Correction Applied', performedBy: 'Dr. Maria Santos', role: 'Adviser', timestamp: '2026-02-09 02:30 PM', ipAddress: '192.168.1.45', details: 'LED004 - Amount correction from ₱5,200 to ₱5,600' },
    { id: '4', action: 'Ledger Entry Created', performedBy: 'John Doe', role: 'Treasurer', timestamp: '2026-02-15 09:30 AM', ipAddress: '10.0.0.122', details: 'LED001 - Annual Science Fair equipment purchase' }
  ];

  // Statistics
  const stats = {
    totalIncome: ledgerEntries.filter(e => e.transactionType === 'Income').reduce((sum, e) => sum + e.amount, 0),
    totalExpenses: ledgerEntries.filter(e => e.transactionType === 'Expense').reduce((sum, e) => sum + e.amount, 0),
    pendingApprovals: ledgerEntries.filter(e => e.status === 'Pending').length,
    correctionCount: ledgerEntries.filter(e => e.status === 'Corrected').length
  };

  const handleViewDetails = (entry) => {
    setSelectedEntry(entry);
    setIsDetailsOpen(true);
  };

  const handleApprove = (entry) => {
    setLedgerEntries(entries =>
      entries.map(e =>
        e.id === entry.id
          ? {
              ...e,
              status: 'Approved',
              verificationState: {
                ...e.verificationState,
                reviewed: new Date().toLocaleString(),
                approvedRejected: new Date().toLocaleString()
              }
            }
          : e
      )
    );
    showToast('Ledger entry approved');
    setIsDetailsOpen(false);
  };

  const handleReject = () => {
    if (!selectedEntry || !rejectionReason.trim()) {
      showToast('Please provide a rejection reason', 'error');
      return;
    }
    setLedgerEntries(entries =>
      entries.map(e =>
        e.id === selectedEntry.id
          ? {
              ...e,
              status: 'Rejected',
              correctionReason: rejectionReason,
              verificationState: {
                ...e.verificationState,
                reviewed: new Date().toLocaleString(),
                approvedRejected: new Date().toLocaleString()
              }
            }
          : e
      )
    );
    showToast('Ledger entry rejected', 'error');
    setRejectionReason('');
    setIsRejectDialogOpen(false);
    setIsDetailsOpen(false);
  };

  const handleCorrection = () => {
    if (!selectedEntry || !correctionReason.trim()) {
      showToast('Please provide a correction reason', 'error');
      return;
    }
    setLedgerEntries(entries =>
      entries.map(e =>
        e.id === selectedEntry.id
          ? {
              ...e,
              status: 'Corrected',
              correctionReason,
              verificationState: {
                ...e.verificationState,
                corrected: new Date().toLocaleString()
              }
            }
          : e
      )
    );
    showToast('Correction applied');
    setCorrectionReason('');
    setIsCorrectionDialogOpen(false);
    setIsDetailsOpen(false);
  };

  const getStatusBadge = (status) => {
    const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
    switch (status) {
      case 'Approved': return <span className={`${baseClasses} bg-green-100 text-green-700`}>Approved</span>;
      case 'Pending': return <span className={`${baseClasses} bg-yellow-100 text-yellow-700`}>Pending</span>;
      case 'Rejected': return <span className={`${baseClasses} bg-red-100 text-red-700`}>Rejected</span>;
      case 'Corrected': return <span className={`${baseClasses} bg-purple-100 text-purple-700`}>Corrected</span>;
      default: return null;
    }
  };

  // Filter logic
  const filteredEntries = ledgerEntries.filter(entry => {
    if (filterProject !== 'all' && entry.projectName !== filterProject) return false;
    if (filterStatus !== 'all' && entry.status !== filterStatus) return false;
    if (searchQuery && !entry.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Export CSV
  const handleExport = () => {
    const headers = ['Ledger ID', 'Project', 'Entered By', 'Amount', 'Type', 'Date', 'Status', 'SHA256 Hash'];
    const csvData = filteredEntries.map(entry => [
      entry.id,
      entry.projectName,
      entry.enteredBy,
      entry.amount,
      entry.transactionType,
      entry.date,
      entry.status,
      entry.ledgerHash
    ]);
    const csvContent = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ledger_entries_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV file downloaded');
  };

  return (
    <AuthenticatedLayout>
      <Head title="Ledger" />
      <div className="py-8">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Ledger Approval Center</h1>
            <p className="text-gray-500">Review and verify financial ledger entries</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* ... (unchanged) */}
            <div className="p-6 rounded-[20px] border-0 shadow-sm bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Income</p>
                  <p className="text-2xl text-green-600 mt-1">₱{stats.totalIncome.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <p className="text-xs text-green-600">Verified</p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="p-6 rounded-[20px] border-0 shadow-sm bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Expenses</p>
                  <p className="text-2xl text-red-600 mt-1">₱{stats.totalExpenses.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingDown className="w-3 h-3 text-red-600" />
                    <p className="text-xs text-red-600">Tracked</p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
            <div className="p-6 rounded-[20px] border-0 shadow-sm bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending Approvals</p>
                  <p className="text-2xl text-gray-900 mt-1">{stats.pendingApprovals}</p>
                  <p className="text-xs text-orange-600 mt-1">Requires action</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
            <div className="p-6 rounded-[20px] border-0 shadow-sm bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Correction Count</p>
                  <p className="text-2xl text-gray-900 mt-1">{stats.correctionCount}</p>
                  <p className="text-xs text-purple-600 mt-1">Audit trail maintained</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <RotateCcw className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('ledger')}
              className={`pb-3 px-2 text-sm font-medium transition-colors ${
                activeTab === 'ledger'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Ledger Entries
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`pb-3 px-2 text-sm font-medium transition-colors ${
                activeTab === 'audit'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Audit Trail
            </button>
          </div>

          {activeTab === 'ledger' ? (
            <>
              {/* Filters */}
              <div className="p-4 rounded-[20px] border-0 shadow-sm bg-white">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-10 pl-9 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-200 outline-none transition"
                    />
                  </div>

                  <select
                    value={filterProject}
                    onChange={(e) => setFilterProject(e.target.value)}
                    className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-200 outline-none transition"
                  >
                    <option value="all">All Projects</option>
                    <option value="Annual Science Fair">Annual Science Fair</option>
                    <option value="Sports Fest 2026">Sports Fest 2026</option>
                    <option value="Community Outreach">Community Outreach</option>
                    <option value="Cultural Festival">Cultural Festival</option>
                  </select>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-200 outline-none transition"
                  >
                    <option value="all">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Corrected">Corrected</option>
                  </select>

                  <button
                    onClick={handleExport}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Ledger Table (matches image) */}
              <div className="rounded-[20px] border-0 shadow-sm bg-white overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ledger ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entered By</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proof</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredEntries.map((entry) => (
                        <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Hash className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-blue-600">{entry.id}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="text-sm text-gray-900">{entry.projectName}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {/* Only name, no role – matches image */}
                            <p className="text-sm text-gray-900">{entry.enteredBy}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className={`text-sm ${entry.transactionType === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                              {entry.transactionType === 'Income' ? '+' : '-'}₱{entry.amount.toLocaleString()}
                            </p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              entry.transactionType === 'Income' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                              {entry.transactionType}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="text-sm text-gray-600">{new Date(entry.date).toLocaleDateString()}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(entry.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              {entry.proofAttached ? (
                                <>
                                  <FileCheck className="w-4 h-4 text-green-600" />
                                  <span className="text-xs text-green-600">{entry.proofFiles.length}</span>
                                </>
                              ) : (
                                <>
                                  <AlertTriangle className="w-4 h-4 text-red-600" />
                                  <span className="text-xs text-red-600">Missing</span>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleViewDetails(entry)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                            >
                              <Eye className="w-4 h-4" /> View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            /* Audit Trail Tab (unchanged) */
            <div className="rounded-[20px] border-0 shadow-sm bg-white overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-gray-900 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  System Audit Trail
                </h2>
                <p className="text-sm text-gray-500 mt-1">Complete history of ledger actions</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performed By</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {auditTrail.map((entry) => (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.action}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.performedBy}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                            {entry.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{entry.timestamp}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">{entry.ipAddress}</code>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{entry.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal (unchanged) */}
      <Modal open={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} title="Ledger Entry Details">
        {selectedEntry && (
          <div className="space-y-6 pt-4">
            {/* Basic Info */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-3">Basic Information</h4>
              <div className="space-y-3 pt-3">
                <div>
                  <p className="text-xs text-gray-500">Ledger ID</p>
                  <p className="text-sm text-blue-600">{selectedEntry.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Ledger Hash (SHA256)</p>
                  <code className="text-xs bg-blue-50 px-2 py-1 rounded block break-all">{selectedEntry.ledgerHash}</code>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Predecessor Hash</p>
                  <code className="text-xs bg-gray-50 px-2 py-1 rounded block break-all">{selectedEntry.predecessorHash}</code>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Entered By</p>
                    <p className="text-sm">{selectedEntry.enteredBy}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Role</p>
                    <p className="text-sm">{selectedEntry.role}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Data */}
            <div className="border-t pt-6">
              <h4 className="text-sm font-medium text-gray-500 mb-3">Financial Data</h4>
              <div className="space-y-3 pt-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className={`text-xl ${selectedEntry.transactionType === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                      ₱{selectedEntry.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Type</p>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      selectedEntry.transactionType === 'Income' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {selectedEntry.transactionType}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="text-sm">{selectedEntry.category}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Description</p>
                  <p className="text-sm text-gray-700">{selectedEntry.description}</p>
                </div>
              </div>
            </div>

            {/* Proof Documents */}
            <div className="border-t pt-6">
              <h4 className="text-sm font-medium text-gray-500 mb-3">Proof Documents</h4>
              {selectedEntry.proofAttached ? (
                <div className="space-y-3">
                  {selectedEntry.proofFiles.map((file) => (
                    <div key={file.id} className="p-3 border rounded-xl">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2 flex-1">
                          <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-gray-500 mt-1">SHA-256: <code className="text-xs break-all">{file.hash}</code></p>
                          </div>
                        </div>
                        <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Download</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm text-red-900">No proof documents attached</p>
                    <p className="text-xs text-red-600 mt-1">This entry cannot be approved without proof</p>
                  </div>
                </div>
              )}
            </div>

            {/* Verification Timeline */}
            <div className="border-t pt-6">
              <h4 className="text-sm font-medium text-gray-500 mb-3">Verification Timeline</h4>
              <div className="space-y-3 pt-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
                  <div>
                    <p className="text-sm font-medium">Submitted</p>
                    <p className="text-xs text-gray-500">{selectedEntry.verificationState.submitted}</p>
                  </div>
                </div>
                {selectedEntry.verificationState.reviewed && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
                    <div>
                      <p className="text-sm font-medium">Reviewed</p>
                      <p className="text-xs text-gray-500">{selectedEntry.verificationState.reviewed}</p>
                    </div>
                  </div>
                )}
                {selectedEntry.verificationState.approvedRejected && (
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${selectedEntry.status === 'Approved' ? 'bg-green-600' : 'bg-red-600'}`}></div>
                    <div>
                      <p className="text-sm font-medium">{selectedEntry.status}</p>
                      <p className="text-xs text-gray-500">{selectedEntry.verificationState.approvedRejected}</p>
                    </div>
                  </div>
                )}
                {selectedEntry.verificationState.corrected && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-1.5"></div>
                    <div>
                      <p className="text-sm font-medium">Corrected</p>
                      <p className="text-xs text-gray-500">{selectedEntry.verificationState.corrected}</p>
                      {selectedEntry.correctionReason && (
                        <p className="text-xs text-purple-600 mt-1">{selectedEntry.correctionReason}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons (if pending) */}
            {selectedEntry.status === 'Pending' && (
              <div className="border-t pt-6 flex flex-col gap-3">
                <button
                  onClick={() => handleApprove(selectedEntry)}
                  disabled={!selectedEntry.proofAttached}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2 inline" /> Approve Entry
                </button>
                <button
                  onClick={() => { setIsDetailsOpen(false); setSelectedEntry(selectedEntry); setIsRejectDialogOpen(true); }}
                  className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-xl hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4 mr-2 inline" /> Reject Entry
                </button>
                <button
                  onClick={() => { setIsDetailsOpen(false); setSelectedEntry(selectedEntry); setIsCorrectionDialogOpen(true); }}
                  className="w-full px-4 py-2 border border-purple-300 text-purple-600 rounded-xl hover:bg-purple-50"
                >
                  <RotateCcw className="w-4 h-4 mr-2 inline" /> Request Correction
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Reject Dialog */}
      <Modal open={isRejectDialogOpen} onClose={() => { setIsRejectDialogOpen(false); setRejectionReason(''); }} title="Reject Ledger Entry">
        <div className="space-y-4 pt-4">
          <p className="text-sm text-gray-600">Please provide a detailed reason for rejecting this entry.</p>
          <textarea
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Explain why..."
            className="w-full rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-200 outline-none transition"
          />
          <div className="flex gap-3">
            <button
              onClick={() => { setIsRejectDialogOpen(false); setRejectionReason(''); }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </Modal>

      {/* Correction Dialog */}
      <Modal open={isCorrectionDialogOpen} onClose={() => { setIsCorrectionDialogOpen(false); setCorrectionReason(''); }} title="Request Correction">
        <div className="space-y-4 pt-4">
          <p className="text-sm text-gray-600">Explain what needs to be corrected. The original entry will be marked as corrected.</p>
          <textarea
            rows={4}
            value={correctionReason}
            onChange={(e) => setCorrectionReason(e.target.value)}
            placeholder="Describe the correction..."
            className="w-full rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-200 outline-none transition"
          />
          <div className="flex gap-3">
            <button
              onClick={() => { setIsCorrectionDialogOpen(false); setCorrectionReason(''); }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCorrection}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700"
            >
              Confirm Correction
            </button>
          </div>
        </div>
      </Modal>
    </AuthenticatedLayout>
  );
}