import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { Badge } from '@/Components/ui/badge';
import {
  Plus,
  Calendar,
  MapPin,
  Users,
  Clock,
  Edit,
  Trash2,
  Send,
  Upload,
  Download,
  Eye,
  FileText,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
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

function Tabs({ defaultValue, children, className = '' }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className={className}>
      {React.Children.map(children, child => {
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
    <div className={`flex gap-2 bg-white rounded-xl p-1 shadow-sm border-0 ${className}`}>
      {React.Children.map(children, child => {
        return React.cloneElement(child, { activeTab, setActiveTab });
      })}
    </div>
  );
}

function TabsTrigger({ value, children, activeTab, setActiveTab }) {
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
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

function CSGMeetingsPageInner() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUploadMinutesModal, setShowUploadMinutesModal] = useState(false);
  const [showViewMinutesModal, setShowViewMinutesModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  // Pagination for Upcoming Meetings
  const [currentPageUpcoming, setCurrentPageUpcoming] = useState(1);
  const [currentPagePast, setCurrentPagePast] = useState(1);
  const itemsPerPage = 6;

  // File upload states for edit modal
  const [editFilePreview, setEditFilePreview] = useState(null);
  const editFileInputRef = useRef(null);

  // Add this function inside CSGMeetingsPageInner component
const renderAttendees = (attendees) => {
  if (!attendees) return null;
  
  // Handle both array and string formats
  let attendeesList = [];
  if (Array.isArray(attendees)) {
    attendeesList = attendees;
  } else if (typeof attendees === 'string' && attendees.trim()) {
    // If it's a comma-separated string
    attendeesList = attendees.split(',').map(a => a.trim());
  }
  
  if (attendeesList.length === 0) return null;
  
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Users className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-700">Attendees</span>
        <Badge className="bg-blue-100 text-blue-700 text-xs">
          {attendeesList.length}
        </Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        {attendeesList.map((attendee, index) => (
          <Badge 
            key={index} 
            className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <Avatar className="w-5 h-5 mr-1">
              <AvatarFallback className="text-xs bg-gray-200">
                {attendee.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {attendee}
          </Badge>
        ))}
      </div>
    </div>
  );
};

  // Form state
  const [meetingForm, setMeetingForm] = useState({
    title: '',
    scheduled_date: '',
    description: '',
    expected_attendees: 0,
    attendees: '',
    proof: null,
  });

  // Proof file preview state
  const [proofFilePreview, setProofFilePreview] = useState(null);
  const proofFileInputRef = useRef(null);

  // Fetch meetings from API on component mount
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setLoading(true);
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
        const response = await fetch('/api/meetings', {
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': csrfToken || '',
          },
        });

        if (!response.ok) {
          console.error('API Response Status:', response.status);
          const errorText = await response.text();
          console.error('Response text:', errorText);
          throw new Error(`Failed to fetch meetings: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched meetings:', data);
        
        if (Array.isArray(data)) {
          setMeetings(data);
        } else {
          console.error('API returned non-array data:', data);
          setMeetings([]);
          showToast('API returned unexpected format', 'error');
        }
      } catch (error) {
        console.error('Error fetching meetings:', error);
        console.error('Error details:', error.message);
        showToast(`Failed to load meetings: ${error.message}`, 'error');
        setMeetings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const [minutesFile, setMinutesFile] = useState('');

  const stats = {
    totalMeetings: meetings.length,
    upcomingMeetings: meetings.filter(m => m.status === 'Scheduled').length,
    completedMeetings: meetings.filter(m => m.status === 'Completed').length,
  };

  // Filter meetings by status
  const upcomingMeetings = meetings.filter(m => m.status === 'Scheduled');
  const pastMeetings = meetings.filter(m => m.status === 'Completed');

  // Pagination for Upcoming Meetings
  const totalUpcomingPages = Math.ceil(upcomingMeetings.length / itemsPerPage);
  const indexOfLastUpcoming = currentPageUpcoming * itemsPerPage;
  const indexOfFirstUpcoming = indexOfLastUpcoming - itemsPerPage;
  const currentUpcomingMeetings = upcomingMeetings.slice(indexOfFirstUpcoming, indexOfLastUpcoming);

  // Pagination for Past Meetings
  const totalPastPages = Math.ceil(pastMeetings.length / itemsPerPage);
  const indexOfLastPast = currentPagePast * itemsPerPage;
  const indexOfFirstPast = indexOfLastPast - itemsPerPage;
  const currentPastMeetings = pastMeetings.slice(indexOfFirstPast, indexOfLastPast);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Scheduled':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'Completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleCreateMeeting = async () => {
    if (!meetingForm.title || !meetingForm.scheduled_date || !meetingForm.description) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
      
      const payload = {
        title: meetingForm.title,
        scheduled_date: meetingForm.scheduled_date,
        description: meetingForm.description,
        expected_attendees: meetingForm.expected_attendees ? parseInt(meetingForm.expected_attendees) : 0,
        attendees: meetingForm.attendees,
      };
      
      console.log('Sending payload:', payload);
      
      const response = await fetch('/api/meetings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken || '',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response Status:', response.status);
      
      const responseData = await response.json();
      console.log('Response Data:', responseData);

      if (!response.ok) {
        const errorMsg = responseData.message || responseData.error || `API Error: ${response.status}`;
        throw new Error(errorMsg);
      }

      showToast('Meeting created successfully', 'success');
      setShowCreateModal(false);
      setMeetingForm({
        title: '',
        scheduled_date: '',
        description: '',
        expected_attendees: 0,
        attendees: '',
        proof: null,
      });
      
      // Refresh meetings list
      const refreshResponse = await fetch('/api/meetings', {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      const data = await refreshResponse.json();
      if (Array.isArray(data)) setMeetings(data);
    } catch (error) {
      console.error('Error creating meeting:', error);
      showToast(`Error: ${error.message}`, 'error');
    }
  };

 const handleEditMeeting = async () => {
  if (!selectedMeeting) return;
  if (!meetingForm.title || !meetingForm.scheduled_date || !meetingForm.description) {
    showToast('Please fill in all required fields', 'error');
    return;
  }

  try {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
    
    // Use FormData to handle file upload
    const formData = new FormData();
    formData.append('title', meetingForm.title);
    formData.append('scheduled_date', meetingForm.scheduled_date);
    formData.append('description', meetingForm.description);
    formData.append('expected_attendees', meetingForm.expected_attendees ? parseInt(meetingForm.expected_attendees) : 0);
    
    // Important: Handle attendees properly - it should be a string, not JSON
    // The backend expects 'attendees' to be a string (will be cast to JSON in the model)
    formData.append('attendees', meetingForm.attendees ? meetingForm.attendees : '');
    
    if (meetingForm.proof && meetingForm.proof instanceof File) {
      formData.append('proof', meetingForm.proof);
    }
    
    // Add _method for PUT since we're using POST with method override
    formData.append('_method', 'PUT');
    
    console.log('Sending update with FormData');
    
    const response = await fetch(`/api/meetings/${selectedMeeting.id}`, {
      method: 'POST', // Use POST with _method override
      headers: {
        'X-CSRF-TOKEN': csrfToken || '',
        'Accept': 'application/json',
        // Don't set Content-Type header when using FormData - browser will set it with boundary
      },
      body: formData,
    });

    console.log('Response Status:', response.status);
    
    const responseData = await response.json();
    console.log('Response Data:', responseData);

    if (!response.ok) {
      const errorMsg = responseData.message || responseData.error || `API Error: ${response.status}`;
      throw new Error(errorMsg);
    }

    showToast('Meeting updated successfully', 'success');
    setShowEditModal(false);
    setSelectedMeeting(null);
    setEditFilePreview(null);
    setProofFilePreview(null);
    if (editFileInputRef.current) editFileInputRef.current.value = '';
    if (proofFileInputRef.current) proofFileInputRef.current.value = '';
    
    // Refresh meetings list
    const refreshResponse = await fetch('/api/meetings', {
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    const data = await refreshResponse.json();
    if (Array.isArray(data)) setMeetings(data);
  } catch (error) {
    console.error('Error updating meeting:', error);
    showToast(`Error: ${error.message}`, 'error');
  }
};

  const handleDeleteMeeting = async () => {
    if (!selectedMeeting) return;

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
      const response = await fetch(`/api/meetings/${selectedMeeting.id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': csrfToken || '',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete meeting: ${response.status}`);
      }

      showToast('Meeting deleted successfully', 'success');
      setShowDeleteModal(false);
      setSelectedMeeting(null);
      
      // Refresh meetings list
      const refreshResponse = await fetch('/api/meetings', {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      const data = await refreshResponse.json();
      if (Array.isArray(data)) setMeetings(data);
    } catch (error) {
      console.error('Error deleting meeting:', error);
      showToast(`Error: ${error.message}`, 'error');
    }
  };

  const handleMarkAsDone = async () => {
    if (!selectedMeeting) return;

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
      
      const response = await fetch(`/api/meetings/${selectedMeeting.id}/mark-as-done`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken || '',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to mark meeting as done: ${response.status}`);
      }

      showToast('Meeting marked as completed', 'success');
      setShowEditModal(false);
      setSelectedMeeting(null);
      
      // Refresh meetings list
      const refreshResponse = await fetch('/api/meetings', {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      const data = await refreshResponse.json();
      if (Array.isArray(data)) setMeetings(data);
    } catch (error) {
      console.error('Error marking meeting as done:', error);
      showToast(`Error: ${error.message}`, 'error');
    }
  };

  const handleUploadMinutes = () => {
    if (!selectedMeeting || !minutesFile) {
      showToast('Please select a file', 'error');
      return;
    }

    const updatedMeetings = meetings.map(m =>
      m.id === selectedMeeting.id
        ? {
            ...m,
            hasMinutes: true,
            minutesFile: minutesFile,
            status: 'Completed',
          }
        : m
    );

    setMeetings(updatedMeetings);
    setShowUploadMinutesModal(false);
    setMinutesFile('');
    setSelectedMeeting(null);
    showToast('Meeting minutes uploaded successfully', 'success');
  };

  const handleEditFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      showToast('File size must be less than 10MB', 'error');
      return;
    }

    setEditFilePreview({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type,
    });
  };

  // Pagination component
  const PaginationControls = ({ currentPage, totalPages, onPageChange, className = "" }) => {
    if (totalPages <= 1) return null;

    return (
      <div className={`flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg ${className}`}>
        <div className="flex flex-1 justify-between sm:hidden">
          <Button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </Button>
          <Button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
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
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
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
                      onClick={() => onPageChange(page)}
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
                onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
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
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Meetings</h1>
          <p className="text-gray-500">Schedule and manage CSG meetings</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="text-white rounded-xl bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Meeting
        </Button>
      </div>

      {/* Loading State */}
      {loading ? (
        <Card className="rounded-[20px] border-0 shadow-sm p-12 text-center">
          <p className="text-gray-600">Loading meetings...</p>
        </Card>
      ) : (
        <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-[20px] border-0 shadow-sm p-6 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Meetings</p>
              <div className="flex items-center gap-3 mt-2">
                <p className="text-3xl text-blue-600">{stats.totalMeetings}</p>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="rounded-[20px] border-0 shadow-sm p-6 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Upcoming</p>
              <div className="flex items-center gap-3 mt-2">
                <p className="text-3xl text-yellow-600">{stats.upcomingMeetings}</p>
              </div>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="rounded-[20px] border-0 shadow-sm p-6 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <div className="flex items-center gap-3 mt-2">
                <p className="text-3xl text-green-600">{stats.completedMeetings}</p>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Meetings</TabsTrigger>
          <TabsTrigger value="past">Past Meetings</TabsTrigger>
        </TabsList>

        {/* Upcoming Meetings */}
       <TabsContent value="upcoming">
  {upcomingMeetings.length > 0 && (
    <div className="flex justify-between items-center mb-6">
      <p className="text-sm text-gray-500">
        Showing {indexOfFirstUpcoming + 1} to {Math.min(indexOfLastUpcoming, upcomingMeetings.length)} of {upcomingMeetings.length} upcoming meetings
      </p>
    </div>
  )}
  
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {currentUpcomingMeetings.map((meeting) => (
      <Card key={meeting.id} className="rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col">
        <div className="p-5 flex flex-col h-full">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-1">{meeting.title}</h3>
              <Badge className={getStatusColor(meeting.status)}>
                {meeting.status}
              </Badge>
            </div>
          </div>

          {/* Date and Time Section */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">{meeting.date || meeting.scheduled_date?.split('T')[0] || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">{meeting.time || meeting.scheduled_date?.split('T')[1]?.substring(0, 5) || 'N/A'}</span>
            </div>
          </div>

          {/* Attendees Section */}
          {meeting.expected_attendees && meeting.expected_attendees > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">{meeting.expected_attendees} expected {meeting.expected_attendees === 1 ? 'attendee' : 'attendees'}</span>
            </div>
          )}

          {/* Description Section */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
            {meeting.description || 'No description provided'}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 mt-auto border-t border-gray-200">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => {
                setSelectedMeeting(meeting);
                setMeetingForm({
                  title: meeting.title,
                  scheduled_date: meeting.scheduled_date ? meeting.scheduled_date.substring(0, 16) : '',
                  description: meeting.description,
                  expected_attendees: meeting.expected_attendees || 0,
                  attendees: Array.isArray(meeting.attendees) ? meeting.attendees.join(', ') : (meeting.attendees || ''),
                  proof: null,
                });
                setProofFilePreview(null);
                setShowEditModal(true);
              }}
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          <Button
  variant="outline"
  size="sm"
  className="rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
  onClick={() => {
    setSelectedMeeting(meeting);
    handleMarkAsDone();
  }}
>
  <Send className="w-4 h-4" />
</Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
              onClick={() => {
                setSelectedMeeting(meeting);
                setShowDeleteModal(true);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    ))}

    {/* Empty State */}
    {upcomingMeetings.length === 0 && (
      <Card className="col-span-full rounded-xl border-0 shadow-sm p-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming meetings</h3>
          <p className="text-gray-500 mb-6">Create a new meeting to get started</p>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="text-white rounded-lg bg-blue-600 hover:bg-blue-700 shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Meeting
          </Button>
        </div>
      </Card>
    )}
  </div>
  
  {/* Pagination */}
  {upcomingMeetings.length > 0 && totalUpcomingPages > 1 && (
    <PaginationControls
      currentPage={currentPageUpcoming}
      totalPages={totalUpcomingPages}
      onPageChange={setCurrentPageUpcoming}
      className="mt-8"
    />
  )}
</TabsContent>

        {/* Past Meetings */}
<TabsContent value="past">
  {pastMeetings.length > 0 && (
    <div className="flex justify-between items-center mb-6">
      <p className="text-sm text-gray-500">
        Showing {indexOfFirstPast + 1} to {Math.min(indexOfLastPast, pastMeetings.length)} of {pastMeetings.length} past meetings
      </p>
      <Badge className="bg-gray-100 text-gray-600 px-3 py-1">
        {pastMeetings.length} Completed
      </Badge>
    </div>
  )}
  
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {currentPastMeetings.map((meeting) => (
      <Card 
        key={meeting.id} 
        className="rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col bg-white overflow-hidden"
      >
        <div className="p-5 flex flex-col h-full">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-1">
                {meeting.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={`${getStatusColor(meeting.status)} flex items-center gap-1 px-2 py-1`}>
                  {getStatusIcon(meeting.status)}
                  <span>{meeting.status}</span>
                </Badge>
                {meeting.hasMinutes && (
                  <Badge className="bg-purple-100 text-purple-700 flex items-center gap-1 px-2 py-1">
                    <FileText className="w-3 h-3" />
                    <span>Minutes Available</span>
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Date and Time Section */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">
                {meeting.date || meeting.scheduled_date?.split('T')[0] || 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">
                {meeting.time || meeting.scheduled_date?.split('T')[1]?.substring(0, 5) || 'N/A'}
              </span>
            </div>
          </div>

          {/* Attendance Section */}
          {((meeting.attendees && (Array.isArray(meeting.attendees) ? meeting.attendees.length > 0 : meeting.attendees.trim())) || (meeting.expected_attendees && meeting.expected_attendees > 0)) && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">Attendance Rate</span>
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {(() => {
                    let attendeesCount = 0;
                    if (meeting.attendees) {
                      if (Array.isArray(meeting.attendees)) {
                        attendeesCount = meeting.attendees.length;
                      } else if (typeof meeting.attendees === 'string' && meeting.attendees.trim()) {
                        attendeesCount = meeting.attendees.split(',').filter(a => a.trim()).length;
                      }
                    }
                    return `${attendeesCount} / ${meeting.expected_attendees || 0}`;
                  })()}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-green-500 rounded-full h-2 transition-all duration-500"
                  style={{ 
                    width: `${((() => {
                      let attendeesCount = 0;
                      if (meeting.attendees) {
                        if (Array.isArray(meeting.attendees)) {
                          attendeesCount = meeting.attendees.length;
                        } else if (typeof meeting.attendees === 'string' && meeting.attendees.trim()) {
                          attendeesCount = meeting.attendees.split(',').filter(a => a.trim()).length;
                        }
                      }
                      return (attendeesCount / (meeting.expected_attendees || 1)) * 100;
                    })())}%` 
                  }}
                />
              </div>
            </div>
          )}

          {/* Attendees List */}
         {meeting.attendees && (Array.isArray(meeting.attendees) ? meeting.attendees.length > 0 : meeting.attendees.trim()) && (
  <div className="mb-4">
    <div className="flex items-center gap-2 mb-3">
      <Users className="w-4 h-4 text-gray-400" />
      <span className="text-sm font-medium text-gray-700">Attendees</span>
      <Badge className="bg-blue-100 text-blue-700 text-xs">
        {(() => {
          if (Array.isArray(meeting.attendees)) return meeting.attendees.length;
          if (typeof meeting.attendees === 'string' && meeting.attendees.trim()) {
            return meeting.attendees.split(',').filter(a => a.trim()).length;
          }
          return 0;
        })()}
      </Badge>
    </div>
    <div className="flex flex-wrap gap-1">
      {(() => {
        let attendeesList = [];
        if (Array.isArray(meeting.attendees)) {
          attendeesList = meeting.attendees;
        } else if (typeof meeting.attendees === 'string' && meeting.attendees.trim()) {
          attendeesList = meeting.attendees.split(',').map(a => a.trim());
        }
        
        const maxDisplay = 3;
        
        return (
          <div className="text-sm text-gray-600">
            {attendeesList.slice(0, maxDisplay).join(', ')}
            {attendeesList.length > maxDisplay && (
              <span className="text-blue-600 ml-1">
                +{attendeesList.length - maxDisplay} more
              </span>
            )}
          </div>
        );
      })()}
    </div>
  </div>
)}

          {/* Description */}
          {meeting.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
              {meeting.description}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 mt-auto border-t border-gray-200">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 rounded-lg hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all duration-200"
              onClick={() => {
                setSelectedMeeting(meeting);
                setShowViewMinutesModal(true);
              }}
            >
              <Eye className="w-4 h-4 mr-1" />
              View Minutes
            </Button>
            
            {/* Optional Download Button if minutes file exists */}
            {meeting.meeting_proof && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200"
                onClick={() => {
                  if (meeting.minutes_file_url) {
                    window.open(meeting.minutes_file_url, '_blank');
                  }
                }}
              >
                <Download className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    ))}

    {/* Empty State */}
    {pastMeetings.length === 0 && (
      <Card className="col-span-full rounded-xl border-0 shadow-sm p-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No past meetings</h3>
          <p className="text-gray-500 mb-6">
            Completed meetings will appear here once you mark them as done.
          </p>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="text-white rounded-lg bg-blue-600 hover:bg-blue-700 shadow-sm transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create a Meeting
          </Button>
        </div>
      </Card>
    )}
  </div>
  
  {/* Pagination */}
  {pastMeetings.length > 0 && totalPastPages > 1 && (
    <div className="mt-8">
      <PaginationControls
        currentPage={currentPagePast}
        totalPages={totalPastPages}
        onPageChange={setCurrentPagePast}
        className="mt-6"
      />
    </div>
  )}
</TabsContent>
      </Tabs>
        </>
      )}

      {/* Create Meeting Modal */}
      <Modal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Meeting"
        description="Fill in the meeting details below"
      >
        <div className="space-y-4 pt-6">
          <div>
            <FieldLabel>Meeting Title *</FieldLabel>
            <Input
              placeholder="Enter meeting title"
              value={meetingForm.title}
              onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })}
              className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
            />
          </div>

          <div>
            <FieldLabel>Date & Time *</FieldLabel>
            <Input
              type="datetime-local"
              value={meetingForm.scheduled_date}
              onChange={(e) => setMeetingForm({ ...meetingForm, scheduled_date: e.target.value })}
              className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
            />
          </div>

          <div>
            <FieldLabel>Number of Expected Attendees</FieldLabel>
            <Input
              type="number"
              placeholder="0"
              value={meetingForm.expected_attendees}
              onChange={(e) => setMeetingForm({ ...meetingForm, expected_attendees: e.target.value })}
              className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
              min="0"
            />
          </div>

          <div>
            <FieldLabel>Description</FieldLabel>
            <Textarea
              placeholder="Enter meeting description"
              value={meetingForm.description}
              onChange={(e) => setMeetingForm({ ...meetingForm, description: e.target.value })}
              rows={4}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateMeeting}
              disabled={!meetingForm.title || !meetingForm.scheduled_date || !meetingForm.description}
              className="text-white flex-1 rounded-xl bg-blue-600 hover:bg-blue-700"
            >
              Create Meeting
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Meeting Modal with File Attachment */}
      <Modal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedMeeting(null);
          setEditFilePreview(null);
          if (editFileInputRef.current) editFileInputRef.current.value = '';
        }}
        title="Edit Meeting"
        description="Update meeting information"
      >
        <div className="space-y-4 pt-6">
          <div>
            <FieldLabel>Meeting Title *</FieldLabel>
            <Input
              value={meetingForm.title}
              onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })}
              className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
            />
          </div>

          <div>
            <FieldLabel>Date & Time *</FieldLabel>
            <Input
              type="datetime-local"
              value={meetingForm.scheduled_date}
              onChange={(e) => setMeetingForm({ ...meetingForm, scheduled_date: e.target.value })}
              className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
            />
          </div>

          <div>
            <FieldLabel>Number of Expected Attendees</FieldLabel>
            <Input
              type="number"
              placeholder="0"
              value={meetingForm.expected_attendees}
              onChange={(e) => setMeetingForm({ ...meetingForm, expected_attendees: e.target.value })}
              className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
              min="0"
            />
          </div>

          <div>
            <FieldLabel>Description</FieldLabel>
            <Textarea
              value={meetingForm.description}
              onChange={(e) => setMeetingForm({ ...meetingForm, description: e.target.value })}
              rows={4}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
            />
          </div>

          <div>
  <FieldLabel>Attendees</FieldLabel>
  <Input
    placeholder="List all of the attendees here (comma separated)"
    value={meetingForm.attendees}
    onChange={(e) => setMeetingForm({ ...meetingForm, attendees: e.target.value })}
    className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
  />
  <p className="text-xs text-gray-500 mt-1">
    Enter attendees names separated by commas
  </p>
</div>

          <div>
            <FieldLabel>Meeting Proof or Meeting Minutes File (Optional)</FieldLabel>
            <div className="flex flex-col gap-3">
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center py-3">
                  <Upload className="w-5 h-5 mb-2 text-gray-400" />
                  <p className="text-xs text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-400">PDF, JPG, PNG (MAX. 10MB)</p>
                </div>
                <input
                  ref={proofFileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setProofFilePreview(file.name);
                      setMeetingForm({ ...meetingForm, proof: file });
                    }
                  }}
                />
              </label>
              {proofFilePreview && (
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600 flex-1 truncate">{proofFilePreview}</span>
                  <button
                    onClick={() => {
                      setProofFilePreview(null);
                      setMeetingForm({ ...meetingForm, proof: null });
                      if (proofFileInputRef.current) proofFileInputRef.current.value = '';
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditModal(false);
                setEditFilePreview(null);
                if (editFileInputRef.current) editFileInputRef.current.value = '';
              }}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditMeeting}
              className="text-white flex-1 rounded-xl bg-blue-600 hover:bg-blue-700"
            >
              Update Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Upload Minutes Modal */}
      <Modal
        open={showUploadMinutesModal}
        onClose={() => {
          setShowUploadMinutesModal(false);
          setMinutesFile('');
          setSelectedMeeting(null);
        }}
        title="Upload Meeting Minutes"
        description="Upload the minutes document for this meeting"
      >
        <div className="space-y-4 pt-6">
          {selectedMeeting && (
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm font-medium text-blue-900">{selectedMeeting.title}</p>
              <p className="text-xs text-blue-700 mt-1">
                {selectedMeeting.date || selectedMeeting.scheduled_date?.split('T')[0]} at {selectedMeeting.time || selectedMeeting.scheduled_date?.split('T')[1]?.substring(0, 5)}
              </p>
            </div>
          )}

          <div>
            <FieldLabel>Upload Minutes Document</FieldLabel>
            <div className="flex flex-col items-center gap-3">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">PDF, DOC, DOCX (MAX. 10MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setMinutesFile(file.name);
                    }
                  }}
                />
              </label>
              {minutesFile && (
                <div className="w-full p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">{minutesFile}</span>
                  </div>
                  <button
                    onClick={() => setMinutesFile('')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowUploadMinutesModal(false)}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUploadMinutes}
              disabled={!minutesFile}
              className="text-white flex-1 rounded-xl bg-blue-600 hover:bg-blue-700"
            >
              Upload Minutes
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Minutes Modal */}
      <Modal
        open={showViewMinutesModal}
        onClose={() => {
          setShowViewMinutesModal(false);
          setSelectedMeeting(null);
        }}
        title="Meeting Minutes"
        // description={selectedMeeting?.title}
        description={"View the meeting details"}
      >
        {selectedMeeting && (
          <div className="space-y-4 pt-6">

            <div className='grid grid-cols-2 gap-4'>
              <div>
               <p className="text-sm text-gray-500 mb-1">Meeting Title *</p>
                <p className="text-base font-medium text-gray-900">{selectedMeeting.title}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Status *</p>
                 <Badge className={`${getStatusColor(selectedMeeting.status)}`}>
                  {getStatusIcon(selectedMeeting.status)}
                  <span>{selectedMeeting.status}</span>
                </Badge>
              </div>
             


              <div className='col-span-2'>
                <p className="text-sm text-gray-500 mb-1">Description *</p>
                <p className="text-base font-medium text-gray-900 whitespace-pre-wrap">{selectedMeeting.description || 'No description provided'}</p>
              </div>

              <div>
  <p className="text-sm text-gray-500 mb-1">Attendees *</p>
  <p className="text-base font-medium text-gray-900 whitespace-pre-wrap">
    {selectedMeeting.attendees?.length 
      ? selectedMeeting.attendees.join(', ')
      : 'No attendees specified'}
  </p>
</div>

        <div>
                <p className="text-sm text-gray-500 mb-1">Time & Date *</p>
                <p className="text-base font-medium text-gray-900">
                  {selectedMeeting.date || selectedMeeting.scheduled_date?.split('T')[0]} at {selectedMeeting.time || selectedMeeting.scheduled_date?.split('T')[1]?.substring(0, 5)}
                </p>
              </div>

            </div>
         

            <div className="h-40 bg-gray-100 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2 font-medium">{selectedMeeting.minutes_file_name || selectedMeeting.minutesFile || 'Meeting Minutes'}</p>
                <p className="text-sm text-gray-500">Document</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button className="flex-1 rounded-xl text-white bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Download Minutes
              </Button>
              <Button
                onClick={() => setShowViewMinutesModal(false)}
                variant="outline"
                className="flex-1 rounded-xl"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedMeeting(null);
        }}
        title="Delete Meeting"
        description="Are you sure you want to delete this meeting? This action cannot be undone."
      >
        <div className="pt-6">
          <p className="text-sm text-gray-600 mb-6">
            Meeting: <span className="font-medium">{selectedMeeting?.title}</span>
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
              onClick={handleDeleteMeeting}
              className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Meeting
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function CSGMeetingsPage() {
  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">CSG Meetings</h2>}>
      <Head title="CSG Meetings" />
      <div className="py-8 px-4 lg:px-0 md:px-0">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <CSGMeetingsPageInner />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}