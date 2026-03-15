import React,  { useState, useRef } from 'react';
import ReactDOM from 'react-dom';   
import { Input } from '@/Components/ui/input';  
import { Textarea } from '@/Components/ui/textarea'; 
import { Button } from '@/Components/ui/button';  
// import { Upload, FileText, Trash2 } from 'lucide-react';
import { router } from '@inertiajs/react';
import { Card } from '@/Components/ui/card';
// import { FolderKanban, Calendar, DollarSign, Star, Users, Plus } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
// import CSGProjectsPage from '/Projects';
import { 
  FolderKanban,
  Calendar, 
  Star,
   Users,
  Search,
  Filter,
   Plus ,
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

// Field Label Component
function FieldLabel({ children }) {
  return <label className="block text-sm text-gray-700 mb-1">{children}</label>;
}

// Select Component
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

// Placeholder sub-pages
function CSGLedgerPage() { return <Card className="p-8">Ledger (placeholder)</Card>; }
function CSGProofPage() { return <Card className="p-8">Proof (placeholder)</Card>; }
function CSGMeetingsPage() { return <Card className="p-8">Meetings (placeholder)</Card>; }
function CSGRatingsPage() { return <Card className="p-8">Ratings (placeholder)</Card>; }
function CSGPerformancePage() { return <Card className="p-8">Performance (placeholder)</Card>; }
function CSGProfilePage() { return <Card className="p-8">Profile (placeholder)</Card>; }

export function CSGOfficerDashboard({ currentView, onNavigate }) {
 const [showCreateModal, setShowCreateModal] = useState(false);
  const [budgetItems, setBudgetItems] = useState([
    { id: 1, item: '', amount: '' }
  ]);
   const [newProject, setNewProject] = useState({
    title: '',
    category: '',
    description: '',
    proposedBy: '',
    startDate: '',
    endDate: '',
  });
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);
   const [showLedgerModal, setShowLedgerModal] = useState(false);

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

   const [ledgerFilePreview, setLedgerFilePreview] = useState(null);
  const ledgerFileInputRef = useRef(null);
const [ledgerEntries, setLedgerEntries] = useState([]);

// STEP 4.1: Handle ledger file upload
const handleLedgerFileUpload = (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  
  if (file.size > 10 * 1024 * 1024) {
    showToast('File size must be less than 10MB', 'error');
    return;
  }

  setLedgerFilePreview({
    name: file.name,
    size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
    type: file.type,
  });
};

// STEP 4.2: Handle add ledger entry
const handleAddLedgerEntry = () => {
  // Validate required fields
  if (!ledgerForm.amount || !ledgerForm.description || !ledgerForm.project) {
    showToast('Please fill in required fields', 'error');
    return;
  }

  // Create new entry
  const newEntry = {
    id: `TXN-${Date.now()}`,
    ...ledgerForm,
    amount: parseFloat(ledgerForm.amount),
    status: 'Draft',
    createdAt: new Date().toISOString().split('T')[0],
    version: 1,
    hash: Math.random().toString(36).substring(2, 15),
    documents: ledgerFilePreview ? [ledgerFilePreview] : [],
  };

  // Add to list (in real app, send to backend)
  setLedgerEntries([newEntry, ...ledgerEntries]);
  
  // Reset form and close modal
  setShowLedgerModal(false);
  setLedgerForm({
    type: 'Expense',
    amount: '',
    description: '',
    category: '',
    project: '',
    referenceNumber: '',
    requiresProof: true,
  });
  setLedgerFilePreview(null);
  if (ledgerFileInputRef.current) ledgerFileInputRef.current.value = '';
  
  showToast('Ledger entry added successfully', 'success');
};

// STEP 4.3: Calculate totals (optional - for summary cards)
const totalIncome = ledgerEntries
  .filter(e => e.type === 'Income' && e.status === 'Approved')
  .reduce((sum, e) => sum + e.amount, 0);

const totalExpenses = ledgerEntries
  .filter(e => e.type === 'Expense' && e.status === 'Approved')
  .reduce((sum, e) => sum + e.amount, 0);

const currentBalance = totalIncome - totalExpenses;

const handleFileUpload = (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  
  // Check file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    showToast('File size must be less than 10MB', 'error');
    return;
  }

  // Create preview object
  setFilePreview({
    name: file.name,
    size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
    type: file.type,
  });
  
  // Update form state with filename
  setNewProject({ 
    ...newProject, 
    projectFile: file.name 
  });
};

