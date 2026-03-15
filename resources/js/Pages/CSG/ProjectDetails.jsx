import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Head } from '@inertiajs/react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Send,
  Plus,
  DollarSign,
  FileText,
  CheckCircle,
  Download,
  Eye,
  Upload,
  Hash,
  Shield,
  Star,
  Calendar,
  Clock,
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
  React.useEffect(() => {
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
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-lg flex flex-col max-h-[90vh]"
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

function Select({ className = '', children, value, onValueChange, ...props }) {
  return (
    <select
      className={[
        'w-full h-10 px-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300',
        className,
      ].join(' ')}
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
      {...props}
    >
      {children}
    </select>
  );
}

function Tabs({ defaultValue, children, className = '' }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (!child) return null; // guard against null children from conditionals
        if (child.type === TabsList) {
          return React.cloneElement(child, { activeTab, setActiveTab });
        }
        if (child.type === TabsContent) {
          return React.cloneElement(child, { activeTab });
        }
        return child;
      })}
    </div>
  );
}

function TabsList({ children, activeTab, setActiveTab, className = '' }) {
  return (
    <div className={`flex flex-wrap gap-2 bg-white rounded-xl p-1 shadow-sm border-0 ${className}`}>
      {React.Children.map(children, (child) => {
        if (!child) return null; // guard against null children from conditionals
        return React.cloneElement(child, { activeTab, setActiveTab });
      })}
    </div>
  );
}

function TabsTrigger({ value, children, activeTab, setActiveTab }) {
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
        activeTab === value
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );
}

function TabsContent({ value, children, activeTab }) {
  if (activeTab !== value) return null;
  return <div>{children}</div>;
}

