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
  Upload,
  Download,
  Eye,
  FileText,
  CheckCircle,
  XCircle,
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

const mockMeetings = [
  {
    id: 1,
    title: 'General Assembly',
    date: '2024-11-28',
    time: '2:00 PM',
    location: 'University Auditorium',
    description: 'Quarterly general assembly to discuss project updates and student concerns',
    status: 'Scheduled',
    expectedAttendees: 250,
    hasMinutes: false,
    createdAt: '2024-11-01',
  },
  {
    id: 2,
    title: 'Budget Planning Session',
    date: '2024-12-02',
    time: '10:00 AM',
    location: 'CSG Office',
    description: 'Planning session for Q1 2025 budget allocation',
    status: 'Scheduled',
    expectedAttendees: 15,
    hasMinutes: false,
    createdAt: '2024-11-10',
  },
  {
    id: 3,
    title: 'Project Review Meeting',
    date: '2024-11-15',
    time: '3:00 PM',
    location: 'Conference Room A',
    description: 'Review of ongoing projects and timeline adjustments',
    status: 'Completed',
    expectedAttendees: 30,
    actualAttendees: 28,
    hasMinutes: true,
    minutesFile: 'Minutes_Nov15_ProjectReview.pdf',
    createdAt: '2024-10-25',
  },
  {
    id: 4,
    title: 'Student Welfare Committee Meeting',
    date: '2024-11-10',
    time: '1:00 PM',
    location: 'CSG Office',
    description: 'Discussion on student wellness programs and initiatives',
    status: 'Completed',
    expectedAttendees: 20,
    actualAttendees: 18,
    hasMinutes: true,
    minutesFile: 'Minutes_Nov10_Welfare.pdf',
    createdAt: '2024-10-20',
  },
  {
    id: 5,
    title: 'Sports Fest Planning',
    date: '2024-10-30',
    time: '4:00 PM',
    location: 'Sports Complex',
    description: 'Initial planning for Annual Sports Fest 2025',
    status: 'Completed',
    expectedAttendees: 25,
    actualAttendees: 22,
    hasMinutes: true,
    minutesFile: 'Minutes_Oct30_SportsFest.pdf',
    createdAt: '2024-10-15',
  },
];