const addBudgetItem = () => {
  const newId = budgetItems.length > 0 
    ? Math.max(...budgetItems.map(item => item.id)) + 1 
    : 1;
  setBudgetItems([...budgetItems, { id: newId, item: '', amount: '' }]);
};

// STEP 7.2: Remove budget item
const removeBudgetItem = (id) => {
  if (budgetItems.length > 1) {
    setBudgetItems(budgetItems.filter(item => item.id !== id));
  }
};

const updateBudgetItem = (id, field, value) => {
  setBudgetItems(budgetItems.map(item => 
    item.id === id ? { ...item, [field]: value } : item
  ));
};

const calculateTotalBudget = () => {
  return budgetItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
};

// STEP 8: Handle project creation
const handleCreateProject = () => {
  // Validate required fields
  if (!newProject.title || !newProject.category || !newProject.description || !newProject.proposedBy) {
    showToast('Please fill in all required fields', 'error');
    return;
  }

  // Validate budget items
  const hasEmptyItems = budgetItems.some(item => !item.item || !item.amount);
  if (hasEmptyItems) {
    showToast('Please fill in all budget items', 'error');
    return;
  }

  // Validate file upload
  if (!filePreview) {
    showToast('Please upload budget proof file', 'error');
    return;
  }

  // Create project object
  const project = {
    id: Date.now(),
    ...newProject,
    budgetItems: budgetItems,
    budget: calculateTotalBudget(),
    status: 'Draft',
    progress: 0,
    createdAt: new Date().toISOString().split('T')[0],
    uploadedFile: filePreview ? {
      name: filePreview.name,
      size: filePreview.size,
      type: filePreview.type
    } : null
  };

  // Here you would send to backend
  console.log('Created project:', project);
  
  // Reset form and close modal
  setShowCreateModal(false);
  setNewProject({
    title: '',
    category: '',
    description: '',
    proposedBy: '',
    startDate: '',
    endDate: '',
  });
  setBudgetItems([{ id: 1, item: '', amount: '' }]);
  setFilePreview(null);
  if (fileInputRef.current) fileInputRef.current.value = '';
  
  showToast('Project created successfully!', 'success');
};

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
          <Button   onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-xl transition-colors">
          <Plus className="w-4 h-4" />
            New Project
          </Button>

          <Button
            onClick={() => setShowLedgerModal(true)}
                     className="text-white rounded-xl bg-blue-600 hover:bg-blue-700"
                   >
                     <Plus className="w-4 h-4 mr-2" />
                     Add Ledger Entry
          </Button>
        </div>
      </div>


      {/* STEP 6: Add Ledger Modal */}
<Modal
  open={showLedgerModal}
  onClose={() => {
    setShowLedgerModal(false);
    setLedgerForm({
      type: 'Expense',
      amount: '',
      description: '',
      category: '',
      project: '',
      referenceNumber: '',
      requiresProof: true,
    });
    setLedgerFilePreview(null);
    if (ledgerFileInputRef.current) ledgerFileInputRef.current.value = '';
  }}
  title="Add Ledger Entry"
  description="Create a new financial transaction"
