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
  ChevronLeft,
  ChevronRight,
  RefreshCw,
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
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProject, setFilterProject] = useState('all');

  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [editBudgetItems, setEditBudgetItems] = useState([{ id: 1, item: '', qty: 1, unitPrice: '', amount: 0 }]);
  const [isUploading, setIsUploading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLedgerEntries = () => {
    fetch('/api/ledger-entries')
      .then((response) => response.json())
      .then((data) => {
        const processedData = data.map((entry) => ({
          ...entry,
          status: entry.approval_status || entry.status || 'Draft',
          projectName: entry.project?.title || entry.project?.name || entry.project_name || entry.project || '—',
          project: entry.project?.title || entry.project?.name || entry.project_name || entry.project || '—',
          amount: Number(entry.amount) || 0,
          createdAt: entry.created_at ? entry.created_at.split('T')[0] : entry.createdAt,
          createdBy: entry.created_by || entry.createdBy || 'N/A',
          budgetBreakdown: entry.budget_breakdown || [],
        }));
        console.log('Processed ledger entries:', processedData);
        setLedgerEntries(processedData);
      })
      .catch((err) => {
        console.error('Failed to fetch ledger entries', err);
        showToast('Unable to load ledger entries', 'error');
      });
  };

  useEffect(() => {
    const fetchProjects = () => {
      fetch('/api/projects', {
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setAllProjects(
              data.filter((p) => ((p.approval_status || p.status || '').toString().toLowerCase() === 'approved'))
            );
          }
        })
        .catch((err) => {
          console.error('Failed to fetch projects', err);
          showToast('Unable to load projects', 'error');
        });
    };

    fetchLedgerEntries();
    fetchProjects();
  }, []);

  const projectStats = ledgerEntries
    .filter((entry) => entry.approval_status === 'Approved')  // Only include approved entries
    .reduce((acc, entry) => {
      const projectName = entry.project || 'Unknown Project';
      if (!acc[projectName]) {
        acc[projectName] = { income: 0, expense: 0, net: 0, count: 0 };
      }
      if (entry.type === 'Income') {
        acc[projectName].income += entry.amount || 0;
      } else if (entry.type === 'Expense') {
        acc[projectName].expense += entry.amount || 0;
      }
      acc[projectName].net = acc[projectName].income - acc[projectName].expense;
      acc[projectName].count += 1;
      return acc;
    }, {});

  const projectCount = Object.keys(projectStats).length;
  const averageIncome = projectCount > 0 ? Object.values(projectStats).reduce((sum, s) => sum + s.income, 0) / projectCount : 0;
  const averageExpense = projectCount > 0 ? Object.values(projectStats).reduce((sum, s) => sum + s.expense, 0) / projectCount : 0;
  const averageNet = projectCount > 0 ? Object.values(projectStats).reduce((sum, s) => sum + s.net, 0) / projectCount : 0;

  const [ledgerForm, setLedgerForm] = useState({
    type: 'Expense',
    amount: '',
    description: '',
    category: '',
    project_id: '',
    referenceNumber: '',
    requiresProof: true,
  });

  const projects = allProjects.length > 0 ? allProjects : [
    { id: '1', title: 'Community Outreach Program' },
    { id: '2', title: 'Annual Sports Fest' },
    { id: '3', title: 'Tech Innovation Summit' },
    { id: '4', title: 'Campus Sustainability Initiative' },
    { id: '5', title: 'Mental Health Awareness Week' },
  ];

  const filteredEntries = ledgerEntries.filter(entry => {
    const matchesSearch = entry.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || entry.type === filterType;
    const matchesStatus = filterStatus === 'all' || entry.status === filterStatus;
    const matchesProject = filterProject === 'all' || entry.project === filterProject;
    return matchesSearch && matchesType && matchesStatus && matchesProject;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEntries.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType, filterStatus, filterProject]);

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

 // Replace your current handleAddEntry with this:
