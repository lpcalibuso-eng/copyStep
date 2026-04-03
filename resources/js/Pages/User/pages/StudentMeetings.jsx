import { useState } from 'react';
import { Card } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { StudentModal } from '@/Components/ui/StudentModal';
import { Calendar, Clock, MapPin, Users, FileText, CheckCircle2 } from 'lucide-react';

export default function StudentMeetingsPage({ onNavigate, meetingsUpcoming = [], meetingsPast = [] }) {
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatFullDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getMeetingIcon = (location) => {
    const loc = (location || '').toLowerCase();
    if (loc.includes('zoom') || loc.includes('online')) {
      return '🌐';
    }
    return '📍';
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 text-2xl font-semibold mb-2">Meetings</h1>
        <p className="text-gray-500">View upcoming and past CSG meetings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white rounded-xl p-2 shadow-sm border border-gray-100">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'upcoming'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Upcoming
          <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
            activeTab === 'upcoming'
              ? 'bg-white/20 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}>
            {meetingsUpcoming.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'past'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Past Meetings
          <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
            activeTab === 'past'
              ? 'bg-white/20 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}>
            {meetingsPast.length}
          </span>
        </button>
      </div>

      {/* Upcoming Meetings */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {meetingsUpcoming.map((meeting) => (
            <Card key={meeting.id} className="p-6 rounded-[20px] border-0 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Date Box */}
                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex flex-col items-center justify-center text-white shadow-md">
                  <p className="text-xs">{formatDate(meeting.date).split(' ')[0]}</p>
                  <p className="text-2xl font-bold">{formatDate(meeting.date).split(' ')[1]}</p>
                </div>

                {/* Meeting Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-gray-900 font-semibold mb-2">
  {meeting.title}{' '}
  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">Schedule</Badge>
</h3>
                     
                    </div>
                  </div>

                  {/* <p className="text-sm text-gray-600 mb-4">{meeting.description}</p> */}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>{meeting.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span>{meeting.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span>{meeting.attendees} expected</span>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="flex md:flex-col gap-2">
                  <button
                    onClick={() => setSelectedMeeting(meeting)}
                    className="flex-1 md:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Past Meetings */}
      {activeTab === 'past' && (
        <div className="space-y-4">
          {meetingsPast.length === 0 && (
            <Card className="p-8 rounded-[20px] border-0 shadow-sm text-center text-gray-600">No past meetings to show. Completed meetings with minutes appear after adviser approval.</Card>
          )}
          {meetingsPast.map((meeting) => (
            <Card key={meeting.id} className="p-6 rounded-[20px] border-0 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Date Box */}
                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex flex-col items-center justify-center text-white shadow-md">
                  <p className="text-xs">{formatDate(meeting.date).split(' ')[0]}</p>
                  <p className="text-2xl font-bold">{formatDate(meeting.date).split(' ')[1]}</p>
                </div>

                {/* Meeting Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-gray-900 font-semibold gap-2 mb-2">{meeting.title}

                        <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200">Completed</Badge>
                      </h3>
                      <div className="flex gap-2">
                        
                        {meeting.attended && (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Attended
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* <p className="text-sm text-gray-600 mb-4">{meeting.description}</p> */}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span>{meeting.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-600" />
                      <span>{meeting.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-600" />
                      <span>{meeting.attendees} attended</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col gap-2">
                  <button
                    onClick={() => setSelectedMeeting(meeting)}
                    className="flex-1 md:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium"
                  >
                    View Details
                  </button>
                  {meeting.minutesAvailable && (
                    <button className="flex-1 md:flex-none px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors font-medium flex items-center justify-center gap-2">
                      <FileText className="w-4 h-4" />
                      Minutes
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Meeting Details Modal */}
      <StudentModal
        isOpen={!!selectedMeeting}
        onClose={() => setSelectedMeeting(null)}
        title={selectedMeeting?.title || 'Meeting Details'}
      >
        {selectedMeeting && (
          <div className="space-y-6 pt-4">
            {/* Meeting Header */}
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex flex-col items-center justify-center text-white shadow-md flex-shrink-0">
                <p className="text-xs">{formatDate(selectedMeeting.date).split(' ')[0]}</p>
                <p className="text-2xl font-bold">{formatDate(selectedMeeting.date).split(' ')[1]}</p>
              </div>
              <div className="flex-1">
                <div className="flex gap-2 mb-2">
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">{selectedMeeting.type}</Badge>
                  {selectedMeeting.attended && (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      You Attended
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600">{selectedMeeting.description}</p>
              </div>
            </div>

            {/* Meeting Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <p className="text-sm text-gray-600">Date</p>
                </div>
                <p className="text-gray-900 font-medium">{formatFullDate(selectedMeeting.date)}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <p className="text-sm text-gray-600">Time</p>
                </div>
                <p className="text-gray-900 font-medium">{selectedMeeting.time}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <p className="text-sm text-gray-600">Location</p>
                </div>
                <p className="text-gray-900 font-medium">{selectedMeeting.location}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <p className="text-sm text-gray-600">Attendees</p>
                </div>
                <p className="text-gray-900 font-medium">
                  {selectedMeeting.attendees} {selectedMeeting.status === 'Completed' ? 'attended' : 'expected'}
                </p>
              </div>
            </div>

            {/* Agenda (for upcoming) or Summary (for past) */}
            {selectedMeeting.status === 'Scheduled' ? (
              <div>
                <h3 className="text-gray-900 font-semibold mb-3">Meeting Agenda</h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-600 text-sm">
                    {selectedMeeting.description}
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-gray-900 font-semibold mb-3">Meeting Agenda</h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-600 text-sm">
                    {selectedMeeting.description}
                  </p>
                </div>
               <h3 className="text-gray-900 font-semibold mb-3">Meeting Documentaion</h3>
                  
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2 border-t">
              {selectedMeeting.minutesAvailable && (
                <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  Download Minutes
                </button>
              )}
              <button
                onClick={() => setSelectedMeeting(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </StudentModal>
    </div>
  );
}