>
  <div className="space-y-4 pt-6">
    {/* STEP 6.1: Type and Amount */}
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

    {/* STEP 6.2: Project Selection */}
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

    {/* STEP 6.3: Description */}
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

    {/* STEP 6.4: Category */}
    <div>
      <FieldLabel>Category</FieldLabel>
      <Input
        placeholder="e.g., Supplies, Transportation, Marketing"
        value={ledgerForm.category}
        onChange={(e) => setLedgerForm({ ...ledgerForm, category: e.target.value })}
        className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
      />
    </div>

    {/* STEP 6.5: Reference Number */}
    <div>
      <FieldLabel>Reference Number (Optional)</FieldLabel>
      <Input
        placeholder="PO number, invoice number, etc."
        value={ledgerForm.referenceNumber}
        onChange={(e) => setLedgerForm({ ...ledgerForm, referenceNumber: e.target.value })}
        className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
      />
    </div>

    {/* STEP 6.6: Requires Proof Switch */}
    <Switch
      checked={ledgerForm.requiresProof}
      onCheckedChange={(checked) => setLedgerForm({ ...ledgerForm, requiresProof: checked })}
      label="Requires Proof of Transaction"
    />

    {/* STEP 6.7: File Upload Section (conditional) */}
    {ledgerForm.requiresProof && (
      <div>
        <FieldLabel>Upload Proof Document</FieldLabel>
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-gray-50 transition"
            onClick={() => ledgerFileInputRef.current && ledgerFileInputRef.current.click()}
          >
            <Upload className="w-6 h-6 text-gray-500" />
            <p className="text-sm text-gray-600 mt-2">Click to upload</p>
            <p className="text-xs text-gray-500 mt-1">PDF, Images up to 10MB</p>
          </button>

          <input
            ref={ledgerFileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleLedgerFileUpload}
            className="hidden"
          />

          {ledgerFilePreview && (
            <div className="w-full p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{ledgerFilePreview.name}</p>
                    <p className="text-xs text-gray-500">{ledgerFilePreview.size}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setLedgerFilePreview(null);
                    if (ledgerFileInputRef.current) ledgerFileInputRef.current.value = '';
                  }}
                >
                  ✕
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    )}

    {/* STEP 6.8: Form Buttons */}
    <div className="flex gap-3 pt-4">
      <Button
        variant="outline"
        onClick={() => {
          setShowLedgerModal(false);
          setLedgerForm({
            type: 'Expense',
            amount: '',
            description: '',
            category: '',
            project: '',
            referenceNumber: '',
            requiresProof: true,
          });
          setLedgerFilePreview(null);
          if (ledgerFileInputRef.current) ledgerFileInputRef.current.value = '';
        }}
        className="flex-1 rounded-xl"
      >
        Cancel
      </Button>
      <Button
        onClick={handleAddLedgerEntry}
        disabled={!ledgerForm.amount || !ledgerForm.description || !ledgerForm.project}
        className="text-white flex-1 rounded-xl bg-blue-600 hover:bg-blue-700"
      >
        Save Entry
      </Button>
    </div>
  </div>
</Modal>

      {/* STEP 10: Add the Modal */}
<Modal
  open={showCreateModal}
  onClose={() => {
    setShowCreateModal(false);
    setNewProject({
      title: '',
      category: '',
      description: '',
      proposedBy: '',
      startDate: '',
      endDate: '',
    });
    setBudgetItems([{ id: 1, item: '', amount: '' }]);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }}
  title="Create New Project"
  description="Fill in the project details below"