const handleAddEntry = async () => {
  if (!ledgerForm.description || !ledgerForm.project_id) {
    showToast('Please fill in required fields', 'error');
    return;
  }

  // Check if amount is valid (either from budget breakdown or manual entry)
  const totalAmount = calculateTotalBudget();
  if (totalAmount <= 0) {
    showToast('Please add at least one budget item with a valid amount', 'error');
    return;
  }

  try {
    // Get project ID directly from form
    const projectId = ledgerForm.project_id;
    
    if (!projectId) {
      showToast('Invalid project selected', 'error');
      return;
    }

    // Prepare budget breakdown
    const budgetBreakdown = budgetItems.map(item => ({
      item: item.item,
      qty: item.qty,
      unitPrice: item.unitPrice,
      amount: item.amount || 0
    }));

    // Create form data for file upload
    const formData = new FormData();
    formData.append('project_id', projectId);
    formData.append('type', ledgerForm.type);
    formData.append('amount', totalAmount.toString());
    formData.append('description', ledgerForm.description);
    formData.append('approval_status', 'Draft');
    formData.append('budget_breakdown', JSON.stringify(budgetBreakdown));
    
    // Only add file if one was selected (making it optional)
    if (selectedFile) {
      formData.append('ledger_proof', selectedFile);
    }

    // Make API call to store the ledger entry
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';
    const response = await fetch('/api/ledger-entries', {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': csrfToken,
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Validation errors:', errorData.errors || errorData);
      throw new Error(errorData.message || JSON.stringify(errorData.errors) || 'Failed to create ledger entry');
    }

    const newEntry = await response.json();
    
    // Get the project name from the projects list
    const selectedProject = projects.find(p => p.id === projectId);
    const projectName = selectedProject?.title || 'Unknown Project';

    // Add the new entry to the state
    setLedgerEntries([
      {
        ...newEntry,
        projectName: projectName,
        project: projectName,
        amount: totalAmount,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'Draft',
        hasDocument: !!selectedFile, // Track if document was uploaded
      },
      ...ledgerEntries
    ]);

    // Reset form
    setShowAddModal(false);
    setLedgerForm({
      type: 'Expense',
      amount: '',
      description: '',
      category: '',
      project_id: '',
      referenceNumber: '',
      requiresProof: true,
    });
    setBudgetItems([{ id: 1, item: '', qty: 1, unitPrice: '', amount: 0 }]);
    setFilePreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    showToast('Ledger entry added successfully', 'success');
    
  } catch (error) {
    console.error('Error adding ledger entry:', error);
    showToast(error.message || 'Failed to add ledger entry', 'error');
  }
};

// Update handleEditEntry to use API
const handleEditEntry = async () => {
  if (!selectedEntry) return;

  if (!ledgerForm.description || !ledgerForm.project_id) {
    showToast('Please fill in required fields', 'error');
    return;
  }

  const totalAmount = calculateGrandTotal();

  if (totalAmount <= 0) {
    showToast('Please specify budget items with valid amounts', 'error');
    return;
  }

  setIsUploading(true);

  try {
    const formData = new FormData();
    formData.append('type', ledgerForm.type);
    formData.append('description', ledgerForm.description);
    formData.append('category', ledgerForm.category || '');
    formData.append('project_id', ledgerForm.project_id);
    formData.append('amount', totalAmount.toString());
    formData.append('budget_breakdown', JSON.stringify(editBudgetItems));
    if (selectedFile) {
      formData.append('ledger_proof', selectedFile);
    }

    const response = await fetch(`/api/ledger-entries/${selectedEntry.id}`, {
      method: 'PUT',
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Update error:', errorData);
      throw new Error(errorData.message || 'Failed to update ledger entry');
    }

    const updatedEntry = await response.json();

    const selectedProject = projects.find((p) => p.id === ledgerForm.project_id);
    const projectName = selectedProject?.title || ledgerForm.project || 'Unknown Project';

    const updatedEntries = ledgerEntries.map((entry) =>
      entry.id === selectedEntry.id
        ? {
            ...entry,
            ...updatedEntry,
            type: ledgerForm.type,
            amount: totalAmount,
            description: ledgerForm.description,
            projectName,
            project: projectName,
            budgetBreakdown: editBudgetItems,
            status: updatedEntry.status || entry.status,
          }
        : entry
    );

    setLedgerEntries(updatedEntries);
    setShowEditModal(false);
    setSelectedEntry(null);
    setFilePreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    showToast('Ledger entry updated successfully', 'success');
  } catch (error) {
    console.error('Error updating ledger entry:', error);
    showToast(error.message || 'Failed to update ledger entry', 'error');
  } finally {
    setIsUploading(false);
  }
};

// Update handleDeleteEntry to use API
const handleDeleteEntry = async () => {
  if (!selectedEntry) return;

  try {
    const response = await fetch(`/api/ledger-entries/${selectedEntry.id}`, {
      method: 'DELETE',
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete ledger entry');
    }

    // Remove the deleted entry from state immediately
    setLedgerEntries(ledgerEntries.filter(entry => entry.id !== selectedEntry.id));
    setShowDeleteModal(false);
    setSelectedEntry(null);
    showToast('Ledger entry deleted successfully', 'success');
    
    // Refetch to ensure deleted entry doesn't reappear
    fetchLedgerEntries();
    
  } catch (error) {
    console.error('Error deleting ledger entry:', error);
    showToast('Failed to delete ledger entry', 'error');
  }
};

// Update handleSubmitForApproval to use API
const handleSubmitForApproval = async (id) => {
  try {
    const response = await fetch(`/api/ledger-entries/${id}/submit`, {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to submit for approval');
    }

    const updatedEntry = await response.json();

    const updatedEntries = ledgerEntries.map(entry =>
      entry.id === id ? { ...entry, status: 'Pending Adviser Approval' } : entry
    );
    setLedgerEntries(updatedEntries);
    showToast('Ledger entry submitted for approval', 'success');
    
  } catch (error) {
    console.error('Error submitting for approval:', error);
    showToast('Failed to submit for approval', 'error');
  }
};

// Update handleSaveUpload to use API
const handleSaveUpload = async () => {
  if (!selectedEntry) return;

  try {
    const formData = new FormData();
    
    // Only add file if one was selected
    if (selectedFile) {
      formData.append('ledger_proof', selectedFile);
    } else {
      // If no file selected, show error or just close
      showToast('Please select a file to upload', 'error');
      return;
    }

    const response = await fetch(`/api/ledger-entries/${selectedEntry.id}/upload`, {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload document');
    }

    const updatedEntry = await response.json();

    const updatedEntries = ledgerEntries.map(entry => {
      if (entry.id === selectedEntry.id) {
        return {
          ...entry,
          documents: [...(entry.documents || []), filePreview],
          ledger_proof: updatedEntry.ledger_proof,
          hasDocument: true,
        };
      }
      return entry;
    });

    setLedgerEntries(updatedEntries);
    setShowUploadModal(false);
    setFilePreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('Document uploaded successfully', 'success');
    
  } catch (error) {
    console.error('Error uploading document:', error);
    showToast('Failed to upload document', 'error');
  }
};

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      showToast('File size must be less than 10MB', 'error');
      return;
    }

    setSelectedFile(file);
    setFilePreview({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type,
    });
  };

  const calculateGrandTotal = () => {
    return editBudgetItems.reduce((sum, item) => {
      const qty = parseFloat(item.qty) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      return sum + (qty * unitPrice);
    }, 0);
  };

  const addItem = () => {
    const newId = editBudgetItems.length > 0 ? Math.max(...editBudgetItems.map((item) => item.id)) + 1 : 1;
    setEditBudgetItems((prev) => [...prev, { id: newId, item: '', qty: 1, unitPrice: '', amount: 0 }]);
  };

  const removeItem = (id) => {
    if (editBudgetItems.length > 1) {
      setEditBudgetItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id, field, value) => {
    setEditBudgetItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        const qty = parseFloat(updated.qty) || 0;
        const unitPrice = parseFloat(updated.unitPrice) || 0;
        updated.amount = qty * unitPrice;
        return updated;
      })
    );
  };

  const handleEditClose = () => {
    setShowEditModal(false);
    setSelectedEntry(null);
    setFilePreview(null);
    setSelectedFile(null);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const totalIncome = ledgerEntries
    .filter(e => e.type === 'Income' && e.status === 'Approved')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpenses = ledgerEntries
    .filter(e => e.type === 'Expense' && e.status === 'Approved')
    .reduce((sum, e) => sum + e.amount, 0);

  const currentBalance = totalIncome - totalExpenses;

  // Budget items state for the ledger entry
  const [budgetItems, setBudgetItems] = useState([
    { id: 1, item: '', qty: 1, unitPrice: '', amount: 0 }
  ]);

  // Calculate item total
  const calculateItemTotal = (item) => {
    if (item.qty && item.unitPrice) {
      const qty = parseFloat(item.qty) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      return qty * unitPrice;
    }
    return parseFloat(item.amount) || 0;
  };

  // Calculate total budget from all items
  const calculateTotalBudget = () => {
    return budgetItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  // Add budget item
  const addBudgetItem = () => {
    const newId = budgetItems.length > 0 
      ? Math.max(...budgetItems.map(item => item.id)) + 1 
      : 1;
    setBudgetItems([...budgetItems, { 
      id: newId, 
      item: '', 
      qty: 1, 
      unitPrice: '', 
      amount: 0 
    }]);
  };

  // Remove budget item
  const removeBudgetItem = (id) => {
    if (budgetItems.length > 1) {
      setBudgetItems(budgetItems.filter(item => item.id !== id));
    }
  };

  // Update budget item
  const updateBudgetItem = (id, field, value) => {
    setBudgetItems(budgetItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        if (field === 'qty' || field === 'unitPrice') {
          const qty = field === 'qty' ? parseFloat(value) || 0 : parseFloat(item.qty) || 0;
          const unitPrice = field === 'unitPrice' ? parseFloat(value) || 0 : parseFloat(item.unitPrice) || 0;
          updatedItem.amount = qty * unitPrice;
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Ledger Management</h1>
          <p className="text-gray-500">Track all financial transactions across projects</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setIsRefreshing(true);
              fetchLedgerEntries();
              setTimeout(() => setIsRefreshing(false), 500);
            }}
            disabled={isRefreshing}
            className="text-gray-700 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            title="Refresh ledger data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
            className="text-white rounded-xl bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Ledger Entry
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-[20px] border-0 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Income</p>
              <p className="text-2xl text-green-600 mt-1">₱{(averageIncome || 0).toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="rounded-[20px] border-0 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Expenses</p>
              <p className="text-2xl text-red-600 mt-1">₱{(averageExpense || 0).toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="rounded-[20px] border-0 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Net Per Project</p>
              <p className={`text-2xl mt-1 ${averageNet >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                ₱{(averageNet || 0).toLocaleString()}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="lg:col-span-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by Project Title..."
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
        </div>
      </Card>

      {/* Entries Count */}
      {filteredEntries.length > 0 && (
        <div>
          <p className="text-sm text-gray-500">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredEntries.length)} of {filteredEntries.length} entries
          </p>
        </div>
      )}

      {/* Ledger Cards Grid - Fixed Layout */}
      <div className="space-y-3">
        {currentItems.map((entry) => (
          <Card key={entry.id} className="rounded-xl border-0 shadow-sm hover:shadow-md transition-all duration-200 overflow-x-auto">
            <div className="p-4 min-w-[900px]">
              {/* Fixed grid layout with consistent column widths */}
              <div className="grid grid-cols-[200px_140px_200px_140px_120px_auto] gap-4 items-center">
                {/* ID and Type Section */}
                <div className="flex items-center gap-3 min-w-0">
                  <span className="truncate text-[11px] font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded whitespace-nowrap">
                    {entry.id}
                  </span>
                  <Badge className={`text-[11px] px-2 py-0.5 rounded-md whitespace-nowrap shrink-0 ${entry.type === 'Income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {entry.type}
                  </Badge>
                </div>

                {/* Amount Section */}
               <div>
  <p className={`text-xl font-bold text-gray-900 whitespace-nowrap ${entry.type === 'Income' ? 'text-green-700' : 'text-red-700'}`}>
    {entry.type === 'Income' ? '+' : entry.type === 'Expense' ? '-' : ''}₱{(entry.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
  </p>
</div>

                {/* Category Section */}
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Project Title</p>
                  <p className="text-xs text-gray-700 font-medium truncate">{entry.projectName || '—'}</p>
                </div>

                {/* Date Section */}
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Created At</p>
                  <p className="text-xs text-gray-700 whitespace-nowrap">{entry.createdAt}</p>
                </div>

                {/* Status Section */}
                <div className="flex items-center gap-1 min-w-0">
                  {getStatusIcon(entry.status)}
                  <Badge className={`text-[11px] px-2 py-0.5 rounded-md shrink-0 ${getStatusColor(entry.status)}`}>
                    {entry.status}
                  </Badge>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-1 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedEntry(entry);
                      setShowDetailsModal(true);
                    }}
                    className="h-7 text-xs rounded-md hover:bg-gray-100 px-2"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" /> 
                  </Button>
                  
                  {!entry.is_initial_entry && (entry.status === 'Draft' || entry.status === 'Rejected') && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedEntry(entry);
                          setLedgerForm({
                            id: entry.id,
                            type: entry.type,
                            amount: entry.amount?.toString() || '',
                            description: entry.description || '',
                            category: entry.category || '',
                            project_id: entry.project_id || entry.project_id || '',
                            project: entry.project || entry.projectName || '',
                            referenceNumber: entry.referenceNumber || '',
                            requiresProof: entry.requiresProof ?? true,
                            existingProof: entry.ledger_proof || (entry.documents && entry.documents.length > 0),
                          });
                          setEditBudgetItems(entry.budgetBreakdown && entry.budgetBreakdown.length ? entry.budgetBreakdown.map((item, idx) => ({
                            id: item.id ?? idx + 1,
                            item: item.item || item.name || '',
                            qty: parseFloat(item.qty || item.quantity || 1),
                            unitPrice: parseFloat(item.unitPrice || item.rate || 0),
                            amount: parseFloat(item.amount || 0),
                          })) : [{ id: 1, item: '', qty: 1, unitPrice: 0, amount: 0 }]);
                          setShowEditModal(true);
                        }}
                        className="h-7 text-xs rounded-md hover:bg-gray-100 px-2"
                      >
                        <Edit className="w-3.5 h-3.5 mr-1" /> 
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedEntry(entry);
                          setShowDeleteModal(true);
                        }}
                        className="h-7 text-xs rounded-md text-red-600 hover:bg-red-50 px-2"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" /> 
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSubmitForApproval(entry.id)}
                        className="h-7 text-xs rounded-md hover:bg-gray-100 px-2"
                      >
                        <Send className="w-3.5 h-3.5 mr-1" /> 
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredEntries.length === 0 && (
        <Card className="rounded-[20px] border-0 shadow-sm p-12 text-center">
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
        </Card>
      )}

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

      {/* Add Ledger Entry Modal */}
      <Modal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setFilePreview(null);
          setSelectedFile(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }}
        title="Add Ledger Entry"
        description="Create a new financial transaction"
      >
        <div className="space-y-4 pt-6">
          <div>
            <FieldLabel>Type *</FieldLabel>
            <Select
              className="w-full h-10 px-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-200"
              value={ledgerForm.type}
              onChange={(e) => setLedgerForm({ ...ledgerForm, type: e.target.value })}
            >
              <option disabled value="">Select Type</option>
              <option value="Expense">Expense</option>
              <option value="Income">Income</option>
            </Select>
          </div>

          {/* Project Selection */}
          <div>
            <FieldLabel>Project *</FieldLabel>
            <Select
              value={ledgerForm.project_id}
              onChange={(e) => setLedgerForm({ ...ledgerForm, project_id: e.target.value })}
              className="w-full h-10 px-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="">Select Project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>{project.title}</option>
              ))}
            </Select>
          </div>

          {/* Description */}
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

          {/* Budget Breakdown Section */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <FieldLabel>Budget Breakdown (₱)</FieldLabel>
              <div className="space-y-3">
                {budgetItems.map((item) => (
                  <div key={item.id} className="flex gap-2 items-start">
                    <Input
                      placeholder="Item name"
                      value={item.item}
                      onChange={(e) => updateBudgetItem(item.id, 'item', e.target.value)}
                      className="flex-1 h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
                    />
                    <Input
                      type="number"
                      placeholder="Qty"
                      min="1"
                      value={item.qty}
                      onChange={(e) => updateBudgetItem(item.id, 'qty', e.target.value)}
                      className="w-20 h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
                    />
                    <Input
                      type="number"
                      placeholder="Unit Price"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateBudgetItem(item.id, 'unitPrice', e.target.value)}
                      className="w-28 h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
                    />
                    <div className="w-28 h-10 flex items-center justify-end px-3 bg-gray-100 rounded-xl text-gray-700 font-medium">
                      ₱{(item.amount || 0).toLocaleString()}
                    </div>
                    {budgetItems.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBudgetItem(item.id)}
                        className="rounded-lg text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={addBudgetItem}
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Budget Item
                </Button>
              </div>
            </div>
            
            <div>
              <FieldLabel>Total Amount (₱)</FieldLabel>
              <div className="bg-blue-50 rounded-xl p-4 mt-1">
                <p className="text-3xl font-semibold text-blue-900">
                  ₱{calculateTotalBudget().toLocaleString()}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Auto-calculated from breakdown items
                </p>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <FieldLabel>Attach Proof Document (Optional)</FieldLabel>
            <div className="flex flex-col items-center gap-3">
              <button 
                type="button" 
                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-gray-50 transition" 
                onClick={() => fileInputRef.current?.click()}
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
                <div className="w-full p-4 bg-gray-50 rounded-xl flex items-center justify-between">
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
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = ''; 
                    }}
                  >
                    ✕
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAddModal(false);
                setFilePreview(null);
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }} 
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddEntry} 
              className="text-white flex-1 rounded-xl bg-blue-600 hover:bg-blue-700"
              disabled={!ledgerForm.description || !ledgerForm.project_id || !ledgerForm.type}
            >
              Save Entry
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal open={showEditModal} onClose={handleEditClose} title="Edit Ledger Entry" description="Update transaction information">
        <div className="space-y-4">
          <div>
            <FieldLabel>Type</FieldLabel>
            <Select
              value={ledgerForm.type}
              onChange={(e) => setLedgerForm({ ...ledgerForm, type: e.target.value })}
            >
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </Select>
          </div>

          <div>
            <FieldLabel>Project</FieldLabel>
            <Select
              value={ledgerForm.project_id || ''}
              onChange={(e) => setLedgerForm({ ...ledgerForm, project_id: e.target.value })}
            >
              <option value="">Select Project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>{project.title}</option>
              ))}
            </Select>
          </div>

          <div>
            <FieldLabel>Description</FieldLabel>
            <Textarea
              value={ledgerForm.description}
              onChange={(e) => setLedgerForm({ ...ledgerForm, description: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
            />
          </div>

                 <div className="space-y-4">
                          <FieldLabel>Budget Breakdown (₱)</FieldLabel>
                          <div className="space-y-4">
                            {editBudgetItems.map((item) => (
                              <div key={item.id} className="flex gap-2 items-start">
                                <Input
                                  placeholder="Item name"
                                  value={item.item}
                                  onChange={(e) => updateItem(item.id, 'item', e.target.value)}
                                  className="flex-1 h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
                                />
                                <Input
                                  type="number"
                                  placeholder="Qty"
                                  min="1"
                                  value={item.qty}
                                  onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                                  className="w-20 h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
                                />
                                <Input
                                  type="number"
                                  placeholder="Unit Price"
                                  min="0"
                                  step="0.01"
                                  value={item.unitPrice}
                                  onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)}
                                  className="w-28 h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
                                />
                                <div className="w-28 h-10 flex items-center justify-end px-3 bg-gray-100 rounded-xl text-gray-700 font-medium">
                                  ₱{(item.amount || 0).toLocaleString()}
                                </div>
                                {editBudgetItems.length > 1 && (
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => removeItem(item.id)} 
                                    className="rounded-lg text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                            
                            <Button 
                              type="button" 
                              onClick={addItem} 
                              variant="outline" 
                              size="sm" 
                              className="w-full rounded-xl"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Budget Item
                            </Button>
                          </div>
                
                          <div>
                            <FieldLabel>Total Budget (₱)</FieldLabel>
                            <div className="bg-blue-50 rounded-xl p-4">
                              <p className="text-3xl font-semibold text-blue-900">
                                ₱{calculateGrandTotal().toLocaleString()}
                              </p>
                              <p className="text-xs text-blue-700 mt-1">
                                Auto-calculated from (Quantity × Unit Price)
                              </p>
                            </div>
                          </div>
                
                          <div>
                            <FieldLabel>Ledger Proof Document (Optional)</FieldLabel>
                            <div className="flex flex-col items-center gap-3">
                              <button
                                type="button"
                                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-gray-50 transition"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                <Upload className="w-6 h-6 text-gray-500" />
                                <p className="text-sm text-gray-600 mt-2">Click to upload new file</p>
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
                                <div className="w-full p-4 bg-gray-50 rounded-xl flex items-center justify-between">
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
                                      setSelectedFile(null);
                                      if (fileInputRef.current) fileInputRef.current.value = ''; 
                                    }}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                              {ledgerForm.existingProof && !selectedFile && (
                                <div className="w-full p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-green-600" />
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">Existing Proof Document</p>
                                      <p className="text-xs text-gray-500">Current file will be kept unless replaced</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t mt-4">
                          <Button variant="outline" onClick={handleEditClose} className="flex-1 rounded-xl" disabled={isUploading}>
                            Cancel
                          </Button>
                          <Button
                            onClick={handleEditEntry}
                            className="text-white flex-1 rounded-xl bg-blue-600 hover:bg-blue-700"
                            disabled={isUploading}
                          >
                            {isUploading ? 'Saving...' : 'Save Changes'}
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
          <p className="text-sm text-gray-500 mb-1">Transaction ID *</p>
          <p className="font-mono text-sm text-gray-900 break-all">{selectedEntry.id}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Type *</p>
          <Badge className={`rounded-lg ${selectedEntry.type === 'Income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {selectedEntry.type}
          </Badge>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Total Amount *</p>
          <p className="text-xl font-semibold text-blue-600">₱{selectedEntry.amount?.toLocaleString() || 0}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Status *</p>
          <div className="flex items-center gap-1">
            {getStatusIcon(selectedEntry.status)}
            <Badge className={`rounded-lg ${getStatusColor(selectedEntry.status)}`}>
              {selectedEntry.status}
            </Badge>
          </div>
        </div>
        <div className="col-span-2">
          <p className="text-sm text-gray-500 mb-1">Project Title *</p>
          <p className="text-gray-900">{selectedEntry.project}</p>
        </div>
        <div className="col-span-2">
          <p className="text-sm text-gray-500 mb-1">Description *</p>
          <p className="text-gray-900">{selectedEntry.description}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Created By *</p>
          <p className="text-sm text-gray-900">{selectedEntry.createdBy || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Created At *</p>
          <p className="text-sm text-gray-900">{selectedEntry.createdAt}</p>
        </div>
        
      <div className="col-span-2">
  <p className="text-sm text-gray-500 mb-1">Budget Breakdown Details *</p>
  {selectedEntry.budgetBreakdown && selectedEntry.budgetBreakdown.length > 0 ? (
    <div className="bg-gray-50 rounded-lg p-3 mt-1">
      {/* Header */}
      <div className="flex justify-between items-center pb-2 mb-2 border-b border-gray-300">
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Item (Unit Price x Quantity)</span>
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</span>
      </div>
      
      {/* Items */}
      <div className="space-y-1">
        {selectedEntry.budgetBreakdown.map((item, index) => (
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
      
      {/* Total */}
      <div className="flex justify-between pt-2 mt-2 border-t border-gray-300 font-semibold">
        <span className="text-gray-700">Total</span>
        <span className="text-blue-600">
          ₱{selectedEntry.budgetBreakdown.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0).toLocaleString()}
        </span>
      </div>
    </div>
  ) : (
    <p className="text-gray-500 mt-1">No budget breakdown available for this transaction.</p>
  )}
</div>

        {/* Notes Section */}
        <div className="col-span-2">
          <p className="text-sm text-gray-500 mb-1">
            {selectedEntry.status === 'Rejected' ? 'Rejection Notes *' : 'Approver Notes *'}
          </p>
          <div className={`rounded-lg p-4 ${
            selectedEntry.status === 'Rejected' ? 'bg-red-50' : 'bg-blue-50'
          }`}>
            <p className={`text-sm ${
              selectedEntry.status === 'Rejected' ? 'text-red-900' : 'text-blue-900'
            }`}>
              {selectedEntry.note || (selectedEntry.status === 'Rejected' 
                ? 'No rejection reason provided.' 
                : 'No notes available.')}
            </p>
            <p className={`text-xs mt-2 ${
              selectedEntry.status === 'Rejected' ? 'text-red-600' : 'text-blue-600'
            }`}>
              - {selectedEntry.approved_by || 'Not assigned'}
            </p>
            <p className={`text-xs mt-1 ${
              selectedEntry.status === 'Rejected' ? 'text-red-600' : 'text-blue-600'
            }`}>
              - {selectedEntry.approved_at ? `Approved on ${new Date(selectedEntry.approved_at).toLocaleDateString()}` : 'Not yet approved'}
            </p>
          </div>
        </div>

        {/* Documents Section */}
        {selectedEntry.documents && selectedEntry.documents.length > 0 && (
          <div className="col-span-2">
            <p className="text-sm text-gray-500 mb-1">Attached Documents</p>
            <div className="space-y-2">
              {selectedEntry.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
      </div>
      
      <Button onClick={() => setShowDetailsModal(false)} className="w-full rounded-xl" variant="outline">
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
          setSelectedFile(null);
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
                      setSelectedFile(null);
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
                setSelectedFile(null);
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