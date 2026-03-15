import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import {
  Plus,
  FolderOpen,
  DollarSign,
  FileText,
  Search,
  AlertCircle,
  Trash2,
  Upload,
} from 'lucide-react';
import { CSGProjectDetailsPage } from './ProjectDetails';

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

const initialProjects = [
  {
    id: 1,
    title: 'Community Outreach Program',
    category: 'Social',
    description: 'A comprehensive program to reach out to local communities and provide educational support.',
    status: 'Ongoing',
    approvalStatus: 'Approved',
    progress: 75,
    budget: 50000,
    startDate: '2024-11-01',
    endDate: '2024-12-15',
    createdAt: '2024-10-25',
  },
  {
    id: 2,
    title: 'Annual Sports Fest',
    category: 'Sports',
    description: 'Annual inter-department sports competition with multiple events and activities.',
    status: 'Ongoing',
    approvalStatus: 'Approved',
    progress: 45,
    budget: 75000,
    startDate: '2025-01-05',
    endDate: '2025-01-20',
    createdAt: '2024-11-15',
  },
  {
    id: 3,
    title: 'Campus Sustainability Initiative',
    category: 'Environmental',
    description: 'Green campus initiative focusing on waste reduction and renewable energy.',
    status: 'Completed',
    approvalStatus:'Pending Adviser Approval',
    progress: 90,
    budget: 40000,
    startDate: '2024-10-15',
    endDate: '2024-11-30',
    createdAt: '2024-10-01',
  },
];

