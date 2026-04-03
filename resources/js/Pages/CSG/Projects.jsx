import React, { useState, useRef, useEffect } from 'react';
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
  ChevronLeft,
  ChevronRight,
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

function CSGProjectsPageInner() {
  const [projects, setProjects] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(() => {
    const match = window.location.pathname.match(/\/csg\/projects\/(.+)$/);
    return match ? match[1] : null;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterApprovalStatus, setFilterApprovalStatus] = useState('all');
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
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const normalizeProject = (p) => ({
    id: p.id,
    title: p.title || '',
    category: p.category || '',
    description: p.description || '',
    objective: p.objective || '',
    venue: p.venue || '',
    status: p.status || '',
    approvalStatus: p.approval_status || p.approvalStatus || '',
    progress: p.progress || 0,
    budget: p.budget || 0,
    budgetBreakdown: p.budget_breakdown
      ? (typeof p.budget_breakdown === 'string' ? JSON.parse(p.budget_breakdown) : p.budget_breakdown)
      : (p.budgetBreakdown || []),
    startDate: p.start_date || p.startDate || '',
    endDate: p.end_date || p.endDate || '',
    createdAt: p.created_at || p.createdAt || '',
    proposedBy: p.proposed_by || p.proposedBy || '',
    note: p.note || '',
    approveBy: p.approve_by || p.approveBy || '',
    projectProof: p.project_proof || p.projectProof || null,
    createdBy: p.created_by || p.createdBy || null,
    updatedBy: p.updated_by || p.updatedBy || null,
    archive: p.archive || 0,
    approvedAt: p.approved_at || p.approvedAt || null,
  });

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      showToast('File size must be less than 10MB', 'error');
      return;
    }
    
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Only PDF, JPG, and PNG files are allowed', 'error');
      return;
    }
    
    setSelectedFile(file);
    setFilePreview({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type
    });
  };

  // Fetch projects from backend
  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects', {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      
      const data = await response.json();
      setProjects(
        Array.isArray(data)
          ? data.map((p) => normalizeProject(p))
          : []
      );
    } catch (error) {
      console.error('Error fetching projects:', error);
      showToast('Failed to load projects from server', 'error');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch specific project when selectedProjectId is set and not in projects array
  useEffect(() => {
    if (!selectedProjectId) return;
    
    const projectExists = projects.some(p => p.id === selectedProjectId);
    if (!projectExists) {
      const fetchSpecificProject = async () => {
        try {
          const response = await fetch(`/api/projects/${selectedProjectId}`, {
            headers: {
              'Accept': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            }
          });
          
          if (response.ok) {
            const project = await response.json();
            // Only add if it's not already in the array
            setProjects(prev => {
              const exists = prev.some(p => p.id === project.id);
              return exists ? prev : [...prev, normalizeProject(project)];
            });
          }
        } catch (error) {
          console.error('Error fetching specific project:', error);
        }
      };
      
      fetchSpecificProject();
    }
  }, [selectedProjectId]);

  useEffect(() => {
    const onPopState = () => {
      const match = window.location.pathname.match(/\/csg\/projects\/(.+)$/);
      if (match) {
        setSelectedProjectId(match[1]);
      } else {
        setSelectedProjectId(null);
      }
    };

    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      window.history.pushState(null, '', `/csg/projects/${selectedProjectId}`);
    } else {
      window.history.pushState(null, '', '/csg/projects');
    }
  }, [selectedProjectId]);

  const addBudgetItem = () => {
    const newId = budgetItems.length > 0 
      ? Math.max(...budgetItems.map(item => item.id)) + 1 
      : 1;
    setBudgetItems([...budgetItems, { id: newId, item: '', quantity: 1, unitPrice: '', amount: 0 }]);
  };

  const removeBudgetItem = (id) => {
    if (budgetItems.length > 1) {
      setBudgetItems(budgetItems.filter(item => item.id !== id));
    }
  };

  const updateBudgetItem = (id, field, value) => {
    setBudgetItems(budgetItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        if (field === 'quantity' || field === 'unitPrice') {
          const quantity = field === 'quantity' ? parseFloat(value) || 0 : parseFloat(item.quantity) || 0;
          const unitPrice = field === 'unitPrice' ? parseFloat(value) || 0 : parseFloat(item.unitPrice) || 0;
          updatedItem.amount = quantity * unitPrice;
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const calculateTotalBudget = () => {
    return budgetItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  };

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
    formData.append('budget_breakdown', JSON.stringify(budgetItems));
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
      
      // Normalize and add the new project to the list
      const createdProject = normalizeProject(data);
      setProjects([createdProject, ...projects]);
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
      setTimeout(() => {
        setSelectedProjectId(createdProject.id);
      }, 300);
    } catch (error) {
      console.error('Error creating project:', error);
      showToast(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate project status based on dates
  const getCalculatedStatus = (project) => {
    // Get dates from either camelCase or snake_case
    if (!project.startDate || !project.endDate) {
      console.log(`Project "${project.title}" - No dates set, returning Draft`);
      return 'Draft';
    }
    
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const startDate = new Date(project.startDate);
      const endDate = new Date(project.endDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      
      // Check if dates are valid
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.log(`Project "${project.title}" - Invalid date format`, {startDate: project.startDate, endDate: project.endDate});
        return 'Draft';
      }
      
      if (today < startDate) {
        return 'Upcoming';
      } else if (today > endDate) {
        return 'Completed';
      } else if (today >= startDate && today <= endDate) {
        return 'Ongoing';
      }
      
      return 'Draft';
    } catch (error) {
      console.error(`Error calculating status for project "${project.title}":`, error);
      return 'Draft';
    }
  };

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.objective && project.objective.toLowerCase().includes(searchQuery.toLowerCase()));
    const calculatedStatus = getCalculatedStatus(project);
    const matchesStatus = filterStatus === 'all' || calculatedStatus === filterStatus;
    const matchesApprovalStatus = filterApprovalStatus === 'all' || project.approvalStatus === filterApprovalStatus;
    const matchesCategory = filterCategory === 'all' || project.category === filterCategory;
    return matchesSearch && matchesStatus && matchesApprovalStatus && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus, filterApprovalStatus]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-100 text-gray-700';
      case 'Upcoming':
        return 'bg-purple-100 text-purple-700';
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
    ongoing: projects.filter((p) => getCalculatedStatus(p) === 'Ongoing').length,
    completed: projects.filter((p) => getCalculatedStatus(p) === 'Completed').length,
    draft: projects.filter((p) => getCalculatedStatus(p) === 'Draft').length,
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

  // If project is selected, show details page with the specific project data
  if (selectedProjectId) {
    const selectedProject = projects.find(p => p.id === selectedProjectId);
    
    return (
      <CSGProjectDetailsPage
        projectId={selectedProjectId}
        initialProject={selectedProject}
        onBack={() => setSelectedProjectId(null)}
        onUpdate={(updatedProject) => {
          setProjects(projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)));
        }}
        onDelete={async (id) => {
          setProjects(projects.filter((p) => p.id !== id));
          setSelectedProjectId(null);
          showToast('Project deleted successfully', 'success');
        }}
      />
    );
  }

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

  const getProjectButton = (project) => {
    if (project.archive) {
      return (
        <Button className="w-full rounded-xl bg-gray-300 text-gray-600 cursor-not-allowed" disabled>
          <FolderOpen className="w-4 h-4 mr-2" />
          Archived
        </Button>
      );
    }

    switch (project.approvalStatus) {
      case 'Approved':
        return <Button  
          onClick={() => setSelectedProjectId(project.id)}
          className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
            <FolderOpen className="w-4 h-4 mr-2" />
            Open Project
        </Button>;      case 'Pending Adviser Approval':
        return <Button 
          onClick={() => setSelectedProjectId(project.id)}
          className="w-full rounded-xl bg-yellow-600 hover:bg-yellow-700 text-white">
            <FolderOpen className="w-4 h-4 mr-2" />
            Open Project
        </Button>;
      case 'Rejected':
        return <Button 
          onClick={() => setSelectedProjectId(project.id)}
          className="w-full rounded-xl bg-gray-600 hover:bg-gray-700 text-white">
            <FolderOpen className="w-4 h-4 mr-2" />
            Edit Project
        </Button>;
      default:
        return <Button 
          onClick={() => setSelectedProjectId(project.id)}
          className="w-full rounded-xl bg-gray-600 hover:bg-gray-700 text-white">
            <FolderOpen className="w-4 h-4 mr-2" />
            Edit Project
        </Button>;
    }
  };

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
              <option value="all" disabled>Project Status</option>
              <option value="all">All Projects</option>
              <option value="Draft">Draft</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </Select>
          </div>
          <div className="w-full md:w-48">
            <Select value={filterApprovalStatus} onValueChange={setFilterApprovalStatus}>
              <option value="all" disabled>All Approval Status</option>
              <option value="all">All Projects</option>
              <option value="Draft">Draft</option>
              <option value="Pending Adviser Approval">Pending Approval</option>
              <option value="Approved">Approved</option>
            </Select>
          </div>
          <div className="w-full md:w-48">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <option value="all" disabled>All Categories</option>
              <option value="all">All Projects</option>
              <option value="Social">Social</option>
              <option value="Sports">Sports</option>
              <option value="Environmental">Environmental</option>
               <option value="Technology ">Technology</option>
                <option value="Cultural ">Cultural</option>
                 <option value="Education">Education</option>
                  <option value="Health ">Health</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Projects Count */}
      <div>
        <p className="text-sm text-gray-500">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProjects.length)} of {filteredProjects.length} projects
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.map((project) => (
          <Card key={project.id} className="rounded-[20px] border-0 shadow-sm p-6 hover:shadow-md transition-all">
            {/* Header */}
            <div className="mb-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 flex-1 truncate">{project.title}</h3>
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
                  <Badge className={`rounded-lg ${getStatusColor(getCalculatedStatus(project))}`}>
                    {getCalculatedStatus(project)}
                  </Badge>
                </div>
                <span className="text-xs font-medium text-gray-900">{calculateProgressFromDays(project.startDate, project.endDate)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${calculateProgressFromDays(project.startDate, project.endDate)}%` }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            {getProjectButton(project)}
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

      {/* Pagination */}
      {filteredProjects.length > 0 && totalPages > 1 && (
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

      {/* Create Project Modal */}
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
          <div>
            <FieldLabel>Project Title *</FieldLabel>
            <Input
              placeholder="Enter project title"
              value={newProject.title || ''}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
            />
          </div>

          <div>
            <FieldLabel>Category *</FieldLabel>
            <Select value={newProject.category || ''} onValueChange={(value) => setNewProject({ ...newProject, category: value })}>
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

          <div>
            <FieldLabel>Description *</FieldLabel>
            <Textarea
              placeholder="Describe the project details and goals"
              value={newProject.description || ''}
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
                      placeholder="Price"
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
                  ₱{calculateTotalBudget().toLocaleString()}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Auto-calculated from breakdown items
                </p>
              </div>
            </div>
          </div>

          <div>
          <FieldLabel>Project Budget Proof (Optional)</FieldLabel>
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
          <p className="text-xs text-gray-500 mt-2">
            Upload supporting documents for budget justification (e.g., quotations, estimates)
          </p>
        </div>

          {/* Proposed By Field */}
          <div>
            <FieldLabel>Proposed by *</FieldLabel>
            <Input
              placeholder="Enter name of proposer"
              value={newProject.proposedBy || ''}
              onChange={(e) => setNewProject({ ...newProject, proposedBy: e.target.value })}
              className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel>Start Date</FieldLabel>
              <Input
                type="date"
                value={newProject.startDate || ''}
                onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
              />
            </div>
            <div>
              <FieldLabel>End Date</FieldLabel>
              <Input
                type="date"
                value={newProject.endDate || ''}
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
            disabled={!newProject.title || !newProject.category || !newProject.description || 
                     !newProject.objective || !newProject.venue || !newProject.proposedBy || isLoading}
            className="text-white flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Project'}
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