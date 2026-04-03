import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';   
import { Input } from '@/Components/ui/input';  
import { Textarea } from '@/Components/ui/textarea'; 
import { Button } from '@/Components/ui/button';  
import { router } from '@inertiajs/react';
import { Card } from '@/Components/ui/card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

import { 
  FolderKanban,
  Calendar, 
  Star,
  Users,
  Search,
  Filter,
  Plus,
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

import ProjectsPage from './Projects';
import LedgerPage from './Ledger';

// Helper function to calculate status based on dates
function getAutoStatus(startDate, endDate, approvalStatus) {
  // Always calculate status from dates if they exist
  if (!startDate || !endDate) return 'Draft';
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  
  // Normalize dates to compare only date, not time
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  
  if (now < start) {
    return 'Upcoming';
  } else if (now >= start && now <= end) {
    return 'Ongoing';
  } else if (now > end) {
    return 'Completed';
  }
  
  return 'Draft';
}

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
function ProofPage() { return <Card className="p-8">Proof Documents (placeholder)</Card>; }
function MeetingsPage() { return <Card className="p-8">Meetings (placeholder)</Card>; }
function RatingsPage() { return <Card className="p-8">Ratings (placeholder)</Card>; }
function PerformancePage() { return <Card className="p-8">Performance Panel (placeholder)</Card>; }
function ProfilePage() { return <Card className="p-8">Profile (placeholder)</Card>; }

export function CSGOfficerDashboard({ currentView, onNavigate, statistics = {}, projects: initialProjects = [], recentLedgerEntries = [], upcomingMeetings: initialMeetings = [] }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [budgetItems, setBudgetItems] = useState([
    { id: 1, item: '', quantity: 1, unitPrice: '', amount: 0 }
  ]);
  const [newProject, setNewProject] = useState({
    title: '',
    category: '',
    description: '',
    objective: '',
    venue: '',
    proposedBy: '',
    startDate: '',
    endDate: '',
  });
  const [filePreview, setFilePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [showLedgerModal, setShowLedgerModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [ledgerForm, setLedgerForm] = useState({
    type: 'Expense',
    description: '',
    category: '',
    project_id: '',
    referenceNumber: '',
    requiresProof: false, // Changed to false to make proof optional by default
  });
  const [selectedLedgerFile, setSelectedLedgerFile] = useState(null);

  // Filter projects to only show approved ones
  const [dashboardProjects, setDashboardProjects] = useState(() => {
    return initialProjects.filter(project => 
      (project.approval_status || project.status || '').toLowerCase() === 'approved'
    );
  });
  
  const [ledgerEntries, setLedgerEntries] = useState(recentLedgerEntries);
  const [meetingList, setMeetingList] = useState(initialMeetings);
  const [ledgerFilePreview, setLedgerFilePreview] = useState(null);
  const ledgerFileInputRef = useRef(null);

  // Calculate stats based on approved projects only
  const approvedProjects = dashboardProjects;
  const projectStatusCounts = {
    active: approvedProjects.length,
    pending: statistics.pendingApprovals ?? 0,
    avgNet: statistics.avgNetPerProject ?? 0,
  };

  // Fetch projects on component mount to ensure we have latest approved projects
  useEffect(() => {
    fetchProjects();
  }, []);

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
          const approvedOnly = data.filter((p) => 
            ((p.approval_status || p.status || '').toString().toLowerCase() === 'approved')
          );
          setDashboardProjects(approvedOnly);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch projects', err);
        showToast('Unable to load projects', 'error');
      });
  };

  const getStatusColor = (status) => {
    switch (status) {
       case 'Upcoming':
        return 'bg-purple-100 text-purple-700';
      case 'Draft':
        return 'bg-gray-100 text-gray-700';
      case 'Pending Adviser Approval':
        return 'bg-yellow-100 text-yellow-700';
      case 'Ongoing':
        return 'bg-blue-100 text-blue-700';
      case 'Complete':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }; 

  const calculateProgressFromDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    
    // If project hasn't started yet
    if (now < start) return 0;
    
    // If project is completed
    if (now > end) return 100;
    
    // Calculate total days in project
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    // Calculate elapsed days
    const elapsedDays = Math.ceil((now - start) / (1000 * 60 * 60 * 24));
    
    // Calculate percentage
    const percentage = Math.min(Math.round((elapsedDays / totalDays) * 100), 100);
    return Math.max(percentage, 0);
  };

  // STEP 4.1: Handle ledger file upload
  const handleLedgerFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      showToast('File size must be less than 10MB', 'error');
      return;
    }

    setSelectedLedgerFile(file);
    setLedgerFilePreview({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type,
    });
  };

  // STEP 4.2: Handle add ledger entry
  const handleAddLedgerEntry = async () => {
    if (!ledgerForm.description || !ledgerForm.project_id || !ledgerForm.type) {
      showToast('Please fill in all required fields', 'error');
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
        qty: item.quantity || item.qty || 1,
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
      if (selectedLedgerFile) {
        formData.append('ledger_proof', selectedLedgerFile);
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
      const selectedProject = dashboardProjects.find(p => p.id === projectId);
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
          hasDocument: !!selectedLedgerFile,
        },
        ...ledgerEntries
      ]);

      // Reset form
      setShowLedgerModal(false);
      setLedgerForm({
        type: 'Expense',
        description: '',
        category: '',
        project_id: '',
        referenceNumber: '',
        requiresProof: false,
      });
      setBudgetItems([{ id: 1, item: '', quantity: 1, unitPrice: '', amount: 0 }]);
      setLedgerFilePreview(null);
      setSelectedLedgerFile(null);
      if (ledgerFileInputRef.current) ledgerFileInputRef.current.value = '';
      
      showToast('Ledger entry added successfully', 'success');
      
    } catch (error) {
      console.error('Error adding ledger entry:', error);
      showToast(error.message || 'Failed to add ledger entry', 'error');
    }
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

    // Store actual file object
    setSelectedFile(file);

    // Create preview object
    setFilePreview({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type,
    });
  };

  const addBudgetItem = () => {
    const newId = budgetItems.length > 0 
      ? Math.max(...budgetItems.map(item => item.id)) + 1 
      : 1;
    setBudgetItems([...budgetItems, { id: newId, item: '', quantity: 1, unitPrice: '', amount: 0 }]);
  };

  // STEP 7.2: Remove budget item
  const removeBudgetItem = (id) => {
    if (budgetItems.length > 1) {
      setBudgetItems(budgetItems.filter(item => item.id !== id));
    }
  };

  const updateBudgetItem = (id, field, value) => {
    setBudgetItems(budgetItems.map(item => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      const quantity = parseFloat(updated.quantity || updated.qty || 0) || 0;
      const unitPrice = parseFloat(updated.unitPrice || 0) || 0;
      updated.amount = quantity * unitPrice;
      return updated;
    }));
  };

  const calculateTotalBudget = () => {
    return budgetItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  };

  // Helper to resolve project name from various entry data structures
  const getProjectName = (entry) => {
    if (entry.projectName) return entry.projectName;
    if (entry.project && typeof entry.project === 'string') return entry.project;
    
    if (entry.project_id || entry.projectId) {
      const projectId = entry.project_id || entry.projectId;
      const project = dashboardProjects.find(p => p.id === projectId);
      if (project) return project.title || project.name;
    }
    
    if (entry.project && typeof entry.project === 'object') {
      return entry.project.title || entry.project.name;
    }
    
    return 'Unknown Project';
  };

  // Fetch ledger entries on component mount to ensure we show latest data
  useEffect(() => {
    const fetchLedgerEntries = () => {
      fetch('/api/ledger-entries', {
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setLedgerEntries(data);
          }
        })
        .catch((err) => {
          console.error('Failed to fetch ledger entries', err);
        });
    };
    fetchLedgerEntries();
  }, []);

  // STEP 8: Handle project creation
  const handleCreateProject = async () => {
    if (!newProject.title || !newProject.category || !newProject.description || 
        !newProject.objective || !newProject.venue || !newProject.proposedBy) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const hasEmptyItems = budgetItems.some(item => !item.item || !item.unitPrice || item.quantity <= 0);
    if (hasEmptyItems) {
      showToast('Please fill in all budget items', 'error');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('title', newProject.title);
    formData.append('description', newProject.description);
    formData.append('objective', newProject.objective);
    formData.append('venue', newProject.venue);
    formData.append('category', newProject.category);
    formData.append('budget', calculateTotalBudget().toString());
    
    // Normalize budget breakdown to match backend format
    const budgetBreakdown = budgetItems.map(item => ({
      item: item.item,
      qty: item.quantity || item.qty || 1,
      unitPrice: item.unitPrice,
      amount: item.amount || 0
    }));
    formData.append('budget_breakdown', JSON.stringify(budgetBreakdown));
    formData.append('status', 'Draft');
    formData.append('proposed_by', newProject.proposedBy);
    formData.append('start_date', newProject.startDate);
    formData.append('end_date', newProject.endDate);
    formData.append('approval_status', 'Draft');
    formData.append('archive', '0');
    
    if (selectedFile) {
      formData.append('project_proof', selectedFile);
    }

    try {
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': token,
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create project');
      }
      
      // Add the new project to the dashboard list (only if approved, but new projects are Draft by default)
      // So we don't add them to dashboardProjects since they're not approved yet
      setShowCreateModal(false);
      setNewProject({
        title: '',
        category: '',
        description: '',
        objective: '',
        venue: '',
        proposedBy: '',
        startDate: '',
        endDate: '',
      });
      setBudgetItems([{ id: 1, item: '', quantity: 1, unitPrice: '', amount: 0 }]);
      setFilePreview(null);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      showToast('Project created successfully!', 'success');
    } catch (error) {
      console.error('Error creating project:', error);
      showToast(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
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
  if (currentView === 'projects') return <ProjectsPage />;
  if (currentView === 'ledger') return <LedgerPage />;
  if (currentView === 'proof') return <ProofPage />;
  if (currentView === 'meetings') return <MeetingsPage />;
  if (currentView === 'ratings') return <RatingsPage />;
  if (currentView === 'performance-panel') return <PerformancePage />;
  if (currentView === 'profile') return <ProfilePage />;

  // Default dashboard view
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-2xl font-semibold">CSG Officer Dashboard</h1>
          <p className="text-gray-500">Manage projects, ledger, and student engagement</p>
        </div>
        <div className="hidden md:flex gap-3">
          <Button onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-xl transition-colors">
            <Plus className="w-4 h-4" />
            Create New Project
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

      {/* STEP 6: Add Ledger Modal - Proof Document is now OPTIONAL */}
      <Modal
        open={showLedgerModal}
        onClose={() => {
          setShowLedgerModal(false);
          setLedgerForm({
            type: 'Expense',
            description: '',
            category: '',
            project_id: '',
            referenceNumber: '',
            requiresProof: false,
          });
          setBudgetItems([{ id: 1, item: '', quantity: 1, unitPrice: '', amount: 0 }]);
          setLedgerFilePreview(null);
          setSelectedLedgerFile(null);
          if (ledgerFileInputRef.current) ledgerFileInputRef.current.value = '';
        }}
        title="Add Ledger Entry"
        description="Create a new financial transaction"
      >
        <div className="space-y-4 pt-6">
          {/* STEP 6.1: Type */}
          <div>
            <FieldLabel>Type *</FieldLabel>
            <Select
              className="w-full h-10 px-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-200"
              value={ledgerForm.type}
              onValueChange={(value) => setLedgerForm({ ...ledgerForm, type: value })}
            >
              <option disabled value="">Select Type</option>
              <option value="Expense">Expense</option>
              <option value="Income">Income</option>
            </Select>
          </div>

          {/* Project Selection - Only shows approved projects */}
          <div>
            <FieldLabel>Project *</FieldLabel>
            <Select
              value={ledgerForm.project_id}
              onValueChange={(value) => setLedgerForm({ ...ledgerForm, project_id: value })}
              className="w-full h-10 px-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="">Select Project</option>
              {dashboardProjects
                .filter(project => 
                  (project.approval_status || project.status || '').toLowerCase() === 'approved'
                )
                .map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title || project.name}
                  </option>
                ))
              }
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
                      value={item.quantity}
                      onChange={(e) => updateBudgetItem(item.id, 'quantity', e.target.value)}
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
                      ₱{(item.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                  ₱{calculateTotalBudget().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Auto-calculated from breakdown items
                </p>
              </div>
            </div>
          </div>

          {/* STEP 6.7: File Upload Section - NOW OPTIONAL */}
          <div>
            <FieldLabel>Attach Proof Document (Optional)</FieldLabel>
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-gray-50 transition"
                onClick={() => ledgerFileInputRef.current?.click()}
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
                <div className="w-full p-4 bg-gray-50 rounded-xl flex items-center justify-between">
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
                      setSelectedLedgerFile(null);
                      if (ledgerFileInputRef.current) ledgerFileInputRef.current.value = '';
                    }}
                  >
                    ✕
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* STEP 6.8: Form Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowLedgerModal(false);
                setLedgerForm({
                  type: 'Expense',
                  description: '',
                  category: '',
                  project_id: '',
                  referenceNumber: '',
                  requiresProof: false,
                });
                setBudgetItems([{ id: 1, item: '', quantity: 1, unitPrice: '', amount: 0 }]);
                setLedgerFilePreview(null);
                setSelectedLedgerFile(null);
                if (ledgerFileInputRef.current) ledgerFileInputRef.current.value = '';
              }}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddLedgerEntry}
              disabled={!ledgerForm.description || !ledgerForm.project_id || !ledgerForm.type || calculateTotalBudget() <= 0}
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
            objective: '',
            venue: '',
            proposedBy: '',
            startDate: '',
            endDate: '',
          });
          setBudgetItems([{ id: 1, item: '', quantity: 1, unitPrice: '', amount: 0 }]);
          setFilePreview(null);
          setSelectedFile(null);
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
              value={newProject.title || ''}
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

          <div>
            <FieldLabel>Objective *</FieldLabel>
            <Textarea
              placeholder="Describe the main objective of the project"
              value={newProject.objective || ''}
              onChange={(e) => setNewProject({ ...newProject, objective: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
            />
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

          <div>
            <FieldLabel>Venue *</FieldLabel>
            <Input
              placeholder="Enter project venue/location"
              value={newProject.venue || ''}
              onChange={(e) => setNewProject({ ...newProject, venue: e.target.value })}
              className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
            />
          </div>

          {/* STEP 10.4: Budget Breakdown Section */}
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
                      value={item.quantity}
                      onChange={(e) => updateBudgetItem(item.id, 'quantity', e.target.value)}
                      className="w-20 h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
                    />
                    <Input
                      type="number"
                      placeholder="Price"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateBudgetItem(item.id, 'unitPrice', e.target.value)}
                      className="w-28 h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
                    />
                    <div className="w-28 h-10 flex items-center justify-end px-3 bg-gray-100 rounded-xl text-gray-700 font-medium">
                      ₱{(item.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                  disabled={budgetItems.some(item => !item.item || !item.unitPrice || item.quantity <= 0)}
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
                  ₱{calculateTotalBudget().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Auto-calculated from breakdown items
                </p>
              </div>
            </div>
          </div>

          {/* STEP 10.5: File Upload Section */}
          <div>
            <FieldLabel>Project Budget Proof (Optional)</FieldLabel>
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
                  objective: '',
                  venue: '',
                  proposedBy: '',
                  startDate: '',
                  endDate: '',
                });
                setBudgetItems([{ id: 1, item: '', quantity: 1, unitPrice: '', amount: 0 }]);
                setFilePreview(null);
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateProject}
              disabled={!newProject.title || !newProject.category || !newProject.description || !newProject.objective || !newProject.venue || !newProject.proposedBy}
              className="text-white flex-1 rounded-xl bg-blue-600 hover:bg-blue-700"
            >
              Create Project
            </Button>
          </div>
        </div>
      </Modal>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Projects"
          value={projectStatusCounts.active}
          hint={`${projectStatusCounts.pending} pending approval`}
          icon={<FolderKanban />}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Avg. Net Per Project"
          value={`₱${Number(projectStatusCounts.avgNet).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          hint="Positive trend"
          icon={<DollarSign />}
          iconBg="bg-green-50"
          iconColor="text-green-600"
        />
        <StatsCard
          title="Avg. Rating"
          value={statistics.averageRating || 0}
          hint={`${statistics.totalRatings || 0} ratings`}
          icon={<Star />}
          iconBg="bg-yellow-50"
          iconColor="text-yellow-600"
        />
        <StatsCard
          title="Student Satisfaction Rate"
          value={`${statistics.csatRate || 0}%`}
          hint="CSAT Score"
          icon={<Users />}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      {/* Active Projects - Now only shows approved projects */}
      <Card className="p-6 rounded-2xl border-0 shadow-sm bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-900">Active Projects</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dashboardProjects && dashboardProjects.length > 0 ? (
            dashboardProjects.slice(0, 4).map((project, index) => (
              <div 
                key={project.id || index} 
                onClick={() => router.visit(`/csg/projects/${project.id}`)}
                className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm text-gray-900">{project.title ?? 'Untitled Project'}</p>
                    <p className="text-xs text-gray-500 mt-1">Timeline: {project.start_date ?? 'N/A'} - {project.end_date ?? 'N/A'}</p>
                  </div>
                  <Badge variant="secondary" className={`rounded-lg ${getStatusColor(getAutoStatus(project.start_date, project.end_date, project.approval_status))}`}>
                    {getAutoStatus(project.start_date, project.end_date, project.approval_status) ?? 'Draft'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Progress</span>
                    <span className="text-gray-900">{calculateProgressFromDays(project.start_date, project.end_date) ?? 0}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${calculateProgressFromDays(project.start_date, project.end_date) ?? 0}%` }}></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">No approved projects found</div>
          )}
        </div>
      </Card>

      {/* Recent Ledger & Upcoming Meetings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       <Card className="p-6 rounded-2xl border-0 shadow-sm bg-white">
  <h2 className="text-gray-900 mb-4">Recent Ledger Entries</h2>
  <div className="max-h-96 overflow-y-auto space-y-3">
    {ledgerEntries && ledgerEntries.length > 0 ? (
      ledgerEntries.slice(0, 10).map((entry, index) => {
        // Normalize entry type to ensure consistent comparison
        const entryType = (entry.type || '').toLowerCase();
        const isIncome = entryType === 'income';
        const isExpense = entryType === 'expense';
        
        // Get the amount safely
        const amount = entry.amount || 0;
        
        return (
          <div key={entry.id || index} className="flex items-center justify-between py-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isIncome ? 'bg-green-100' : isExpense ? 'bg-red-100' : 'bg-gray-100'}`}>
                <DollarSign className={`w-4 h-4 ${isIncome ? 'text-green-600' : isExpense ? 'text-red-600' : 'text-gray-600'}`} />
              </div>
             <div className="flex-1">
  <p className="text-sm text-gray-900 font-medium">
    {entry.description || entry.desc || 'No Description'}
  </p>
  <p className="text-xs text-gray-700 mt-0.5">
    {getProjectName(entry)}
  </p>
  <div className="flex items-center gap-2 mt-1">
    <p className="text-xs text-gray-500">
      {entry.status || 'Draft'}
    </p>
    {entry.created_at && (
      <p className="text-xs text-gray-400">
        • {new Date(entry.created_at).toLocaleDateString()}
      </p>
    )}
    {!entry.created_at && entry.createdAt && (
      <p className="text-xs text-gray-400">
        • {new Date(entry.createdAt).toLocaleDateString()}
      </p>
    )}
  </div>
</div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-semibold ${isIncome ? 'text-green-600' : isExpense ? 'text-red-600' : 'text-gray-600'}`}>
                 {isIncome ? '+' : isExpense ? '-' : ''}₱{(entry.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              {entry.category && (
                <p className="text-xs text-gray-400 mt-0.5">{entry.category}</p>
              )}
            </div>
          </div>
        );
      })
    ) : (
      <div className="text-center py-8">
        <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-500">No ledger entries found</p>
        <p className="text-xs text-gray-400 mt-1">Add your first transaction to get started</p>
      </div>
    )}
  </div>
</Card>

        <Card className="p-6 rounded-2xl border-0 shadow-sm bg-white">
          <h2 className="text-gray-900 mb-4">Upcoming Meetings</h2>
          <div className="space-y-3">
            {meetingList && meetingList.length > 0 ? (
              meetingList.slice(0, 5).map((meeting, index) => (
                <div key={meeting.id || index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{meeting.title}</p>
                    <p className="text-xs text-gray-500">{meeting.date} • {meeting.time}</p>
                    <p className="text-xs text-gray-400 mt-1">{meeting.attendees} expected attendees</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No upcoming meetings scheduled</div>
            )}
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