>
  <div className="space-y-4 pt-6">
    {/* STEP 10.1: Project Title Field */}
    <div>
      <FieldLabel>Project Title *</FieldLabel>
      <Input
        placeholder="Enter project title"
        value={newProject.title}
        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
        className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
      />
    </div>

    {/* STEP 10.2: Category Field */}
    <div>
      <FieldLabel>Category *</FieldLabel>
      <Select value={newProject.category} onValueChange={(value) => setNewProject({ ...newProject, category: value })}>
         <option value="">Select category</option>
              <option value="Social">Social</option>
              <option value="Sports">Sports</option>
              <option value="Environmental">Environmental</option>
              <option value="Technology">Technology</option>
              <option value="Cultural">Cultural</option>
              <option value="Education">Education</option>
              <option value="Health">Health</option>
      </Select>
    </div>

    {/* STEP 10.3: Description Field */}
    <div>
      <FieldLabel>Description *</FieldLabel>
      <Textarea
        placeholder="Describe the project objectives and goals"
        value={newProject.description}
        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
        rows={4}
        className="w-full rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
      />
    </div>

    {/* STEP 10.4: Budget Breakdown Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <FieldLabel>Budget Breakdown (₱)</FieldLabel>
        <div className="space-y-3">
          {budgetItems.map((item) => (
            <div key={item.id} className="flex gap-2 items-start">
              <Input
                placeholder="Item name & Quantity"
                value={item.item}
                onChange={(e) => updateBudgetItem(item.id, 'item', e.target.value)}
                className="flex-1 h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
              />
              <Input
                type="number"
                placeholder="Amount"
                value={item.amount}
                onChange={(e) => updateBudgetItem(item.id, 'amount', e.target.value)}
                className="w-24 h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
              />
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
        <FieldLabel>Estimated Total Budget (₱)</FieldLabel>
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

    {/* STEP 10.5: File Upload Section - THIS IS THE KEY PART */}
    <div>
      <FieldLabel>Project Budget Proof (Required)</FieldLabel>
      <div className="flex flex-col items-center gap-3">
        {/* Clickable upload area */}
        <button
          type="button"
          className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-gray-50 transition"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          <Upload className="w-6 h-6 text-gray-500" />
          <p className="text-sm text-gray-600 mt-2">Click to upload</p>
          <p className="text-xs text-gray-500 mt-1">PDF, Images up to 10MB</p>
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* File preview (shows after upload) */}
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
              {/* Remove file button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilePreview(null);
                  setNewProject({ ...newProject, projectFile: '' });
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

    {/* STEP 10.6: Proposed By Field */}
    <div>
      <FieldLabel>Proposed by *</FieldLabel>
      <Input
        placeholder="Enter name of proposer"
        value={newProject.proposedBy}
        onChange={(e) => setNewProject({ ...newProject, proposedBy: e.target.value })}
        className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
      />
    </div>

    {/* STEP 10.7: Date Fields */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <FieldLabel>Start Date</FieldLabel>
        <Input
          type="date"
          value={newProject.startDate}
          onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
          className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
        />
      </div>
      <div>
        <FieldLabel>End Date</FieldLabel>
        <Input
          type="date"
          value={newProject.endDate}
          onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
          className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
        />
      </div>
    </div>

    {/* STEP 10.8: Form Buttons */}
    <div className="flex gap-3 pt-4">
      <Button
        variant="outline"
        onClick={() => {
          setShowCreateModal(false);
          setNewProject({
            title: '',
            category: '',
            description: '',
            proposedBy: '',
            startDate: '',
            endDate: '',
          });
          setBudgetItems([{ id: 1, item: '', amount: '' }]);
          setFilePreview(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }}
        className="flex-1 rounded-xl"
      >
        Cancel
      </Button>
      <Button
        onClick={handleCreateProject}
        disabled={!newProject.title || !newProject.category || !newProject.description || !newProject.proposedBy || !filePreview}
        className="text-white flex-1 rounded-xl bg-blue-600 hover:bg-blue-700"
      >
        Create Project
      </Button>
    </div>
  </div>
</Modal>

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
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${entry.type === 'income' ? 'bg-blue-100' : 'bg-red-100'}`}>
                    <DollarSign className={`w-4 h-4 ${entry.type === 'income' ? 'text-blue-600' : 'text-red-600'}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">{entry.desc}</p>
                    <p className="text-xs text-gray-500">{entry.status}</p>
                  </div>
                </div>
                <p className={`text-sm ${entry.type === 'income' ? 'text-blue-600' : 'text-red-600'}`}>{entry.amount}</p>
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