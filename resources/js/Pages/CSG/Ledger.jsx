import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Send,
  Upload,
  Hash,
  Shield,
  DollarSign,
  TrendingUp,
  TrendingDown,
  X,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Lock,
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

function Modal({ open, onClose, title, description, children }) {
  useEffect(() => {
    if (!open) return undefined;
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [open]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-lg flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-6 border-b">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            {description ? <p className="text-sm text-gray-500 mt-1">{description}</p> : null}
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close">
            ✕
          </button>
        </div>
        <div className="overflow-y-auto p-6 pt-0">{children}</div>
      </div>
    </div>,
    document.body
  );
}

function FieldLabel({ children }) {
  return <label className="block text-sm text-gray-700 mb-1">{children}</label>;
}

function Textarea({ className = '', rows = 4, ...props }) {
  return (
    <textarea
      rows={rows}
      className={[
        'w-full px-3 py-2 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300',
        className,
      ].join(' ')}
      {...props}
    />
  );
}

function Select({ className = '', children, ...props }) {
  return (
    <select
      className={[
        'w-full h-10 px-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </select>
  );
}

function Switch({ checked, onCheckedChange, label }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
      <span className="text-sm text-gray-700">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          ${checked ? 'bg-blue-600' : 'bg-gray-300'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${checked ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
}

function LedgerPageInner() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProject, setFilterProject] = useState('all');

  const [ledgerEntries, setLedgerEntries] = useState([
    {
      id: 'TXN-2024-001',
      type: 'Income',
      amount: 50000,
      description: 'Initial Budget Allocation',
      category: 'Funding',
      project: 'Community Outreach Program',
      requiresProof: false,
      status: 'Approved',
      createdAt: '2024-11-01',
      version: 1,
      hash: 'a7f8d9e2c3b4a5f6e7d8c9b0a1f2e3d4',
      documents: [],
    },
    {
      id: 'TXN-2024-002',
      type: 'Expense',
      amount: 15000,
      description: 'Learning Materials Purchase',
      category: 'Supplies',
      project: 'Community Outreach Program',
      referenceNumber: 'PO-2024-156',
      requiresProof: true,
      status: 'Approved',
      createdAt: '2024-11-05',
      version: 1,
      hash: 'b8e9f0a1d2c3b4a5f6e7d8c9b0a1f2e3',
      documents: [
        { name: 'Receipt_001.pdf', size: '1.2 MB' },
      ],
    },
    {
      id: 'TXN-2024-003',
      type: 'Expense',
      amount: 8500,
      description: 'Transportation and Logistics',
      category: 'Transportation',
      project: 'Annual Sports Fest',
      requiresProof: true,
      status: 'Pending Adviser Approval',
      createdAt: '2024-11-10',
      version: 1,
      hash: 'c9f0a1b2e3d4c5b6a7f8e9d0c1b2a3f4',
      documents: [],
    },
    {
      id: 'TXN-2024-004',
      type: 'Expense',
      amount: 2500,
      description: 'Promotional Materials',
      category: 'Marketing',
      project: 'Tech Innovation Summit',
      requiresProof: true,
      status: 'Draft',
      createdAt: '2024-11-15',
      version: 1,
      hash: 'd0a1b2c3f4e5d6c7b8a9f0e1d2c3b4a5',
      documents: [],
    },
    {
      id: 'TXN-2024-005',
      type: 'Income',
      amount: 30000,
      description: 'Sponsorship - ABC Corporation',
      category: 'Sponsorship',
      project: 'Annual Sports Fest',
      referenceNumber: 'SPON-2024-01',
      requiresProof: true,
      status: 'Approved',
      createdAt: '2024-11-12',
      version: 1,
      hash: 'e1b2c3d4a5f6e7d8c9b0a1f2e3d4c5b6',
      documents: [
        { name: 'Sponsorship_Agreement.pdf', size: '2.5 MB' },
      ],
    },
  ]);

  const [ledgerForm, setLedgerForm] = useState({
    type: 'Expense',
    amount: '',
    description: '',
    category: '',
    project: '',
    referenceNumber: '',
    requiresProof: true,
  });

  const projects = [
    'Community Outreach Program',
    'Annual Sports Fest',
    'Tech Innovation Summit',
    'Campus Sustainability Initiative',
    'Mental Health Awareness Week',
  ];

  const filteredEntries = ledgerEntries.filter(entry => {
    const matchesSearch = entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || entry.type === filterType;
    const matchesStatus = filterStatus === 'all' || entry.status === filterStatus;
    const matchesProject = filterProject === 'all' || entry.project === filterProject;
    return matchesSearch && matchesType && matchesStatus && matchesProject;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'Pending Adviser Approval':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'Draft':
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-700';
      case 'Rejected':
        return 'bg-red-100 text-red-700';
      case 'Pending Adviser Approval':
        return 'bg-yellow-100 text-yellow-700';
      case 'Draft':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleAddEntry = () => {
    if (!ledgerForm.amount || !ledgerForm.description || !ledgerForm.project) {
      showToast('Please fill in required fields', 'error');
      return;
    }

    const newEntry = {
      id: `TXN-2024-${String(ledgerEntries.length + 1).padStart(3, '0')}`,
      ...ledgerForm,
      amount: parseFloat(ledgerForm.amount),
      status: 'Draft',
      createdAt: new Date().toISOString().split('T')[0],
      version: 1,
      hash: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      documents: [],
    };

    setLedgerEntries([newEntry, ...ledgerEntries]);
    setShowAddModal(false);
    setLedgerForm({
      type: 'Expense',
      amount: '',
      description: '',
      category: '',
      project: '',
      referenceNumber: '',
      requiresProof: true,
    });
    showToast('Ledger entry added successfully', 'success');
  };

  const handleEditEntry = () => {
    if (!selectedEntry) return;

    const updatedEntries = ledgerEntries.map(entry =>
      entry.id === selectedEntry.id
        ? {
            ...entry,
            ...ledgerForm,
            amount: parseFloat(ledgerForm.amount),
          }
        : entry
    );

    setLedgerEntries(updatedEntries);
    setShowEditModal(false);
    setSelectedEntry(null);
    showToast('Ledger entry updated successfully', 'success');
  };

  const handleDeleteEntry = () => {
    if (!selectedEntry) return;
    setLedgerEntries(ledgerEntries.filter(entry => entry.id !== selectedEntry.id));
    setShowDeleteModal(false);
    setSelectedEntry(null);
    showToast('Ledger entry deleted', 'success');
  };

  const handleSubmitForApproval = (id) => {
    const updatedEntries = ledgerEntries.map(entry =>
      entry.id === id ? { ...entry, status: 'Pending Adviser Approval' } : entry
    );
    setLedgerEntries(updatedEntries);
    showToast('Ledger entry submitted for approval', 'success');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      showToast('File size must be less than 10MB', 'error');
      return;
    }

    setFilePreview({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type,
    });
  };

  const handleSaveUpload = () => {
    if (!filePreview || !selectedEntry) return;
    
    const updatedEntries = ledgerEntries.map(entry => {
      if (entry.id === selectedEntry.id) {
        return {
          ...entry,
          documents: [...(entry.documents || []), filePreview],
        };
      }
      return entry;
    });
    
    setLedgerEntries(updatedEntries);
    setShowUploadModal(false);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('Document uploaded successfully', 'success');
  };

  const totalIncome = ledgerEntries
    .filter(e => e.type === 'Income' && e.status === 'Approved')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpenses = ledgerEntries
    .filter(e => e.type === 'Expense' && e.status === 'Approved')
    .reduce((sum, e) => sum + e.amount, 0);

  const currentBalance = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Ledger Management</h1>
          <p className="text-gray-500">Track all financial transactions across projects</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="text-white rounded-xl bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Ledger Entry
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-[20px] border-0 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Income</p>
              <p className="text-2xl text-green-600 mt-1">₱{totalIncome.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="rounded-[20px] border-0 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Expenses</p>
              <p className="text-2xl text-red-600 mt-1">₱{totalExpenses.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="rounded-[20px] border-0 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Current Balance</p>
              <p className={`text-2xl mt-1 ${currentBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                ₱{currentBalance.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="rounded-[20px] border-0 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-gray-900 font-semibold">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by ID or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
            />
          </div>

          {/* Type Filter */}
          <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </Select>

          {/* Status Filter */}
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="Draft">Draft</option>
            <option value="Pending Adviser Approval">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </Select>

          {/* Project Filter */}
          <Select value={filterProject} onChange={(e) => setFilterProject(e.target.value)}>
            <option value="all">All Projects</option>
            {projects.map((project) => (
              <option key={project} value={project}>{project}</option>
            ))}
          </Select>
        </div>
      </Card>

      {/* Ledger Table */}
      <Card className="rounded-[20px] border-0 shadow-sm p-6 overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-gray-900 font-semibold">Ledger Entries</h2>
            <Badge className="bg-purple-100 text-purple-700 rounded-lg">
              <Shield className="w-3 h-3 mr-1" />
              SHA256 Verified
            </Badge>
          </div>
          <Button variant="outline" className="rounded-xl">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-blue-50">
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">ID</th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">Type</th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">Amount</th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">Description</th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">Project</th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">Status</th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">Date</th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((entry) => (
              <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-mono text-sm text-gray-600">{entry.id}</td>
                <td className="py-3 px-4">
                  <Badge className={`rounded-lg ${entry.type === 'Income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {entry.type}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-gray-900 font-semibold">₱{entry.amount.toLocaleString()}</td>
                <td className="py-3 px-4 max-w-[200px] truncate text-gray-700">{entry.description}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{entry.project}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    {getStatusIcon(entry.status)}
                    <Badge className={`rounded-lg ${getStatusColor(entry.status)}`}>
                      {entry.status}
                    </Badge>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">{entry.createdAt}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedEntry(entry);
                        setShowDetailsModal(true);
                      }}
                      className="rounded-lg hover:bg-gray-100"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {entry.status === 'Draft' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedEntry(entry);
                            setLedgerForm({
                              type: entry.type,
                              amount: entry.amount.toString(),
                              description: entry.description,
                              category: entry.category,
                              project: entry.project,
                              referenceNumber: entry.referenceNumber || '',
                              requiresProof: entry.requiresProof,
                            });
                            setShowEditModal(true);
                          }}
                          className="rounded-lg hover:bg-gray-100"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedEntry(entry);
                            setShowDeleteModal(true);
                          }}
                          className="rounded-lg text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSubmitForApproval(entry.id)}
                          className="rounded-lg hover:bg-gray-100"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    {entry.requiresProof && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedEntry(entry);
                          setShowUploadModal(true);
                        }}
                        className="rounded-lg hover:bg-gray-100"
                      >
                        <Upload className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No ledger entries found</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first transaction</p>
            <Button
              onClick={() => setShowAddModal(true)}
              className="text-white rounded-xl bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Entry
            </Button>
          </div>
        )}
      </Card>

      {/* Add Ledger Entry Modal */}
      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Ledger Entry"
        description="Create a new financial transaction"
      >
        <div className="space-y-4 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Type *</FieldLabel>
              <Select
                value={ledgerForm.type}
                onChange={(e) => setLedgerForm({ ...ledgerForm, type: e.target.value })}
              >
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </Select>
            </div>

            <div>
              <FieldLabel>Amount (₱) *</FieldLabel>
              <Input
                type="number"
                placeholder="0.00"
                value={ledgerForm.amount}
                onChange={(e) => setLedgerForm({ ...ledgerForm, amount: e.target.value })}
                className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <FieldLabel>Project *</FieldLabel>
            <Select
              value={ledgerForm.project}
              onChange={(e) => setLedgerForm({ ...ledgerForm, project: e.target.value })}
            >
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project} value={project}>{project}</option>
              ))}
            </Select>
          </div>

          <div>
            <FieldLabel>Description *</FieldLabel>
            <Textarea
              placeholder="Enter transaction description"
              value={ledgerForm.description}
              onChange={(e) => setLedgerForm({ ...ledgerForm, description: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
            />
          </div>

          <div>
            <FieldLabel>Category</FieldLabel>
            <Input
              placeholder="e.g., Supplies, Transportation, Marketing"
              value={ledgerForm.category}
              onChange={(e) => setLedgerForm({ ...ledgerForm, category: e.target.value })}
              className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
            />
          </div>

          <div>
            <FieldLabel>Reference Number (Optional)</FieldLabel>
            <Input
              placeholder="PO number, invoice number, etc."
              value={ledgerForm.referenceNumber}
              onChange={(e) => setLedgerForm({ ...ledgerForm, referenceNumber: e.target.value })}
              className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
            />
          </div>

          <Switch
            checked={ledgerForm.requiresProof}
            onCheckedChange={(checked) => setLedgerForm({ ...ledgerForm, requiresProof: checked })}
            label="Requires Proof of Transaction"
          />

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowAddModal(false)}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddEntry}
              className="text-white flex-1 rounded-xl bg-blue-600 hover:bg-blue-700"
            >
              Save Entry
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedEntry(null);
        }}
        title="Edit Ledger Entry"
        description="Update transaction information"
      >
        <div className="space-y-4 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Type *</FieldLabel>
              <Select
                value={ledgerForm.type}
                onChange={(e) => setLedgerForm({ ...ledgerForm, type: e.target.value })}
              >
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </Select>
            </div>

            <div>
              <FieldLabel>Amount (₱) *</FieldLabel>
              <Input
                type="number"
                value={ledgerForm.amount}
                onChange={(e) => setLedgerForm({ ...ledgerForm, amount: e.target.value })}
                className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <FieldLabel>Project *</FieldLabel>
            <Select
              value={ledgerForm.project}
              onChange={(e) => setLedgerForm({ ...ledgerForm, project: e.target.value })}
            >
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project} value={project}>{project}</option>
              ))}
            </Select>
          </div>

          <div>
            <FieldLabel>Description *</FieldLabel>
            <Textarea
              value={ledgerForm.description}
              onChange={(e) => setLedgerForm({ ...ledgerForm, description: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
            />
          </div>

          <div>
            <FieldLabel>Category</FieldLabel>
            <Input
              value={ledgerForm.category}
              onChange={(e) => setLedgerForm({ ...ledgerForm, category: e.target.value })}
              className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
            />
          </div>

          <div>
            <FieldLabel>Reference Number (Optional)</FieldLabel>
            <Input
              value={ledgerForm.referenceNumber}
              onChange={(e) => setLedgerForm({ ...ledgerForm, referenceNumber: e.target.value })}
              className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
            />
          </div>

          <Switch
            checked={ledgerForm.requiresProof}
            onCheckedChange={(checked) => setLedgerForm({ ...ledgerForm, requiresProof: checked })}
            label="Requires Proof of Transaction"
          />

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowEditModal(false)}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditEntry}
              className="text-white flex-1 rounded-xl bg-blue-600 hover:bg-blue-700"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Details Modal */}
      <Modal
        open={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedEntry(null);
        }}
        title="Ledger Entry Details"
      >
        {selectedEntry && (
          <div className="space-y-4 pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Transaction ID</p>
                <p className="font-mono text-gray-900">{selectedEntry.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Type</p>
                <Badge className={`rounded-lg ${selectedEntry.type === 'Income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {selectedEntry.type}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Amount</p>
                <p className="text-xl text-gray-900">₱{selectedEntry.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <div className="flex items-center gap-1">
                  {getStatusIcon(selectedEntry.status)}
                  <Badge className={`rounded-lg ${getStatusColor(selectedEntry.status)}`}>
                    {selectedEntry.status}
                  </Badge>
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600 mb-1">Project</p>
                <p className="text-gray-900">{selectedEntry.project}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600 mb-1">Description</p>
                <p className="text-gray-900">{selectedEntry.description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Category</p>
                <p className="text-gray-900">{selectedEntry.category || '—'}</p>
              </div>
              {selectedEntry.referenceNumber && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Reference Number</p>
                  <p className="text-gray-900">{selectedEntry.referenceNumber}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600 mb-1">Version</p>
                <Badge variant="outline" className="rounded-lg">v{selectedEntry.version}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Created At</p>
                <p className="text-sm text-gray-900">{selectedEntry.createdAt}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Transaction Hash (SHA-256)</p>
              <div className="bg-gray-50 rounded-xl p-3 font-mono text-xs text-gray-700 break-all flex items-start gap-2">
                <Hash className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                <span>{selectedEntry.hash}</span>
              </div>
            </div>

            {selectedEntry.documents && selectedEntry.documents.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Attached Documents</p>
                <div className="space-y-2">
                  {selectedEntry.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-500">{doc.size}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="rounded-lg">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={() => setShowDetailsModal(false)}
              className="w-full rounded-xl"
              variant="outline"
            >
              Close
            </Button>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedEntry(null);
        }}
        title="Delete Ledger Entry"
        description="Are you sure you want to delete this transaction? This action cannot be undone."
      >
        <div className="pt-6">
          <p className="text-sm text-gray-600 mb-6">
            Transaction: <span className="font-medium">{selectedEntry?.id} - {selectedEntry?.description}</span>
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteEntry}
              className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Entry
            </Button>
          </div>
        </div>
      </Modal>

      {/* Upload Document Modal */}
      <Modal
        open={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setFilePreview(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }}
        title="Upload Document"
        description="Upload proof of transaction"
      >
        <div className="space-y-4 pt-6">
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              className="w-full border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center hover:bg-gray-50 transition"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              <Upload className="w-6 h-6 text-gray-500" />
              <p className="text-sm text-gray-600 mt-2">Click to upload</p>
              <p className="text-xs text-gray-500 mt-1">PDF, Images up to 10MB</p>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="hidden"
            />

            {filePreview && (
              <div className="w-full p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{filePreview.name}</p>
                      <p className="text-xs text-gray-500">{filePreview.size}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFilePreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    ✕
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowUploadModal(false);
                setFilePreview(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveUpload}
              disabled={!filePreview}
              className="text-white flex-1 rounded-xl bg-blue-600 hover:bg-blue-700"
            >
              Upload Document
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function LedgerPage() {
  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">CSG Ledger</h2>}>
      <Head title="CSG Ledger" />
      <div className="py-8 px-4 lg:px-0 md:px-0">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <LedgerPageInner />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}