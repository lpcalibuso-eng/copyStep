import { useState, useMemo, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import ReactDOM from 'react-dom';
import { Button } from '@/Components/ui/button';
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
  ChevronLeft,
  ChevronRight,
  DollarSign,
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
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <div className="overflow-y-auto p-6 pt-0">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

function csvEscape(val) {
  const s = String(val ?? '');
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const TABLE_PAGE_SIZE = 5;

export default function LedgerApprovalsPage() {
  const { ledgerEntries = [], projectFilterOptions = [] } = usePage().props;

  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isCorrectionDialogOpen, setIsCorrectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [correctionReason, setCorrectionReason] = useState('');

  const [filterProject, setFilterProject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [ledgerPage, setLedgerPage] = useState(1);

  useEffect(() => {
    setLedgerPage(1);
  }, [filterProject, filterStatus, searchQuery]);

  const stats = useMemo(() => {
    const approvedEntries = ledgerEntries.filter(
      (e) => e.approvalStatus === 'Approved' && !e.archive
    );

    const totalIncome = approvedEntries
      .filter((e) => e.transactionType === 'Income')
      .reduce((sum, e) => sum + Number(e.amount), 0);
    const totalExpenses = approvedEntries
      .filter((e) => e.transactionType === 'Expense')
      .reduce((sum, e) => sum + Number(e.amount), 0);

    const uniqueProjects = new Set(
      approvedEntries
        .map((e) => e.projectName || e.projectId)
        .filter(Boolean)
    );
    const projectCount = uniqueProjects.size;

    return {
      totalIncome,
      totalExpenses,
      pendingApprovals: ledgerEntries.filter((e) => e.allowAdviserActions).length,
      correctionCount: ledgerEntries.filter((e) => e.status === 'Corrected').length,
      averageIncome: projectCount ? totalIncome / projectCount : 0,
      averageExpenses: projectCount ? totalExpenses / projectCount : 0,
      averageNet: projectCount ? (totalIncome - totalExpenses) / projectCount : 0,
    };
  }, [ledgerEntries]);

  const handleViewDetails = (entry) => {
    setSelectedEntry(entry);
    setIsDetailsOpen(true);
  };

  const handleApprove = (entry) => {
    if (!entry) return;
    if (!window.confirm('Approve this ledger entry?')) return;
    router.post(route('adviser.ledger.approve', entry.id), {}, {
      preserveScroll: true,
      onSuccess: () => {
        showToast('Ledger entry approved');
        setIsDetailsOpen(false);
        setSelectedEntry(null);
      },
      onError: () => showToast('Could not approve entry', 'error'),
    });
  };

  const handleReject = () => {
    if (!selectedEntry || !rejectionReason.trim()) {
      showToast('Please provide a rejection reason', 'error');
      return;
    }
    if (!window.confirm('Reject this ledger entry?')) return;
    router.post(route('adviser.ledger.reject', selectedEntry.id), { reason: rejectionReason.trim() }, {
      preserveScroll: true,
      onSuccess: () => {
        showToast('Ledger entry rejected', 'error');
        setRejectionReason('');
        setIsRejectDialogOpen(false);
        setIsDetailsOpen(false);
        setSelectedEntry(null);
      },
      onError: () => showToast('Could not reject entry', 'error'),
    });
  };

  const handleCorrection = () => {
    if (!selectedEntry || !correctionReason.trim()) {
      showToast('Please provide a correction reason', 'error');
      return;
    }
    if (!window.confirm('Submit this correction request to the officer?')) return;
    router.post(route('adviser.ledger.correction', selectedEntry.id), { reason: correctionReason.trim() }, {
      preserveScroll: true,
      onSuccess: () => {
        showToast('Correction request saved');
        setCorrectionReason('');
        setIsCorrectionDialogOpen(false);
        setIsDetailsOpen(false);
        setSelectedEntry(null);
      },
      onError: () => showToast('Could not save correction', 'error'),
    });
  };

  const getStatusBadge = (status) => {
    const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
    switch (status) {
      case 'Approved': return <span className={`${baseClasses} bg-green-100 text-green-700`}>Approved</span>;
      case 'Pending': return <span className={`${baseClasses} bg-yellow-100 text-yellow-700`}>Pending</span>;
      case 'Rejected': return <span className={`${baseClasses} bg-red-100 text-red-700`}>Rejected</span>;
      case 'Corrected': return <span className={`${baseClasses} bg-purple-100 text-purple-700`}>Corrected</span>;
      case 'Draft': return <span className={`${baseClasses} bg-gray-100 text-gray-700`}>Draft</span>;
      default: return <span className={`${baseClasses} bg-gray-100 text-gray-600`}>{status || '—'}</span>;
    }
  };

  const filteredEntries = useMemo(() => ledgerEntries.filter((entry) => {
    if (filterProject !== 'all' && entry.projectName !== filterProject) return false;
    if (filterStatus !== 'all') {
      if (filterStatus === 'Pending') {
        if (!entry.allowAdviserActions) return false;
      } else if (entry.status !== filterStatus) {
        return false;
      }
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const blob = [
        entry.id,
        entry.projectName,
        entry.enteredBy,
        entry.description,
        entry.category,
        entry.ledgerHash,
      ].filter(Boolean).join(' ').toLowerCase();
      if (!blob.includes(q)) return false;
    }
    return true;
  }), [ledgerEntries, filterProject, filterStatus, searchQuery]);

  const ledgerTotalPages = Math.max(1, Math.ceil(filteredEntries.length / TABLE_PAGE_SIZE));
  const pagedLedger = filteredEntries.slice((ledgerPage - 1) * TABLE_PAGE_SIZE, ledgerPage * TABLE_PAGE_SIZE);


  const handleExport = () => {
    const headers = ['Ledger ID', 'Project', 'Entered By', 'Amount', 'Type', 'Date', 'Status', 'SHA256 Hash'];
    const rows = filteredEntries.map((entry) => [
      csvEscape(entry.id),
      csvEscape(entry.projectName),
      csvEscape(entry.enteredBy),
      csvEscape(entry.amount),
      csvEscape(entry.transactionType),
      csvEscape(entry.date),
      csvEscape(entry.status),
      csvEscape(entry.ledgerHash),
    ]);
    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
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
      <div className="py-8 px-4 lg:px-0 md:px-0">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Ledger Approval Center</h1>
            <p className="text-gray-500">Review and verify financial ledger entries</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-[20px] border-0 shadow-sm bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Average Income</p>
                  <p className="text-2xl text-green-600 mt-1">₱{stats.averageIncome.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
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
                  <p className="text-sm text-gray-500">Average Expenses</p>
                  <p className="text-2xl text-red-600 mt-1">₱{stats.averageExpenses.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
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
                  <p className="text-sm text-gray-500">Average Net Per Project</p>
                  <p className={`text-2xl mt-1 ${stats.averageNet >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    ₱{stats.averageNet.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Average net across all active projects</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          <>
              <div className="p-4 rounded-[20px] border-0 shadow-sm bg-white">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search ID, project, description..."
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
                    {projectFilterOptions.map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
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
                  </select>

                  <button
                    type="button"
                    onClick={handleExport}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </button>
                </div>
              </div>

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
  {pagedLedger.length === 0 ? (
    <tr>
      <td colSpan={9} className="px-6 py-4 text-center">
        <p className="text-sm text-gray-500 py-4">No items for the selected filters.</p>
      </td>
    </tr>
  ) : (
    pagedLedger.map((entry) => (
      <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4">
          <div className="flex items-center gap-2 max-w-[100px]">
            {/* <Hash className="w-4 h-4 text-gray-400" /> */}
            <span className="text-sm text-blue-600 truncate">{entry.id}</span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <p className="text-sm text-gray-900">{entry.projectName}</p>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <p className="text-sm text-gray-900">{entry.enteredBy}</p>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <p className={`text-sm ${entry.transactionType === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
            {entry.transactionType === 'Income' ? '+' : '-'}₱{Number(entry.amount).toLocaleString()}
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
          <p className="text-sm text-gray-600">{entry.date ? new Date(entry.date).toLocaleDateString() : '—'}</p>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {getStatusBadge(entry.status)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-1">
            {entry.proofAttached ? (
              <>
                <FileCheck className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-600">{entry.proofFiles?.length || 0}</span>
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
            type="button"
            onClick={() => handleViewDetails(entry)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
          >
            <Eye className="w-4 h-4" /> View
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>
                  </table>
                </div>
              </div>

              {filteredEntries.length > TABLE_PAGE_SIZE && (
                <div className="flex items-center justify-center gap-4">
                  <Button type="button" variant="outline" size="sm" className="rounded-xl" disabled={ledgerPage <= 1} onClick={() => setLedgerPage((p) => Math.max(1, p - 1))}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-gray-600">Page {ledgerPage} of {ledgerTotalPages}</span>
                  <Button type="button" variant="outline" size="sm" className="rounded-xl" disabled={ledgerPage >= ledgerTotalPages} onClick={() => setLedgerPage((p) => Math.min(ledgerTotalPages, p + 1))}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
        </div>
      </div>

      <Modal open={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} title="Ledger Entry Details">
        {selectedEntry && (
          <div className="space-y-6 pt-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-3">Basic Information</h4>
              <div className="space-y-3 pt-3">
                <div className='grid grid-cols-2 gap-2'>
                  <div>
                  <p className="text-xs text-gray-500">Ledger ID</p>
                  <p className="text-sm text-blue-600">{selectedEntry.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Project Title</p>
                  <p className="text-sm text-blue-600">{selectedEntry.projectName}</p>
                </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Ledger Hash (SHA256)</p>
                  <code className="text-xs bg-blue-50 px-2 py-1 rounded block break-all">{selectedEntry.ledgerHash}</code>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Predecessor Hash</p>
                  <code className="text-xs bg-gray-50 px-2 py-1 rounded block break-all">{selectedEntry.predecessorHash || '—'}</code>
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

            <div className="border-t pt-6">
              <h4 className="text-sm font-medium text-gray-500 mb-3">Financial Data</h4>
              <div className="space-y-3 pt-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className={`text-xl ${selectedEntry.transactionType === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                      ₱{Number(selectedEntry.amount).toLocaleString()}
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

            <div className="border-t pt-6">
              <h4 className="text-sm font-medium text-gray-500 mb-3">Proof Documents</h4>
              {selectedEntry.proofAttached ? (
                <div className="space-y-3">
                  {(selectedEntry.proofFiles || []).map((file) => (
                    <div key={file.id} className="p-3 border rounded-xl">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-gray-500 mt-1">SHA-256: <code className="text-xs break-all">{file.hash}</code></p>
                          </div>
                        </div>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex-shrink-0"
                        >
                          Download
                        </a>
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

            <div className="border-t pt-6">
              <h4 className="text-sm font-medium text-gray-500 mb-3">Verification Timeline</h4>
              <div className="space-y-3 pt-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5" />
                  <div>
                    <p className="text-sm font-medium">Submitted</p>
                    <p className="text-xs text-gray-500">{selectedEntry.verificationState?.submitted}</p>
                  </div>
                </div>
                {selectedEntry.verificationState?.reviewed && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5" />
                    <div>
                      <p className="text-sm font-medium">Reviewed</p>
                      <p className="text-xs text-gray-500">{selectedEntry.verificationState.reviewed}</p>
                    </div>
                  </div>
                )}
                {selectedEntry.verificationState?.approvedRejected && (
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${selectedEntry.status === 'Approved' ? 'bg-green-600' : 'bg-red-600'}`} />
                    <div>
                      <p className="text-sm font-medium">{selectedEntry.status}</p>
                      <p className="text-xs text-gray-500">{selectedEntry.verificationState.approvedRejected}</p>
                    </div>
                  </div>
                )}
                {selectedEntry.verificationState?.corrected && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-1.5" />
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

            {/* {selectedEntry.allowAdviserActions && (
              <div className="border-t pt-6 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => handleApprove(selectedEntry)}
                  disabled={!selectedEntry.proofAttached}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2 inline" /> Approve Entry
                </button>
                <button
                  type="button"
                  onClick={() => { setIsDetailsOpen(false); setIsRejectDialogOpen(true); }}
                  className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-xl hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4 mr-2 inline" /> Reject Entry
                </button>
                <button
                  type="button"
                  onClick={() => { setIsDetailsOpen(false); setIsCorrectionDialogOpen(true); }}
                  className="w-full px-4 py-2 border border-purple-300 text-purple-600 rounded-xl hover:bg-purple-50"
                >
                  <RotateCcw className="w-4 h-4 mr-2 inline" /> Request Correction
                </button>
              </div>
            )} */}
          </div>
        )}
      </Modal>

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
              type="button"
              onClick={() => { setIsRejectDialogOpen(false); setRejectionReason(''); }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleReject}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={isCorrectionDialogOpen} onClose={() => { setIsCorrectionDialogOpen(false); setCorrectionReason(''); }} title="Request Correction">
        <div className="space-y-4 pt-4">
          <p className="text-sm text-gray-600">Explain what needs to be corrected. The officer will see this note on the pending entry.</p>
          <textarea
            rows={4}
            value={correctionReason}
            onChange={(e) => setCorrectionReason(e.target.value)}
            placeholder="Describe the correction..."
            className="w-full rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-200 outline-none transition"
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => { setIsCorrectionDialogOpen(false); setCorrectionReason(''); }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
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