function CSGProjectsPageInner() {
  const [projects, setProjects] = useState(initialProjects);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Budget breakdown state
  const [budgetItems, setBudgetItems] = useState([
    { id: 1, item: '', amount: '' }
  ]);

  // Create Project Form State
  const [newProject, setNewProject] = useState({
    title: '',
    category: '',
    description: '',
    proposedBy: '', // Added this field
    startDate: '',
    endDate: '',
  });

  // File upload states - MOVED INSIDE COMPONENT
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => { // MOVED INSIDE COMPONENT
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

  const handleCreateProject = () => {
    if (!newProject.title || !newProject.category || !newProject.description || !newProject.proposedBy) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    // Check if budget items are filled
    const hasEmptyItems = budgetItems.some(item => !item.item || !item.amount);
    if (hasEmptyItems) {
      showToast('Please fill in all budget items', 'error');
      return;
    }

    const project = {
      id: projects.length + 1,
      ...newProject,
      budgetItems: budgetItems,
      budget: calculateTotalBudget(),
      status: 'Draft',
      progress: 0,
      createdAt: new Date().toISOString().split('T')[0],
      uploadedFile: filePreview ? { // Save file info
        name: filePreview.name,
        size: filePreview.size,
        type: filePreview.type
      } : null
    };

    setProjects([...projects, project]);
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
    setFilePreview(null); // Clear file preview
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    showToast('Project created successfully!', 'success');

    // Open the newly created project
    setTimeout(() => {
      setSelectedProjectId(project.id);
    }, 300);
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-100 text-gray-700';
      case 'Pending Adviser Approval':
        return 'bg-yellow-100 text-yellow-700';
      case 'Ongoing':
        return 'bg-blue-100 text-blue-700';
      case 'Completed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }; 

  const stats = {
    total: projects.length,
    ongoing: projects.filter((p) => p.status === 'Ongoing').length,
    completed: projects.filter((p) => p.status === 'Completed').length,
    draft: projects.filter((p) => p.status === 'Draft').length,
  };

  const getApprovalStatusColor = (approvalStatus) => {
    switch (approvalStatus) {
      case 'Rejected':
        return 'bg-red-100 text-red-700';
      case 'Pending Adviser Approval':
        return 'bg-yellow-100 text-yellow-700';
      case 'Approved':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

   const approvalstats = {
    total: projects.length,
    ongoing: projects.filter((p) => p.approvalStatus === 'Rejected').length,
    completed: projects.filter((p) => p.approvalStatus === 'Pending Adviser Approval').length,
    draft: projects.filter((p) => p.approvalStatus === 'Approved').length,
  };

  // If project is selected, show details page
  if (selectedProjectId) {
    return (
      <CSGProjectDetailsPage
        projectId={selectedProjectId}
        onBack={() => setSelectedProjectId(null)}
        onUpdate={(updatedProject) => {
          setProjects(projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)));
        }}
        onDelete={(id) => {
          setProjects(projects.filter((p) => p.id !== id));
          setSelectedProjectId(null);
          showToast('Project deleted successfully', 'success');
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
          <p className="text-gray-500">Create and manage CSG projects</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="text-white rounded-xl bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Project
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-[20px] border-0 shadow-sm p-6 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Projects</p>
              <div className="flex items-center gap-3 mt-2">
                <p className="text-3xl text-blue-900">{stats.total}</p>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="rounded-[20px] border-0 shadow-sm p-6 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Ongoing</p>
              <div className="flex items-center gap-3 mt-2">
                <p className="text-3xl text-orange-600">{stats.ongoing}</p>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="rounded-[20px] border-0 shadow-sm p-6 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <div className="flex items-center gap-3 mt-2">
                <p className="text-3xl text-green-600">{stats.completed}</p>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="rounded-[20px] border-0 shadow-sm p-6 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Drafts</p>
              <div className="flex items-center gap-3 mt-2">
                <p className="text-3xl text-gray-600">{stats.draft}</p>
              </div>
            </div>
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="rounded-[20px] border-0 shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <option value="all">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Pending Adviser Approval">Pending Approval</option>
              <option value="Approved">Approved</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Projects Count */}
      <div>
        <p className="text-sm text-gray-500">
          Showing {filteredProjects.length} of {projects.length} projects
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="rounded-[20px] border-0 shadow-sm p-6 hover:shadow-md transition-all">
            {/* <div className='w-full h-[50px] bg-gradient-to-r from-blue-600 to-blue-800' ></div> */}
            {/* Header */}
            <div className="mb-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 flex-1">{project.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-gray-100 text-gray-700 rounded-lg">{project.category}</Badge>
                <Badge className={`rounded-lg ${getApprovalStatusColor(project.approvalStatus)}`}>
                  {project.approvalStatus}
                </Badge>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
               <div className="flex items-center gap-2">
                 <span className="text-xs text-gray-500">Progress</span>
                  <Badge className={`rounded-lg ${getStatusColor(project.status)}`}>
                  {project.status}
                </Badge>
               </div>
                <span className="text-xs font-medium text-gray-900">{project.progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* Budget */}
            {/* <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <span>Budget: ₱{project.budget?.toLocaleString() || 0}</span>
            </div> */}

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                onClick={() => setSelectedProjectId(project.id)}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                Open Project
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedProjectId(project.id);
                  }}
                  className="rounded-xl"
                >
                  <DollarSign className="w-4 h-4 mr-1" />
                  Ledger
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedProjectId(project.id);
                  }}
                  className="rounded-xl"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Proof
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <Card className="col-span-full rounded-[20px] border-0 shadow-sm p-12">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first project to get started'}
            </p>
            {!searchQuery && filterStatus === 'all' && (
              <Button
                onClick={() => setShowCreateModal(true)}
                className="text-white rounded-xl bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Project
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Create Project Modal */}
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
          <div>
            <FieldLabel>Project Title *</FieldLabel>
            <Input
              placeholder="Enter project title"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
            />
          </div>

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
            <FieldLabel>Description *</FieldLabel>
            <Textarea
              placeholder="Describe the project objectives and goals"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              rows={4}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
            />
          </div>

          {/* Budget Breakdown Section */}
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

          {/* File Upload Section */}
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

          {/* Proposed By Field */}
          <div>
            <FieldLabel>Proposed by *</FieldLabel>
            <Input
              placeholder="Enter name of proposer"
              value={newProject.proposedBy}
              onChange={(e) => setNewProject({ ...newProject, proposedBy: e.target.value })}
              className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
            />
          </div>

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
              disabled={!newProject.title || !newProject.category || !newProject.description || !newProject.proposedBy}
              className="text-white flex-1 rounded-xl bg-blue-600 hover:bg-blue-700"
            >
              Create Project
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function CSGProjectsPage() {
  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">CSG Projects</h2>}>
      <Head title="CSG Projects" />
      <div className="py-8 px-4 lg:px-0 md:px-0">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <CSGProjectsPageInner />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}