function Progress({ value, className = '' }) {
  return (
    <div className={`w-full h-2 bg-gray-100 rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-blue-600 rounded-full transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
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

// FIX #1: Mock data now uses 'Draft' approvalStatus so isEditable works correctly.
// Previously 'Pending Adviser Approval' made edit/delete/submit buttons never render.
const mockProject = {
  id: 1,
  title: 'Community Outreach Program',
  category: 'Social',
  description: 'A comprehensive program to reach out to local communities and provide educational support to underprivileged children.',
  // FIX #1: Changed from 'Ongoing' — status and approvalStatus are now aligned.
  status: 'Draft',
  // FIX #1: Changed from 'Pending Adviser Approval' to 'Draft' so isEditable = true
  // and the Edit / Delete / Submit buttons are visible.
  approvalStatus: 'Draft',
  progress: 75,
  budget: 50000,
  startDate: '2024-11-01',
  endDate: '2024-12-15',
  createdAt: '2024-10-25',
  proposedBy: 'Sarah Chen, Ling, Argus, Ikaw, Ako, Sila, Tayo',
};

const mockLedgerEntries = [
  {
    id: 'TXN-2024-001',
    type: 'Income',
    amount: 50000,
    description: 'Initial Budget Allocation',
    category: 'Funding',
    requiresProof: false,
    status: 'Approved',
    createdAt: '2024-11-01',
    version: 1,
    hash: 'a7f8d9e2c3b4a5f6e7d8c9b0a1f2e3d4',
  },
  {
    id: 'TXN-2024-002',
    type: 'Expense',
    amount: 15000,
    description: 'Learning Materials Purchase',
    category: 'Supplies',
    referenceNumber: 'PO-2024-156',
    requiresProof: true,
    status: 'Approved',
    createdAt: '2024-11-05',
    version: 1,
    hash: 'b8e9f0a1d2c3b4a5f6e7d8c9b0a1f2e3',
  },
  {
    id: 'TXN-2024-003',
    type: 'Expense',
    amount: 8500,
    description: 'Transportation and Logistics',
    category: 'Transportation',
    requiresProof: true,
    status: 'Pending Adviser Approval',
    createdAt: '2024-11-10',
    version: 1,
    hash: 'c9f0a1b2e3d4c5b6a7f8e9d0c1b2a3f4',
  },
  {
    id: 'TXN-2024-004',
    type: 'Expense',
    amount: 2500,
    description: 'Promotional Materials',
    category: 'Marketing',
    requiresProof: true,
    status: 'Draft',
    createdAt: '2024-11-15',
    version: 1,
    hash: 'd0a1b2c3f4e5d6c7b8a9f0e1d2c3b4a5',
  },
];

const mockProofDocuments = [
  {
    id: 'PROOF-001',
    fileName: 'Purchase_Receipt_Materials.pdf',
    linkedTransaction: 'TXN-2024-002',
    uploadDate: '2024-11-05',
    fileType: 'PDF',
    fileSize: '2.3 MB',
    status: 'Approved',
    hash: 'sha256:b8e9f0a1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7',
  },
  {
    id: 'PROOF-002',
    fileName: 'Transport_Invoice.jpg',
    linkedTransaction: 'TXN-2024-003',
    uploadDate: '2024-11-10',
    fileType: 'Image',
    fileSize: '1.8 MB',
    status: 'Pending Approval',
    hash: 'sha256:c9f0a1b2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8',
  },
];

const mockStatusHistory = [
  {
    id: 1,
    status: 'Draft Created',
    timestamp: '2024-10-25',
    updatedBy: 'Sarah Chen',
    role: 'CSG Officer',
    description: 'Project draft created and initial details added.',
    color: 'gray',
  },
  {
    id: 2,
    status: 'Submitted for Approval',
    timestamp: '2024-10-28',
    updatedBy: 'Sarah Chen',
    role: 'CSG Officer',
    description: 'Project submitted to adviser for review and approval.',
    color: 'yellow',
  },
  {
    id: 3,
    status: 'Approved',
    timestamp: '2024-10-30',
    updatedBy: 'Dr. Maria Santos',
    role: 'Adviser',
    description: 'Project approved. Ready for execution.',
    color: 'green',
  },
  {
    id: 4,
    status: 'Execution Started',
    timestamp: '2024-11-01',
    updatedBy: 'Sarah Chen',
    role: 'CSG Officer',
    description: 'Project execution phase started. Budget allocated.',
    color: 'blue',
  },
];

export function CSGProjectDetailsPage({ projectId, onBack, onUpdate, onDelete }) {
  const [project, setProject] = useState(mockProject);
  const [ledgerEntries, setLedgerEntries] = useState(mockLedgerEntries);
  const [proofDocuments, setProofDocuments] = useState(mockProofDocuments);

  // File upload states
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);

  // FIX #3: Renamed newProject → ledgerFileData to clarify this belongs to
  // the Add Ledger modal only, not the Upload Proof modal.
  const [ledgerFileData, setLedgerFileData] = useState({ projectFile: '' });

  // Handle file upload for Add Ledger modal
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

    // FIX #3: Uses ledgerFileData instead of newProject to avoid confusion
    // with the separate Upload Proof modal's file state.
    setLedgerFileData({ projectFile: file.name });
  };

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showAddLedgerModal, setShowAddLedgerModal] = useState(false);
  const [showEditLedgerModal, setShowEditLedgerModal] = useState(false);
  const [showUploadProofModal, setShowUploadProofModal] = useState(false);
  const [showProofViewer, setShowProofViewer] = useState(false);
  const [showLedgerDetails, setShowLedgerDetails] = useState(false);

  // Selected items
  const [selectedLedger, setSelectedLedger] = useState(null);
  const [selectedProof, setSelectedProof] = useState(null);

  // Budget items — used for the Overview display
  const [budgetItems, setBudgetItems] = useState([
    { id: 1, item: 'Venue Rental', amount: 5000, notes: 'University auditorium' },
    { id: 2, item: 'Tarpaulins', amount: 1750, notes: '3x6 ft event banners' },
    { id: 3, item: 'Food Packs', amount: 15000, notes: 'For volunteers and participants' },
  ]);

  // Unified total — used by Overview display and Edit modal
  const calculateGrandTotal = (items = budgetItems) =>
    items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  // Edit modal has its own isolated copy so edits don't affect Overview until saved
  const [editBudgetItems, setEditBudgetItems] = useState([]);

  const updateEditBudgetItem = (id, field, value) =>
    setEditBudgetItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );

  const addEditBudgetItem = () =>
    setEditBudgetItems((prev) => [
      ...prev,
      { id: Date.now(), item: '', amount: '' },
    ]);

  const removeEditBudgetItem = (id) =>
    setEditBudgetItems((prev) => prev.filter((item) => item.id !== id));

  // FIX #5: editForm is initialised lazily and re-synced explicitly when the
  // edit modal opens (see setEditForm({ ...project }) in the button onClick),
  // preventing stale state from a previous edit session being carried forward.
  const [editForm, setEditForm] = useState(() => ({ ...mockProject }));

  const [ledgerForm, setLedgerForm] = useState({
    type: 'Expense',
    amount: '',
    description: '',
    category: '',
    referenceNumber: '',
    requiresProof: true,
  });

  const [proofForm, setProofForm] = useState({
    linkedTransaction: '',
    fileName: '',
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-700';
      case 'Pending Adviser Approval': return 'bg-yellow-100 text-yellow-700';
      case 'Approved':
      case 'Ongoing': return 'bg-blue-100 text-blue-700';
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getLedgerStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-700';
      case 'Pending Adviser Approval': return 'bg-yellow-100 text-yellow-700';
      case 'Approved': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Pending Adviser Approval': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'Draft': return <Clock className="w-4 h-4 text-gray-600" />;
      default: return null;
    }
  };

  const handleEditProject = () => {
    // Persist the edited budget items back to the main budgetItems state
    setBudgetItems(editBudgetItems);
    const updatedProject = { ...editForm, budget: calculateGrandTotal(editBudgetItems) };
    setProject(updatedProject);
    onUpdate?.(updatedProject);
    setShowEditModal(false);
    showToast('Project updated successfully', 'success');
  };

  // FIX #4: Added onBack() call after deletion so the user is navigated away
  // from the now-deleted project page instead of remaining on a stale view.
  const handleDeleteProject = () => {
    onDelete?.(project.id);
    setShowDeleteConfirm(false);
    showToast('Project deleted successfully', 'success');
    onBack?.();
  };

  // FIX #6: handleSubmitForApproval now updates BOTH status and approvalStatus
  // so they stay in sync. Previously only approvalStatus was checked for
  // isApprovedOrPending, while status remained as 'Draft', causing the
  // progress bar and adviser notes to not render after submission.
  const handleSubmitForApproval = () => {
    const updatedProject = {
      ...project,
      status: 'Pending Adviser Approval',
      approvalStatus: 'Pending Adviser Approval',
    };
    setProject(updatedProject);
    onUpdate?.(updatedProject);
    setShowSubmitConfirm(false);
    showToast('Project submitted for adviser approval', 'success');
  };

  const handleAddLedgerEntry = () => {
    if (!ledgerForm.amount || !ledgerForm.description) {
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
      hash: Math.random().toString(36).substring(2, 15),
    };

    setLedgerEntries([...ledgerEntries, newEntry]);
    setShowAddLedgerModal(false);
    setLedgerForm({
      type: 'Expense',
      amount: '',
      description: '',
      category: '',
      referenceNumber: '',
      requiresProof: true,
    });
    // FIX #3: Also reset the ledger-specific file state on close
    setFilePreview(null);
    setLedgerFileData({ projectFile: '' });
    showToast('Ledger entry added successfully', 'success');
  };

  const handleEditLedgerEntry = () => {
    if (!selectedLedger) return;
    const updatedEntries = ledgerEntries.map((entry) =>
      entry.id === selectedLedger.id
        ? { ...entry, ...ledgerForm, amount: parseFloat(ledgerForm.amount) }
        : entry
    );
    setLedgerEntries(updatedEntries);
    setShowEditLedgerModal(false);
    setSelectedLedger(null);
    showToast('Ledger entry updated successfully', 'success');
  };

  const handleDeleteLedgerEntry = (id) => {
    setLedgerEntries(ledgerEntries.filter((entry) => entry.id !== id));
    showToast('Ledger entry deleted', 'success');
  };

  const handleSubmitLedgerForApproval = (id) => {
    const updatedEntries = ledgerEntries.map((entry) =>
      entry.id === id ? { ...entry, status: 'Pending Adviser Approval' } : entry
    );
    setLedgerEntries(updatedEntries);
    showToast('Ledger entry submitted for approval', 'success');
  };

  const handleUploadProof = () => {
    if (!proofForm.linkedTransaction || !proofForm.fileName) {
      showToast('Please select a transaction and file', 'error');
      return;
    }

    const newProof = {
      id: `PROOF-${String(proofDocuments.length + 1).padStart(3, '0')}`,
      fileName: proofForm.fileName,
      linkedTransaction: proofForm.linkedTransaction,
      uploadDate: new Date().toISOString().split('T')[0],
      fileType: proofForm.fileName.endsWith('.pdf') ? 'PDF' : 'Image',
      fileSize: '1.2 MB',
      status: 'Pending Approval',
      hash: `sha256:${Math.random().toString(36).substring(2, 15)}`,
    };

    setProofDocuments([...proofDocuments, newProof]);
    setShowUploadProofModal(false);
    setProofForm({ linkedTransaction: '', fileName: '' });
    showToast('Proof document uploaded successfully', 'success');
  };

  // FIX #1 & #6: isEditable and isApprovedOrPending now both read from
  // approvalStatus consistently. The mock data approvalStatus is 'Draft'
  // so the edit controls render correctly on first load.
  const isEditable = project.approvalStatus === 'Draft' || project.approvalStatus === 'Rejected';
  const isApprovedOrPending =
    project.approvalStatus === 'Approved' ||
    project.approvalStatus === 'Pending Adviser Approval' ||
    project.approvalStatus === 'Ongoing';
  const isPending = project.approvalStatus === 'Pending Adviser Approval';

  const totalIncome = ledgerEntries
    .filter((e) => e.type === 'Income' && e.status === 'Approved')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpenses = ledgerEntries
    .filter((e) => e.type === 'Expense' && e.status === 'Approved')
    .reduce((sum, e) => sum + e.amount, 0);

  const currentBalance = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack} className="rounded-xl">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Projects
      </Button>

      {/* Project Header */}
      <Card className="rounded-[20px] border-0 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="text-2xl font-semibold text-gray-900">{project.title}</h1>
                <Badge className={`rounded-lg ${getStatusColor(project.approvalStatus)}`}>
                  {project.approvalStatus}
                </Badge>
                {isEditable && (
                  <Badge className="rounded-lg bg-purple-100 text-purple-700">Edit Mode</Badge>
                )}
              </div>
              <p className="text-gray-600">{project.description}</p>
            </div>

            {isApprovedOrPending && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Project Progress</span>
                  <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-3" />
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {isEditable && (
                <>
                  <Button
                    onClick={() => setShowSubmitConfirm(true)}
                    className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit for Adviser Approval
                  </Button>
                  <Button
                    onClick={() => {
                      // Re-sync editForm and editBudgetItems from latest project
                      // state each time the modal opens to prevent stale edits.
                      setEditForm({ ...project });
                      setEditBudgetItems(budgetItems.map((i) => ({ ...i })));
                      setFilePreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                      setShowEditModal(true);
                    }}
                    variant="outline"
                    className="rounded-xl"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Project
                  </Button>
                  <Button
                    onClick={() => setShowDeleteConfirm(true)}
                    variant="outline"
                    className="rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Project
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:w-64">
            <div className="bg-blue-50 rounded-xl p-4">
              <DollarSign className="w-5 h-5 text-blue-600 mb-2" />
              <p className="text-sm text-gray-500">Budget</p>
              <p className="text-xl font-semibold text-gray-900">₱{project.budget.toLocaleString()}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <Calendar className="w-5 h-5 text-blue-600 mb-2" />
              <p className="text-sm text-gray-500">Timeline</p>
              <p className="text-sm text-gray-900">
                {project.startDate} to {project.endDate}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs — full tab bar only when Approved; otherwise Overview renders alone */}
      <Tabs defaultValue="overview" className="space-y-6">
        {project.approvalStatus === 'Approved' && (
          <TabsList className="flex-wrap">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ledger">Ledger</TabsTrigger>
            <TabsTrigger value="proof">Proof</TabsTrigger>
            <TabsTrigger value="status">Status Timeline</TabsTrigger>
            <TabsTrigger value="ratings">Ratings</TabsTrigger>
          </TabsList>
        )}

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card className="rounded-[20px] border-0 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Category</p>
                <p className="text-gray-900">{project.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Created On</p>
                <p className="text-gray-900">{project.createdAt}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Start Date</p>
                <p className="text-gray-900">{project.startDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">End Date</p>
                <p className="text-gray-900">{project.endDate}</p>
              </div>
               <p className="text-sm text-gray-500 mb-1">Proposed by:</p>
                <p className="text-gray-900">{project.proposedBy}</p>
            </div>
          </Card>

          <Card className="rounded-[20px] border-0 shadow-sm p-6 mt-4">
            <h2 className="text-lg font-semibold text-gray-900">Budget Summary</h2>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="md:col-span-2">
                <h3 className="text-sm text-gray-500 mb-1">Project Budget Breakdown</h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  {budgetItems.map((item, index) => (
                    <div
                      key={item.id}
                      className={`flex justify-between py-2 ${
                        index < budgetItems.length - 1 ? 'border-b border-gray-200' : ''
                      }`}
                    >
                      <div>
                        <span className="text-sm text-gray-900">{item.item}</span>
                        {item.notes && (
                          <span className="text-xs text-gray-500 ml-2">({item.notes})</span>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        ₱{(parseFloat(item.amount) || 0).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-3 mt-1 border-t border-gray-300 font-semibold">
                    <span className="text-gray-700">Total</span>
                    <span className="text-blue-600">₱{calculateGrandTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {isApprovedOrPending && (
            <Card className="rounded-[20px] border-0 shadow-sm p-6 mt-4">
              <h2 className="text-lg font-semibold text-gray-900">Adviser Notes</h2>
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-blue-900">
                  Great initiative! Make sure to submit all receipts for ledger entries.
                </p>
                <p className="text-xs text-blue-600 mt-2">- Dr. Maria Santos</p>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Ledger Tab */}
        <TabsContent value="ledger" className="space-y-6">
          <Card className="rounded-[20px] border-0 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900">Ledger Entries</h2>
                <Badge className="bg-purple-100 text-purple-700 rounded-lg">
                  <Shield className="w-3 h-3 mr-1" />
                  SHA256 Verified
                </Badge>
              </div>
              {isEditable && (
                <Button
                  onClick={() => setShowAddLedgerModal(true)}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Ledger Entry
                </Button>
              )}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-blue-50">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Description</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Proof</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ledgerEntries.map((entry) => (
                    <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-sm text-gray-600">{entry.id}</td>
                      <td className="py-3 px-4">
                        <Badge
                          className={`rounded-lg ${
                            entry.type === 'Income'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {entry.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        ₱{entry.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 max-w-[200px] truncate text-gray-700">
                        {entry.description}
                      </td>
                      <td className="py-3 px-4">
                        {entry.requiresProof ? (
                          <Badge variant="outline" className="rounded-lg">Required</Badge>
                        ) : (
                          <span className="text-xs text-gray-400">Not required</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          {getStatusIcon(entry.status)}
                          <Badge className={`rounded-lg ${getLedgerStatusColor(entry.status)}`}>
                            {entry.status}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedLedger(entry);
                              setShowLedgerDetails(true);
                            }}
                            className="rounded-lg"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {isEditable && entry.status === 'Draft' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedLedger(entry);
                                  setLedgerForm({
                                    type: entry.type,
                                    amount: entry.amount.toString(),
                                    description: entry.description,
                                    category: entry.category,
                                    referenceNumber: entry.referenceNumber || '',
                                    requiresProof: entry.requiresProof,
                                  });
                                  setShowEditLedgerModal(true);
                                }}
                                className="rounded-lg"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteLedgerEntry(entry.id)}
                                className="rounded-lg text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSubmitLedgerForApproval(entry.id)}
                                className="rounded-lg"
                              >
                                <Send className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {ledgerEntries.map((entry) => (
                <Card key={entry.id} className="rounded-xl p-4 border shadow-sm">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-sm text-gray-600">{entry.id}</span>
                      <Badge className={`rounded-lg ${getLedgerStatusColor(entry.status)}`}>
                        {entry.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge
                        className={`rounded-lg ${
                          entry.type === 'Income'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {entry.type}
                      </Badge>
                      <span className="text-xl font-semibold text-gray-900">
                        ₱{entry.amount.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{entry.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedLedger(entry);
                          setShowLedgerDetails(true);
                        }}
                        className="rounded-lg flex-1"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      {isEditable && entry.status === 'Draft' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedLedger(entry);
                              setLedgerForm({
                                type: entry.type,
                                amount: entry.amount.toString(),
                                description: entry.description,
                                category: entry.category,
                                referenceNumber: entry.referenceNumber || '',
                                requiresProof: entry.requiresProof,
                              });
                              setShowEditLedgerModal(true);
                            }}
                            className="rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSubmitLedgerForApproval(entry.id)}
                            className="rounded-lg"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Balance Summary */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="rounded-xl p-4 bg-green-50 border-green-200">
                <p className="text-sm text-green-700 mb-1">Total Income</p>
                <p className="text-2xl font-semibold text-green-900">₱{totalIncome.toLocaleString()}</p>
              </Card>
              <Card className="rounded-xl p-4 bg-red-50 border-red-200">
                <p className="text-sm text-red-700 mb-1">Total Expenses</p>
                <p className="text-2xl font-semibold text-red-900">₱{totalExpenses.toLocaleString()}</p>
              </Card>
              <Card className="rounded-xl p-4 bg-blue-50 border-blue-200">
                <p className="text-sm text-blue-700 mb-1">Current Balance</p>
                <p className="text-2xl font-semibold text-blue-900">₱{currentBalance.toLocaleString()}</p>
              </Card>
            </div>
          </Card>
        </TabsContent>

        {/* Proof Tab */}
        <TabsContent value="proof" className="space-y-6">
          <Card className="rounded-[20px] border-0 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Proof of Transactions</h2>
              {isEditable && (
                <Button
                  onClick={() => setShowUploadProofModal(true)}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Proof
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {proofDocuments.map((proof) => (
                <Card key={proof.id} className="rounded-xl p-4 border shadow-sm hover:shadow-md transition-all">
                  <div className="space-y-3">
                    <div className="h-32 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-12 h-12 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 truncate mb-1">{proof.fileName}</h3>
                      <p className="text-xs text-gray-500">{proof.fileType} • {proof.fileSize}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="text-xs text-gray-600 font-mono truncate">
                        {proof.linkedTransaction}
                      </span>
                    </div>
                    <Badge
                      className={`rounded-lg ${
                        proof.status === 'Approved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {proof.status}
                    </Badge>
                    <p className="text-xs text-gray-400">Uploaded: {proof.uploadDate}</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedProof(proof);
                          setShowProofViewer(true);
                        }}
                        className="flex-1 rounded-lg"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      {isEditable && proof.status === 'Pending Approval' && (
                        <Button variant="outline" size="sm" className="rounded-lg text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Status Timeline Tab */}
        <TabsContent value="status" className="space-y-6">
          <Card className="rounded-[20px] border-0 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Project Status Timeline</h2>
            <div className="space-y-6">
              {mockStatusHistory.map((status, index) => (
                <div key={status.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        status.color === 'green' ? 'bg-green-100'
                        : status.color === 'blue' ? 'bg-blue-100'
                        : status.color === 'yellow' ? 'bg-yellow-100'
                        : 'bg-gray-100'
                      }`}
                    >
                      <CheckCircle
                        className={`w-6 h-6 ${
                          status.color === 'green' ? 'text-green-600'
                          : status.color === 'blue' ? 'text-blue-600'
                          : status.color === 'yellow' ? 'text-yellow-600'
                          : 'text-gray-600'
                        }`}
                      />
                    </div>
                    {index < mockStatusHistory.length - 1 && (
                      <div className="w-0.5 flex-1 bg-gray-200 min-h-[60px]" />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge
                        className={`rounded-lg ${
                          status.color === 'green' ? 'bg-green-100 text-green-700'
                          : status.color === 'blue' ? 'bg-blue-100 text-blue-700'
                          : status.color === 'yellow' ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {status.status}
                      </Badge>
                      <span className="text-sm text-gray-500">{status.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {status.updatedBy} ({status.role})
                    </p>
                    <p className="text-gray-700">{status.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Ratings Tab */}
        <TabsContent value="ratings" className="space-y-6">
            <Card className="rounded-[20px] border-0 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Student Ratings</h2>
              <div className="bg-blue-50 rounded-xl p-6 mb-6 text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-5xl font-bold text-gray-900">4.8</span>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-6 h-6 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">45 ratings</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                {[
                  { id: 1, name: 'Emma Johnson', rating: 5, comment: 'Amazing initiative! The workshops were very helpful.', date: '2024-11-20' },
                  { id: 2, name: 'James Smith', rating: 5, comment: 'This project has made a real impact in our community.', date: '2024-11-19' },
                  { id: 3, name: 'Sofia Martinez', rating: 4, comment: 'Very good project with clear objectives.', date: '2024-11-18' },
                ].map((review) => (
                  <div key={review.id} className="flex gap-4 pb-6 border-b last:border-0">
                    <Avatar className="w-12 h-12 flex-shrink-0">
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                        {review.name.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900">{review.name}</h3>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
      </Tabs>

      {/* ── Modals ── */}

      {/* Edit Project Modal */}
      <Modal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Project"
        description="Update project information"
      >
        <div className="space-y-4 pt-6">
          <div>
            <FieldLabel>Project Title</FieldLabel>
            <Input
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
            />
          </div>
          <div>
            <FieldLabel>Category</FieldLabel>
            <Select value={editForm.category} onValueChange={(value) => setEditForm({ ...editForm, category: value })}>
              <option value="Social">Social</option>
              <option value="Sports">Sports</option>
              <option value="Environmental">Environmental</option>
              <option value="Technology">Technology</option>
              <option value="Cultural">Cultural</option>
              <option value="Education">Education</option>
              <option value="Health">Health</option>
            </Select>
          </div>
          <div>
            <FieldLabel>Description</FieldLabel>
            <Textarea
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              rows={4}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
            />
          </div>

          {/* Budget Breakdown — uses editBudgetItems (isolated copy, saved on submit) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel>Budget Breakdown (₱)</FieldLabel>
              <div className="space-y-3">
                {editBudgetItems.map((item) => (
                  <div key={item.id} className="flex gap-2 items-start">
                    <Input
                      placeholder="Item name & Quantity"
                      value={item.item}
                      onChange={(e) => updateEditBudgetItem(item.id, 'item', e.target.value)}
                      className="flex-1 h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
                    />
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={item.amount}
                      onChange={(e) => updateEditBudgetItem(item.id, 'amount', e.target.value)}
                      className="w-24 h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
                    />
                    {editBudgetItems.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEditBudgetItem(item.id)}
                        className="rounded-lg text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={addEditBudgetItem}
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
              <FieldLabel>Estimated Total Budget (₱)</FieldLabel>
              <div className="bg-blue-50 rounded-xl p-4 mt-1">
                <p className="text-3xl font-semibold text-blue-900">
                  ₱{calculateGrandTotal(editBudgetItems).toLocaleString()}
                </p>
                <p className="text-xs text-blue-700 mt-1">Auto-calculated from breakdown items</p>
              </div>
            </div>
          </div>

          {/* File Upload — mirrors Create modal */}
          <div>
            <FieldLabel>Project Budget Proof (Required)</FieldLabel>
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-gray-50 transition"
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
                        setLedgerFileData({ projectFile: '' });
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Proposed By — mirrors Create modal */}
          <div>
            <FieldLabel>Proposed by *</FieldLabel>
            <Input
              placeholder="Enter name of proposer"
              value={editForm.proposedBy ?? ''}
              onChange={(e) => setEditForm({ ...editForm, proposedBy: e.target.value })}
              className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Start Date</FieldLabel>
              <Input
                type="date"
                value={editForm.startDate}
                onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
              />
            </div>
            <div>
              <FieldLabel>End Date</FieldLabel>
              <Input
                type="date"
                value={editForm.endDate}
                onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowEditModal(false)} className="flex-1 rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleEditProject} className="text-white flex-1 rounded-xl bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Submit for Approval Confirmation */}
      <Modal
        open={showSubmitConfirm}
        onClose={() => setShowSubmitConfirm(false)}
        title="Submit Project for Adviser Approval?"
        description="Once submitted, you cannot edit the project until the adviser reviews it."
      >
        <div className="pt-6">
          <p className="text-sm text-gray-600 mb-6">Make sure all details are correct before submitting.</p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowSubmitConfirm(false)} className="flex-1 rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleSubmitForApproval} className="text-white flex-1 rounded-xl bg-blue-600 hover:bg-blue-700">
              Submit
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Project?"
        description="Are you sure you want to delete this project? This action cannot be undone."
      >
        <div className="pt-6">
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="flex-1 rounded-xl">
              Cancel
            </Button>
            {/* FIX #4: handleDeleteProject now calls onBack() to navigate away */}
            <Button onClick={handleDeleteProject} className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white">
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Ledger Entry Modal */}
      <Modal
        open={showAddLedgerModal}
        onClose={() => {
          setShowAddLedgerModal(false);
          setLedgerForm({ type: 'Expense', amount: '', description: '', category: '', referenceNumber: '', requiresProof: true });
          // FIX #3: Reset ledger-specific file state on close
          setFilePreview(null);
          setLedgerFileData({ projectFile: '' });
          if (fileInputRef.current) fileInputRef.current.value = '';
        }}
        title="Add Ledger Entry"
        description="Create a new ledger entry for this project"
      >
        <div className="space-y-4 pt-6">
          <div>
            <FieldLabel>Type</FieldLabel>
            <Select value={ledgerForm.type} onValueChange={(value) => setLedgerForm({ ...ledgerForm, type: value })}>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </Select>
          </div>
          <div>
            <FieldLabel>Amount (₱)</FieldLabel>
            <Input
              type="number"
              placeholder="0.00"
              value={ledgerForm.amount}
              onChange={(e) => setLedgerForm({ ...ledgerForm, amount: e.target.value })}
              className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
            />
          </div>
          <div>
            <FieldLabel>Description</FieldLabel>
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
          <div>
            {/* FIX #3: Label updated to clarify this is a ledger-entry proof attachment,
                separate from the standalone Upload Proof modal. */}
            <FieldLabel>Attach Proof Document (Optional)</FieldLabel>
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-gray-50 transition"
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
                        setLedgerFileData({ projectFile: '' });
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowAddLedgerModal(false)} className="flex-1 rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleAddLedgerEntry} className="text-white flex-1 rounded-xl bg-blue-600 hover:bg-blue-700">
              Save Entry
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Ledger Entry Modal */}
      <Modal
        open={showEditLedgerModal}
        onClose={() => { setShowEditLedgerModal(false); setSelectedLedger(null); }}
        title="Edit Ledger Entry"
        description="Update ledger entry information"
      >
        <div className="space-y-4 pt-6">
          <div>
            <FieldLabel>Type</FieldLabel>
            <Select value={ledgerForm.type} onValueChange={(value) => setLedgerForm({ ...ledgerForm, type: value })}>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </Select>
          </div>
          <div>
            <FieldLabel>Amount (₱)</FieldLabel>
            <Input
              type="number"
              value={ledgerForm.amount}
              onChange={(e) => setLedgerForm({ ...ledgerForm, amount: e.target.value })}
              className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
            />
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
            <Button variant="outline" onClick={() => setShowEditLedgerModal(false)} className="flex-1 rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleEditLedgerEntry} className="text-white flex-1 rounded-xl bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Upload Proof Modal */}
      <Modal
        open={showUploadProofModal}
        onClose={() => { setShowUploadProofModal(false); setProofForm({ linkedTransaction: '', fileName: '' }); }}
        title="Upload Proof of Transaction"
        description="Upload supporting documents for ledger entries"
      >
        <div className="space-y-4 pt-6">
          <div>
            <FieldLabel>Linked Ledger Entry</FieldLabel>
            <Select
              value={proofForm.linkedTransaction}
              onValueChange={(value) => setProofForm({ ...proofForm, linkedTransaction: value })}
            >
              <option value="">Select transaction</option>
              {ledgerEntries
                .filter((e) => e.requiresProof)
                .map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.id} - {entry.description}
                  </option>
                ))}
            </Select>
          </div>
          <div>
            <FieldLabel>Upload File (PNG, JPG, PDF)</FieldLabel>
            <div className="flex flex-col items-center gap-3">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG or PDF (MAX. 10MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setProofForm({ ...proofForm, fileName: file.name });
                  }}
                />
              </label>
              {proofForm.fileName && (
                <div className="w-full p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">{proofForm.fileName}</span>
                  </div>
                  <button
                    onClick={() => setProofForm({ ...proofForm, fileName: '' })}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900">
                Your file will be hashed using SHA-256 for verification and immutability.
              </p>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowUploadProofModal(false)} className="flex-1 rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={handleUploadProof}
              disabled={!proofForm.linkedTransaction || !proofForm.fileName}
              className="text-white flex-1 rounded-xl bg-blue-600 hover:bg-blue-700"
            >
              Upload
            </Button>
          </div>
        </div>
      </Modal>

      {/* Ledger Details Modal */}
      <Modal
        open={showLedgerDetails}
        onClose={() => { setShowLedgerDetails(false); setSelectedLedger(null); }}
        title="Ledger Entry Details"
      >
        {selectedLedger && (
          <div className="space-y-4 pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
                <p className="font-mono text-gray-900">{selectedLedger.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Type</p>
                <Badge
                  className={`rounded-lg ${
                    selectedLedger.type === 'Income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {selectedLedger.type}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Amount</p>
                <p className="text-xl font-semibold text-gray-900">₱{selectedLedger.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <div className="flex items-center gap-1">
                  {getStatusIcon(selectedLedger.status)}
                  <Badge className={`rounded-lg ${getLedgerStatusColor(selectedLedger.status)}`}>
                    {selectedLedger.status}
                  </Badge>
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p className="text-gray-900">{selectedLedger.description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Category</p>
                <p className="text-gray-900">{selectedLedger.category}</p>
              </div>
              {selectedLedger.referenceNumber && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Reference Number</p>
                  <p className="text-gray-900">{selectedLedger.referenceNumber}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500 mb-1">Version</p>
                <Badge variant="outline" className="rounded-lg">v{selectedLedger.version}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Created At</p>
                <p className="text-sm text-gray-900">{selectedLedger.createdAt}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-2">Transaction Hash (SHA-256)</p>
                <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs text-gray-700 break-all flex items-start gap-2">
                  <Hash className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>{selectedLedger.hash}</span>
                </div>
              </div>
            </div>
            <Button onClick={() => setShowLedgerDetails(false)} className="w-full rounded-xl" variant="outline">
              Close
            </Button>
          </div>
        )}
      </Modal>

      {/* Proof Viewer Modal */}
      <Modal
        open={showProofViewer}
        onClose={() => { setShowProofViewer(false); setSelectedProof(null); }}
        title="Proof Document"
      >
        {selectedProof && (
          <div className="space-y-4 pt-6">
            <div className="h-48 bg-gray-100 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2 font-medium">{selectedProof.fileName}</p>
                <p className="text-sm text-gray-500">{selectedProof.fileType} • {selectedProof.fileSize}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Linked Transaction</p>
                <p className="font-mono text-gray-900">{selectedProof.linkedTransaction}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Upload Date</p>
                <p className="text-gray-900">{selectedProof.uploadDate}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-2">File Hash (SHA-256)</p>
                <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs text-gray-700 break-all flex items-start gap-2">
                  <Hash className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>{selectedProof.hash}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button onClick={() => setShowProofViewer(false)} variant="outline" className="flex-1 rounded-xl">
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}