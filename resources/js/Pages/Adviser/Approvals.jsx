import React, { useState, useMemo, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import ReactDOM from 'react-dom';
import { Clock, FolderKanban, DollarSign, FileText, Eye, CheckCircle, XCircle, Hash, Shield, Search, ChevronLeft, ChevronRight } from 'lucide-react';

function showToast(message, type = 'success') {
  const id = `simple-toast-${Date.now()}`;
  const el = document.createElement('div');
  el.id = id;
  el.className = 'fixed right-4 bottom-6 z-50 px-4 py-2 rounded shadow';
  el.style.background = type === 'success' ? '#0ea5e9' : '#ef4444';
  el.style.color = 'white';
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
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-lg flex flex-col max-h-[90vh]"
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

export default function AdviserApprovalsPage() {
  const {
    pendingProjects = [],
    pendingLedger = [],
    approvedItems = [],
    rejectedItems = [],
  } = usePage().props;

  const [tab, setTab] = useState('project proposals');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [showApprove, setShowApprove] = useState(false);
  const [showConfirmReject, setShowConfirmReject] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [approvalNotes, setApprovalNotes] = useState('');
  
  const itemsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [tab, searchQuery, sortOrder]);

  const totalPending = pendingProjects.length + pendingLedger.length;

  const counts = {
    'project proposals': pendingProjects.length,
    'ledger entries': pendingLedger.length,
    'approved items': approvedItems.length,
    'rejected items': rejectedItems.length,
  };

  const runApprove = (item, notes = '') => {
    if (!item) return showToast('No item selected', 'error');

    router.post(route('adviser.approvals.approve'), {
      type: item.approvalType,
      id: item.id,
      notes: notes.trim(),
    }, {
      preserveScroll: true,
      onSuccess: () => {
        showToast('Approved successfully');
        setShowReview(false);
        setShowApprove(false);
        setSelectedItem(null);
        setApprovalNotes('');
      },
      onError: () => showToast('Could not approve', 'error'),
    });
  };

  const handleApproveClick = () => {
    if (!selectedItem) return showToast('No item selected', 'error');
    setShowReview(false);
    setShowApprove(true);
  };

  const handleRejectClick = () => {
    if (!rejectReason.trim()) {
      return showToast('Provide a reason', 'error');
    }
    setShowConfirmReject(true);
  };

  const runReject = () => {
    if (!selectedItem) return showToast('No item selected', 'error');
    if (!rejectReason.trim()) return showToast('Provide a reason', 'error');

    router.post(route('adviser.approvals.reject'), {
      type: selectedItem.approvalType,
      id: selectedItem.id,
      reason: rejectReason.trim(),
    }, {
      preserveScroll: true,
      onSuccess: () => {
        showToast('Rejected');
        setShowConfirmReject(false);
        setShowReject(false);
        setShowReview(false);
        setSelectedItem(null);
        setRejectReason('');
      },
      onError: () => showToast('Could not reject', 'error'),
    });
  };

  const getApprovalStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-700';
      case 'Rejected':
        return 'bg-red-100 text-red-700';
      case 'Pending Adviser Approval':
        return 'bg-yellow-100 text-yellow-700';
      case 'Pending Approval':
        return 'bg-yellow-100 text-yellow-700';
      case 'Draft':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (approvalType) => {
    switch (approvalType) {
      case 'project': return <FolderKanban className="w-5 h-5 text-blue-600" />;
      case 'ledger': return <DollarSign className="w-5 h-5 text-green-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatDate = (dateString) => {
  if (!dateString) return 'Not specified';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Not specified';
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

  const itemsForTab = useMemo(() => {
    switch (tab) {
      case 'project proposals': 
        return pendingProjects.map(item => ({ ...item, approvalType: 'project', status: item.status || 'Pending Adviser Approval' }));
      case 'ledger entries': 
        return pendingLedger.map(item => ({ ...item, approvalType: 'ledger', status: item.status || 'Pending Adviser Approval' }));
      case 'approved items': 
        return approvedItems.map(item => ({
          ...item,
          approvalType: item.approvalType || item.type || (item.entry_type ? 'ledger' : 'project'),
          status: 'Approved'
        }));
      case 'rejected items': 
        return rejectedItems.map(item => ({
          ...item,
          approvalType: item.approvalType || item.type || (item.entry_type ? 'ledger' : 'project'),
          status: 'Rejected'
        }));
      default: 
        return [];
    }
  }, [tab, pendingProjects, pendingLedger, approvedItems, rejectedItems]);

  const filteredEntries = useMemo(() => {
    let filtered = itemsForTab.filter((i) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        (i.title || '').toLowerCase().includes(q) ||
        (i.id?.toString() || '').toLowerCase().includes(q) ||
        (i.submittedBy || '').toLowerCase().includes(q) ||
        (i.project || '').toLowerCase().includes(q) ||
        (i.category || '').toLowerCase().includes(q)
      );
    });

    filtered.sort((a, b) => {
      const da = new Date(a.submittedDate || a.created_at || 0).getTime();
      const db = new Date(b.submittedDate || b.created_at || 0).getTime();
      return sortOrder === 'newest' ? db - da : da - db;
    });

    return filtered;
  }, [itemsForTab, searchQuery, sortOrder]);

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEntries.slice(indexOfFirstItem, indexOfLastItem);

  const renderItem = (item) => (
    <Card key={`${item.approvalType}-${item.id}`} className="rounded-[20px] border-0 shadow-sm p-4 hover:shadow-md transition-all">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">{getTypeIcon(item.approvalType)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="text-gray-900 mb-1">{item.title}</h3>
              <p className="text-xs text-gray-500">ID: {item.id}</p>
            </div>
            <div className={`text-xs px-3 py-1 rounded-full ${getApprovalStatusColor(item.status)}`}>
              {item.status}
            </div>
          </div>

          <div className="space-y-1 mb-3">
            <p className="text-sm text-gray-600">Submitted by: {item.submittedBy}</p>
            <p className="text-sm text-gray-600">Date: {item.submittedDate || item.created_at}</p>
            {item.project && <p className="text-sm text-gray-600">Project Title: {item.project}</p>}
          </div>

          {(item.status === 'Pending Approval' || item.status === 'Pending Adviser Approval') && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 rounded-xl bg-blue-600 text-white hover:bg-blue-700" onClick={() => { setSelectedItem(item); setShowReview(true); }}>
                <Eye className="w-4 h-4 mr-1" /> Review
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <AuthenticatedLayout>
      <Head title="Approvals" />

      <div className="py-8 px-4 lg:px-0 md:px-0">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-gray-900 text-2xl font-semibold">Approval Center</h1>
              <p className="text-gray-500">Review and approve pending submissions</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">{totalPending} Pending</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="rounded-[20px] p-4 border-0 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">Project Proposals</p>
                  <p className="text-2xl text-blue-900">{pendingProjects.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <FolderKanban className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </Card>
            <Card className="rounded-[20px] p-4 border-0 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-700">Ledger Entries</p>
                  <p className="text-2xl text-yellow-900">{pendingLedger.length}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
            </Card>
            <Card className="rounded-[20px] p-4 border-0 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700">Approved Count</p>
                  <p className="text-2xl text-green-900">{approvedItems.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </Card>
            <Card className="rounded-[20px] p-4 border-0 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-700">Rejected Count</p>
                  <p className="text-2xl text-red-900">{rejectedItems.length}</p>
                </div>
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </Card>
          </div>

          <Card className="rounded-[20px] border-0 shadow-sm p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  placeholder="Search submissions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-200 outline-none transition"
                />
              </div>
              <div>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-200 outline-none transition"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-2 shadow-sm flex flex-wrap gap-2">
              {['project proposals', 'ledger entries', 'approved items', 'rejected items'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${tab === t ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  <span className="capitalize">{t}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${tab === t ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'}`}>{counts[t]}</span>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {currentItems.length === 0 ? (
                <Card className="rounded-[20px] border-0 shadow-sm p-12 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <Shield className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-900">Nothing to review right now</p>
                  <p className="text-sm text-gray-500">You&apos;re all caught up — no pending items in this tab.</p>
                </Card>
              ) : (
                currentItems.map((item) => renderItem(item))
              )}
            </div>

            {/* Pagination */}
            {filteredEntries.length > 0 && totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
                <div className="flex flex-1 justify-between sm:hidden">
                  <Button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative ml-3 inline-flex items-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </Button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Page <span className="font-medium">{currentPage}</span> of{' '}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <Button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center rounded-l-xl border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      
                      {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        const isCurrentPage = page === currentPage;
                        
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <Button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium ${
                                isCurrentPage
                                  ? 'z-10 bg-blue-600 text-white border-blue-600'
                                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </Button>
                          );
                        }
                        
                        if (page === currentPage - 2 || page === currentPage + 2) {
                          return (
                            <span
                              key={page}
                              className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
                            >
                              ...
                            </span>
                          );
                        }
                        
                        return null;
                      })}
                      
                      <Button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center rounded-r-xl border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Project Modal */}
      <Modal open={showReview && selectedItem?.approvalType === 'project'} onClose={() => setShowReview(false)} title="Review Project">
        {selectedItem && selectedItem.type === 'project' && (
          <div className="space-y-4 pt-6">
            {/* Header Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">ID *</p>
                <p className="font-mono text-sm text-gray-900 break-all">{selectedItem.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Status *</p>
                <Badge className={`rounded-lg ${getApprovalStatusColor(selectedItem.status)}`}>
                  {selectedItem.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Amount *</p>
                <p className="text-xl font-semibold text-blue-600">
                  {selectedItem.amount != null ? `₱${Number(selectedItem.amount).toLocaleString()}` : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Category *</p>
                <p className="text-gray-900">{selectedItem.category || 'Not specified'}</p>
              </div>
            </div>

            {/* Project Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-1">Project Title *</p>
                <p className="text-gray-900">{selectedItem.title || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-1">Objective *</p>
                <p className="text-gray-900">{selectedItem.objective || 'No objective provided'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-1">Description *</p>
                <p className="text-gray-900 whitespace-pre-wrap">{selectedItem.description || 'No description provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Venue *</p>
                <p className="text-gray-900">{selectedItem.venue || 'Not specified'}</p>
              </div>
               <div>
                <p className="text-sm text-gray-500 mb-1">Timeline *</p>
                <p className="text-gray-900">{formatDate(selectedItem.start_date)} to {formatDate(selectedItem.end_date)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Created By *</p>
                <p className="text-sm text-gray-900">{selectedItem.created_by || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Created At *</p>
                <p className="text-sm text-gray-900">{selectedItem.created_at || 'N/A'}</p>
              </div>
               <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-1">Proposed By *</p>
                <p className="text-gray-900">{selectedItem.proposed_by || 'Not specified'}</p>
              </div>
            </div>

            {/* Proof */}
             <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-1">Proof *</p>
                <p className="text-gray-900">{selectedItem.ledger_proof || 'No proof provided'}</p>
              </div>

             </div>

            {/* Budget Breakdown Details */}
            <div className="col-span-2">
              <p className="text-sm text-gray-500 mb-1">Initial Budget Breakdown *</p>
              {selectedItem.budget_breakdown ? (() => {
                let parsedBreakdown = selectedItem.budget_breakdown;
                
                if (typeof selectedItem.budget_breakdown === 'string') {
                  try {
                    const parsed = JSON.parse(selectedItem.budget_breakdown);
                    if (Array.isArray(parsed)) {
                      parsedBreakdown = parsed;
                    }
                  } catch (e) {
                    return (
                      <div className="bg-gray-50 rounded-lg p-3 mt-1">
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedItem.budget_breakdown}</p>
                      </div>
                    );
                  }
                }
                
                if (Array.isArray(parsedBreakdown)) {
                  return (
                    <div className="bg-gray-50 rounded-lg p-3 mt-1">
                      <div className="flex justify-between items-center pb-2 mb-2 border-b border-gray-300">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Item (Unit Price x Quantity)</span>
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</span>
                      </div>
                      
                      <div className="space-y-1">
                        {parsedBreakdown.map((item, index) => (
                          <div key={item.id || index} className="flex justify-between items-center py-1">
                            <div className="flex-1">
                              <span className="text-sm text-gray-900">{item.item || item.name || 'Unnamed Item'}</span>
                              {(item.quantity || item.qty) && (
                                <span className="text-xs text-gray-500 ml-2">
                                  (₱{(parseFloat(item.unitPrice) || 0).toLocaleString()} x {item.quantity || item.qty})
                                </span>
                              )}
                            </div>
                            <span className="text-sm font-medium text-blue-600">
                              ₱{(parseFloat(item.amount) || 0).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-between pt-2 mt-2 border-t border-gray-300 font-semibold">
                        <span className="text-gray-700">Total</span>
                        <span className="text-blue-600">
                          ₱{parsedBreakdown.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                }
                
                return <p className="text-gray-500 mt-1">No budget breakdown available.</p>;
              })() : (
                <p className="text-gray-500 mt-1">No budget breakdown provided.</p>
              )}

            </div>

            {/* Action Buttons */}
            {(selectedItem.status === 'Pending Approval' || selectedItem.status === 'Pending Adviser Approval') && (
              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowReview(false)}>
                  Cancel
                </Button>
                <Button variant="outline" className="flex-1 rounded-xl text-red-600 hover:bg-red-50" onClick={() => { setShowReview(false); setShowReject(true); }}>
                   <XCircle className="w-4 h-4 text-red-600" />
                  Reject
                </Button>
                <Button className="text-white flex-1 rounded-xl bg-green-600 hover:bg-green-700" onClick={handleApproveClick}>
                  <CheckCircle className="w-4 h-4 text-white-600" />
                  Approve
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Review Ledger Entry Modal */}
      <Modal open={showReview && selectedItem?.approvalType === 'ledger'} onClose={() => setShowReview(false)} title="Review Ledger Entry">
        {selectedItem && selectedItem.approvalType === 'ledger' && (
          <div className="space-y-4 pt-6">
            {/* Header Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Transaction ID *</p>
                <p className="font-mono text-sm text-gray-900 break-all">{selectedItem.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Status *</p>
                <Badge className={`rounded-lg ${getApprovalStatusColor(selectedItem.status)}`}>
                  {selectedItem.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Amount *</p>
                <p className="text-xl font-semibold text-blue-600">
                  ₱{selectedItem.amount != null ? Number(selectedItem.amount).toLocaleString() : '0'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Type *</p>
                <Badge className={`rounded-lg ${selectedItem.entry_type === 'Income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {selectedItem.entry_type || 'Expense'}
                </Badge>
              </div>
            </div>

            {/* Ledger Entry Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-1">Project Title *</p>
                <p className="text-gray-900">{selectedItem.project || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-1">Description *</p>
                <p className="text-gray-900 whitespace-pre-wrap">{selectedItem.description || 'No description provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Created By *</p>
                <p className="text-sm text-gray-900">{selectedItem.created_by || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Created At *</p>
                <p className="text-sm text-gray-900">{selectedItem.created_at || 'N/A'}</p>
              </div>
            </div>

            {/* Budget Breakdown Details */}
            <div className="col-span-2">
              <p className="text-sm text-gray-500 mb-1">Budget Breakdown Details *</p>
              {selectedItem.budget_breakdown ? (() => {
                let parsedBreakdown = selectedItem.budget_breakdown;
                
                if (typeof parsedBreakdown === 'string') {
                  try {
                    const parsed = JSON.parse(parsedBreakdown);
                    if (Array.isArray(parsed)) {
                      parsedBreakdown = parsed;
                    }
                  } catch (e) {
                    return (
                      <div className="bg-gray-50 rounded-lg p-3 mt-1">
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{parsedBreakdown}</p>
                      </div>
                    );
                  }
                }
                
                if (Array.isArray(parsedBreakdown) && parsedBreakdown.length > 0) {
                  return (
                    <div className="bg-gray-50 rounded-lg p-3 mt-1">
                      <div className="flex justify-between items-center pb-2 mb-2 border-b border-gray-300">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Item (Unit Price x Quantity)</span>
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</span>
                      </div>
                      
                      <div className="space-y-1">
                        {parsedBreakdown.map((item, index) => (
                          <div key={item.id || index} className="flex justify-between items-center py-1">
                            <div className="flex-1">
                              <span className="text-sm text-gray-900">{item.item || item.name || 'Unnamed Item'}</span>
                              {(item.quantity || item.qty) && (
                                <span className="text-xs text-gray-500 ml-2">
                                  (₱{(parseFloat(item.unitPrice) || 0).toLocaleString()} x {item.quantity || item.qty})
                                </span>
                              )}
                            </div>
                            <span className="text-sm font-medium text-blue-600">
                              ₱{(parseFloat(item.amount) || 0).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-between pt-2 mt-2 border-t border-gray-300 font-semibold">
                        <span className="text-gray-700">Total</span>
                        <span className="text-blue-600">
                          ₱{parsedBreakdown.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                }
                
                return <p className="text-gray-500 mt-1">No budget breakdown available.</p>;
              })() : (
                <p className="text-gray-500 mt-1">No budget breakdown provided.</p>
              )}
            </div>

            {/* Action Buttons */}
            {(selectedItem.status === 'Pending Approval' || selectedItem.status === 'Pending Adviser Approval') && (
              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowReview(false)}>
                  Cancel
                </Button>
                <Button variant="outline" className="flex-1 rounded-xl text-red-600 hover:bg-red-50" onClick={() => { setShowReview(false); setShowReject(true); }}>
                  Reject
                </Button>
                <Button className="text-white flex-1 rounded-xl bg-green-600 hover:bg-green-700" onClick={handleApproveClick}>
                  Approve
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal open={showReject} onClose={() => setShowReject(false)} title="Reject Submission">
        <div className="space-y-4 pt-4">
          <p className="text-sm text-gray-600">Please provide a reason for rejecting this submission.</p>
          <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={4} className="w-full rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-200 outline-none transition" />
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 rounded-xl" onClick={() => { setShowReject(false); setRejectReason(''); }}>Cancel</Button>
            <Button className="text-white flex-1 rounded-xl bg-red-600 hover:bg-red-700" onClick={handleRejectClick}>Continue</Button>
          </div>
        </div>
      </Modal>

      {/* Approve Submission Modal */}
      <Modal open={showApprove} onClose={() => { setShowApprove(false); setApprovalNotes(''); }} title="Approve Submission">
        <div className="space-y-4 pt-4">
          <p className="text-sm text-gray-600">Add optional approval notes for your records.</p>
          <textarea
            value={approvalNotes}
            onChange={(e) => setApprovalNotes(e.target.value)}
            rows={4}
            placeholder="Enter approval notes..."
            className="w-full rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-200 outline-none transition"
          />
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 rounded-xl" onClick={() => { setShowApprove(false); setApprovalNotes(''); }}>Cancel</Button>
            <Button className="text-white flex-1 rounded-xl bg-green-600 hover:bg-green-700" onClick={() => runApprove(selectedItem, approvalNotes)}>Confirm Approval</Button>
          </div>
        </div>
      </Modal>

      {/* Reject Confirmation Modal */}
      <Modal open={showConfirmReject} onClose={() => setShowConfirmReject(false)} title="Confirm Rejection">
        <div className="space-y-4 pt-4">
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Are you sure?</p>
              <p className="text-sm text-red-700 mt-1">This submission will be rejected with the reason provided. This action cannot be undone from this screen.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowConfirmReject(false)}>Cancel</Button>
            <Button className="text-white flex-1 rounded-xl bg-red-600 hover:bg-red-700" onClick={runReject}>Yes, Reject It</Button>
          </div>
        </div>
      </Modal>
    </AuthenticatedLayout>
  );
}