function CSGMeetingsPageInner() {
  const [meetings, setMeetings] = useState(mockMeetings);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUploadMinutesModal, setShowUploadMinutesModal] = useState(false);
  const [showViewMinutesModal, setShowViewMinutesModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  // File upload states for edit modal
  const [editFilePreview, setEditFilePreview] = useState(null);
  const editFileInputRef = useRef(null);

  // Form state
  const [meetingForm, setMeetingForm] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    expectedAttendees: '',
  });

  const [minutesFile, setMinutesFile] = useState('');

  const stats = {
    totalMeetings: meetings.length,
    upcomingMeetings: meetings.filter(m => m.status === 'Scheduled').length,
    completedMeetings: meetings.filter(m => m.status === 'Completed').length,
  };

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

  const handleCreateMeeting = () => {
    if (!meetingForm.title || !meetingForm.date || !meetingForm.time || !meetingForm.location) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const newMeeting = {
      id: meetings.length + 1,
      ...meetingForm,
      status: 'Scheduled',
      expectedAttendees: parseInt(meetingForm.expectedAttendees) || 0,
      hasMinutes: false,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setMeetings([newMeeting, ...meetings]);
    setShowCreateModal(false);
    setMeetingForm({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      expectedAttendees: '',
    });
    showToast('Meeting created successfully', 'success');
  };

  const handleEditMeeting = () => {
    if (!selectedMeeting) return;

    const updatedMeetings = meetings.map(m =>
      m.id === selectedMeeting.id
        ? {
            ...m,
            title: meetingForm.title,
            date: meetingForm.date,
            time: meetingForm.time,
            location: meetingForm.location,
            description: meetingForm.description,
            expectedAttendees: parseInt(meetingForm.expectedAttendees) || 0,
            // Add file if uploaded
            ...(editFilePreview && {
              hasMinutes: true,
              minutesFile: editFilePreview.name,
            }),
          }
        : m
    );

    setMeetings(updatedMeetings);
    setShowEditModal(false);
    setSelectedMeeting(null);
    setEditFilePreview(null);
    if (editFileInputRef.current) editFileInputRef.current.value = '';
    showToast('Meeting updated successfully', 'success');
  };

  const handleDeleteMeeting = () => {
    if (!selectedMeeting) return;
    setMeetings(meetings.filter(m => m.id !== selectedMeeting.id));
    setShowDeleteModal(false);
    setSelectedMeeting(null);
    showToast('Meeting deleted successfully', 'success');
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {meetings.filter(m => m.status === 'Scheduled').map((meeting) => (
              <Card key={meeting.id} className="rounded-[20px] border-0 shadow-sm p-6 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{meeting.title}</h3>
                    <Badge className={getStatusColor(meeting.status)}>
                      {meeting.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{meeting.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{meeting.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{meeting.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>{meeting.expectedAttendees} expected attendees</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{meeting.description}</p>

                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-lg"
                    onClick={() => {
                      setSelectedMeeting(meeting);
                      setMeetingForm({
                        title: meeting.title,
                        date: meeting.date,
                        time: meeting.time,
                        location: meeting.location,
                        description: meeting.description,
                        expectedAttendees: meeting.expectedAttendees.toString(),
                      });
                      setShowEditModal(true);
                    }}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg text-red-600 hover:bg-red-50"
                    onClick={() => {
                      setSelectedMeeting(meeting);
                      setShowDeleteModal(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}

            {meetings.filter(m => m.status === 'Scheduled').length === 0 && (
              <Card className="col-span-full rounded-[20px] border-0 shadow-sm p-12">
                <div className="text-center">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming meetings</h3>
                  <p className="text-gray-500 mb-6">Create a new meeting to get started</p>
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="text-white rounded-xl bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Meeting
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Past Meetings */}
        <TabsContent value="past">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {meetings.filter(m => m.status === 'Completed').map((meeting) => (
              <Card key={meeting.id} className="rounded-[20px] border-0 shadow-sm p-6 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{meeting.title}</h3>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(meeting.status)}>
                        {meeting.status}
                      </Badge>
                      {meeting.hasMinutes && (
                        <Badge className="bg-purple-100 text-purple-700">
                          <FileText className="w-3 h-3 mr-1" />
                          Minutes Available
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{meeting.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{meeting.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{meeting.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>
                      {meeting.actualAttendees || 0} / {meeting.expectedAttendees} attended
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{meeting.description}</p>

                <div className="flex gap-2 pt-2 border-t">
                  {meeting.hasMinutes ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-lg"
                      onClick={() => {
                        setSelectedMeeting(meeting);
                        setShowViewMinutesModal(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Minutes
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-lg"
                      onClick={() => {
                        setSelectedMeeting(meeting);
                        setShowUploadMinutesModal(true);
                      }}
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Upload Minutes
                    </Button>
                  )}
                </div>
              </Card>
            ))}

            {meetings.filter(m => m.status === 'Completed').length === 0 && (
              <Card className="col-span-full rounded-[20px] border-0 shadow-sm p-12">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No past meetings</h3>
                  <p className="text-gray-500">Completed meetings will appear here</p>
                </div>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel>Date *</FieldLabel>
              <Input
                type="date"
                value={meetingForm.date}
                onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
                className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
              />
            </div>
            <div>
              <FieldLabel>Time *</FieldLabel>
              <Input
                type="time"
                value={meetingForm.time}
                onChange={(e) => setMeetingForm({ ...meetingForm, time: e.target.value })}
                className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <FieldLabel>Location *</FieldLabel>
            <Input
              placeholder="Enter meeting location"
              value={meetingForm.location}
              onChange={(e) => setMeetingForm({ ...meetingForm, location: e.target.value })}
              className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
            />
          </div>

          <div>
            <FieldLabel>Expected Attendees</FieldLabel>
            <Input
              type="number"
              placeholder="0"
              value={meetingForm.expectedAttendees}
              onChange={(e) => setMeetingForm({ ...meetingForm, expectedAttendees: e.target.value })}
              className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
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
              disabled={!meetingForm.title || !meetingForm.date || !meetingForm.time || !meetingForm.location}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel>Date *</FieldLabel>
              <Input
                type="date"
                value={meetingForm.date}
                onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
                className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
              />
            </div>
            <div>
              <FieldLabel>Time *</FieldLabel>
              <Input
                type="time"
                value={meetingForm.time}
                onChange={(e) => setMeetingForm({ ...meetingForm, time: e.target.value })}
                className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <FieldLabel>Location *</FieldLabel>
            <Input
              value={meetingForm.location}
              onChange={(e) => setMeetingForm({ ...meetingForm, location: e.target.value })}
              className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
            />
          </div>

          <div>
            <FieldLabel>Expected Attendees</FieldLabel>
            <Input
              type="number"
              value={meetingForm.expectedAttendees}
              onChange={(e) => setMeetingForm({ ...meetingForm, expectedAttendees: e.target.value })}
              className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
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

          {/* File Attachment Section */}
          <div>
            <FieldLabel>Meeting Minutes (Required)</FieldLabel>
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-gray-50 transition"
                onClick={() => editFileInputRef.current && editFileInputRef.current.click()}
              >
                <Upload className="w-6 h-6 text-gray-500" />
                <p className="text-sm text-gray-600 mt-2">Click to upload minutes document</p>
                <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX up to 10MB</p>
              </button>

              <input
                ref={editFileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleEditFileUpload}
                className="hidden"
              />

              {editFilePreview && (
                <div className="w-full p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{editFilePreview.name}</p>
                        <p className="text-xs text-gray-500">{editFilePreview.size}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditFilePreview(null);
                        if (editFileInputRef.current) editFileInputRef.current.value = '';
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
              Save Changes
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
                {selectedMeeting.date} at {selectedMeeting.time}
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
        description={selectedMeeting?.title}
      >
        {selectedMeeting && (
          <div className="space-y-4 pt-6">
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm text-blue-900">
                <strong>{selectedMeeting.date}</strong> at {selectedMeeting.time}
              </p>
              <p className="text-xs text-blue-700 mt-1">{selectedMeeting.location}</p>
            </div>

            <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2 font-medium">{selectedMeeting.minutesFile}</p>
                <p className="text-sm text-gray-500">PDF Document</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700">
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