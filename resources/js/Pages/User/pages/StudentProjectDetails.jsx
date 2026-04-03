import { useState } from 'react';
import { Card } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { StudentModal } from '@/Components/ui/StudentModal';
import { ArrowLeft, Star, Calendar, DollarSign, FileText, CheckCircle, Wallet, Clock3 } from 'lucide-react';

export default function StudentProjectDetails({ projectId, onBack, project }) {
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(project?.currentUserRating?.rating || 0);
  const [comment, setComment] = useState(project?.currentUserRating?.comment || '');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedLedgerEntry, setSelectedLedgerEntry] = useState(null);
  const [selectedProofDocument, setSelectedProofDocument] = useState(null);
  const [showAllComments, setShowAllComments] = useState(false);

  const getProofUrl = (path) => {
    if (!path) return '#';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) return path;
    return `/${path}`;
  };

  // Calculate project status based on approval status and dates
  const getCalculatedStatus = () => {
    // If not approved yet, show as Draft
    if (project.approvalStatus !== 'Approved' && project.approval_status !== 'Approved') {
      return 'Draft';
    }
    
    // If approved, calculate status based on dates
    const startDate = project.startDate || project.start_date;
    const endDate = project.endDate || project.end_date;
    
    if (!startDate || !endDate) {
      return 'Draft';
    }
    
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      
      // Check if dates are valid
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return 'Draft';
      }
      
      if (today < start) {
        return 'Upcoming';
      } else if (today > end) {
        return 'Completed';
      } else if (today >= start && today <= end) {
        return 'Ongoing';
      }
      
      return 'Draft';
    } catch (error) {
      console.error('Error calculating status:', error);
      return 'Draft';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-100 text-gray-700';
      case 'Upcoming':
        return 'bg-purple-100 text-purple-700';
      case 'Ongoing':
        return 'bg-blue-100 text-blue-700';
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'Pending Adviser Approval':
        return 'bg-yellow-100 text-yellow-700';
      case 'Approved':
        return 'bg-blue-100 text-blue-700';
      case 'Rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleSubmitRating = async () => {
    if (!rating) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/user/projects/${projectId}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
        },
        body: JSON.stringify({ rating, comment }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!project) {
    return (
      <Card className="rounded-[20px] border-0 shadow-sm p-6">
        <p className="text-gray-600">Project not found.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 rounded-xl transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </button>

      {/* Project Header */}
      <Card className="rounded-[20px] border-0 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                  {project.category || 'General'}
                </Badge>
                <Badge className={getStatusColor(getCalculatedStatus())}>
                  {getCalculatedStatus()}
                </Badge>
              </div>
              <p className="text-gray-600 leading-relaxed">{project.objective || 'No objective available.'}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(project.averageRating || 0)
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-gray-900">{project.averageRating || 0}</span>
                <span className="text-sm text-gray-500">({project.ratingsCount || 0} ratings)</span>
              </div>

              <button
                onClick={() => setShowRatingModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
              >
                <Star className="w-4 h-4" />
                Rate this Project
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 rounded-xl p-4">
            <Calendar className="w-5 h-5 text-blue-600 mb-2" />
            <p className="text-sm text-gray-600">Start Date</p>
            <p className="text-lg font-semibold text-gray-900">{project.startDate || 'N/A'}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <Calendar className="w-5 h-5 text-blue-600 mb-2" />
            <p className="text-sm text-gray-600">End Date</p>
            <p className="text-lg font-semibold text-gray-900">{project.endDate || 'N/A'}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <DollarSign className="w-5 h-5 text-blue-600 mb-2" />
            <p className="text-sm text-gray-600">Budget</p>
            <p className="text-2xl font-bold text-gray-900">₱{Number(project.budget || 0).toLocaleString()}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <Star className="w-5 h-5 text-blue-600 mb-2" />
            <p className="text-sm text-gray-600">Approval</p>
            <p className="text-lg font-semibold text-gray-900">{project.approvalStatus || 'Pending'}</p>
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap gap-2 bg-white rounded-xl p-2 shadow-sm border border-gray-100">
        {['overview', 'ledger', 'proof', 'status timeline', 'ratings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
              activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <Card className="rounded-[20px] border-0 shadow-sm p-6 bg-gradient-to-br from-white to-blue-50">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Overview</h2>
          <div className="rounded-2xl border border-blue-100 bg-white p-4 md:p-5">
            <div className='mb-4'>
              <p className='text-sm text-gray-500 mb-1'>Project Details *</p>
            <p className="text-gray-900 truncate">{project.description || 'No description available.'}</p>
            </div>
            <div className='mb-4'>
              <p className='text-sm text-gray-500 mb-1'>Project Proposer *</p>
              <p className="text-gray-900">{project.proposeBy || 'N/A'}</p>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-3">
                <p className="text-xs text-gray-500">Timeline</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{project.startDate || 'TBD'} to {project.endDate || 'TBD'}</p>
              </div>
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-3">
                <p className="text-xs text-gray-500">Category</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{project.category || 'General'}</p>
              </div>
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-3">
                <p className="text-xs text-gray-500">Venue</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{project.venue || 'Not specified'}</p>
              </div>
            </div>
          </div>
          {/* <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl p-4 bg-white border border-blue-100">
              <p className="text-xs text-gray-500">Status</p>
              <p className="font-semibold text-gray-900 mt-1">{getCalculatedStatus()}</p>
            </div>
            <div className="rounded-xl p-4 bg-white border border-blue-100">
              <p className="text-xs text-gray-500">Approval</p>
              <p className="font-semibold text-gray-900 mt-1">{project.approvalStatus || 'Pending'}</p>
            </div>
            <div className="rounded-xl p-4 bg-white border border-blue-100">
              <p className="text-xs text-gray-500">Budget</p>
              <p className="font-semibold text-gray-900 mt-1">₱{Number(project.budget || 0).toLocaleString()}</p>
            </div>
            <div className="rounded-xl p-4 bg-white border border-blue-100">
              <p className="text-xs text-gray-500">Ratings</p>
              <p className="font-semibold text-gray-900 mt-1">{project.ratingsCount || 0}</p>
            </div>
          </div> */}
        </Card>
      )}

      {activeTab === 'ledger' && (
        <Card className="rounded-[20px] border-0 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Ledger</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(project.ledgerEntries || []).map((entry) => (
              <button
                key={entry.id}
                onClick={() => setSelectedLedgerEntry(entry)}
                className={`rounded-xl border p-4 ${
                  entry.type === 'Income' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                } text-left hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Transaction ID</p>
                    <p className="font-mono text-xs text-gray-700">{entry.id}</p>
                  </div>
                  <Badge className={entry.type === 'Income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                    {entry.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="w-4 h-4 text-gray-700" />
                  <p className="text-lg font-bold text-gray-900">₱{Number(entry.amount || 0).toLocaleString()}</p>
                </div>
                <p className="text-sm text-gray-700 mb-3">{entry.description || '-'}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-1 rounded-md bg-white text-gray-700 border">{entry.approvalStatus}</span>
                  <span className="text-gray-600">{entry.createdAt || '-'}</span>
                </div>
              </button>
            ))}
          </div>
          {!project.ledgerEntries?.length && <p className="text-gray-500 mt-3">No ledger entries yet.</p>}
        </Card>
      )}

      {activeTab === 'proof' && (
        <Card className="rounded-[20px] border-0 shadow-sm p-6 bg-gradient-to-br from-white to-indigo-50">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Proof</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(project.proofDocuments || []).map((proof) => (
              <button
                key={proof.id}
                onClick={() => setSelectedProofDocument(proof)}
                className="border border-indigo-100 bg-white rounded-xl p-4 text-left hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <div>
                    <p className="font-medium text-gray-900">{proof.fileName}</p>
                    <p className="text-xs text-gray-500">Linked: {proof.linkedTransaction}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">{proof.uploadDate}</p>
                  <div className="flex items-center gap-2">
                    <a
                      href={getProofUrl(proof.ledgerProof)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs px-2 py-1 rounded-md border border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Proof
                    </a>
                    <Badge className="bg-indigo-100 text-indigo-700">{proof.status}</Badge>
                  </div>
                </div>
              </button>
            ))}
            {!project.proofDocuments?.length && <p className="text-gray-500">No proof documents uploaded.</p>}
          </div>
        </Card>
      )}

      {activeTab === 'status timeline' && (
        <Card className="rounded-[20px] border-0 shadow-sm p-6 bg-gradient-to-br from-white to-purple-50">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Status Timeline</h2>
          <div className="space-y-0">
            {(project.statusTimeline || []).map((item, index, arr) => (
              <div key={item.id} className="flex gap-4 items-start relative">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    item.isCurrent ? 'bg-emerald-500 text-white' : item.isDone ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {item.isDone || item.isCurrent ? <CheckCircle className="w-4 h-4" /> : <Clock3 className="w-4 h-4" />}
                  </div>
                  {index < arr.length - 1 && (
                    <div className={`w-0.5 h-16 ${item.isDone ? 'bg-blue-400' : 'bg-gray-200'}`} />
                  )}
                </div>
                <div className={`pb-6 flex-1 ${index !== arr.length - 1 ? 'border-b border-purple-100' : ''}`}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-gray-900">{item.label}</p>
                    {item.isCurrent && <Badge className="bg-emerald-100 text-emerald-700">Current</Badge>}
                  </div>
                  <p className="text-sm text-gray-700">{item.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.date || '-'}</p>
                </div>
              </div>
            ))}
            {!project.statusTimeline?.length && <p className="text-gray-500">No status history yet.</p>}
          </div>
        </Card>
      )}

      {activeTab === 'ratings' && (
        <Card className="rounded-[20px] border-0 shadow-sm p-6 bg-gradient-to-br from-white to-yellow-50">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Ratings</h2>
          <div className="space-y-6">
            {(showAllComments ? (project.ratings || []) : (project.ratings || []).slice(0, 5)).map((review) => (
              <div key={review.id} className="flex gap-4 pb-6 border-b border-yellow-100 last:border-0">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-blue-700">
                    {(review.user?.name || 'U')
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{review.user?.name || 'Unknown User'}</h3>
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-sm text-gray-500">{review.date || ''}</span>
                  </div>
                  <p className="text-gray-700 mt-2">{review.comment || 'No comment provided.'}</p>
                  <div className="mt-2">
                    <span className="inline-flex items-center text-xs px-2 py-1 rounded-md bg-white border border-yellow-200 text-yellow-700">
                      Helpful {review.helpfulCount || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {(project.ratings || []).length > 5 && (
              <button
                onClick={() => setShowAllComments((prev) => !prev)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-yellow-300 bg-white hover:bg-yellow-50 text-yellow-700"
              >
                {showAllComments ? 'Show less comments' : `More comments (${(project.ratings || []).length - 5})`}
              </button>
            )}
            {!project.ratings?.length && <p className="text-gray-500">No ratings yet.</p>}
          </div>
        </Card>
      )}

      <StudentModal
        isOpen={!!selectedLedgerEntry}
        onClose={() => setSelectedLedgerEntry(null)}
        title="Ledger Entry Details"
      >
        {selectedLedgerEntry && (
          <div className="space-y-4 pt-2">
            <div className={`rounded-2xl p-4 border ${selectedLedgerEntry.type === 'Income' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-900">{selectedLedgerEntry.type} Entry</p>
                <Badge className="bg-white text-gray-700 border">{selectedLedgerEntry.approvalStatus || '-'}</Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-2">₱{Number(selectedLedgerEntry.amount || 0).toLocaleString()}</p>
              <p className="text-xs text-gray-600 mt-1">Transaction ID: {selectedLedgerEntry.id}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border bg-gray-50 p-3"><p className="text-xs text-gray-500">Category</p><p className="font-medium text-gray-900">{selectedLedgerEntry.category || '-'}</p></div>
              <div className="rounded-xl border bg-gray-50 p-3"><p className="text-xs text-gray-500">Created</p><p className="font-medium text-gray-900">{selectedLedgerEntry.createdAt || '-'}</p></div>
              <div className="rounded-xl border bg-gray-50 p-3"><p className="text-xs text-gray-500">Approved</p><p className="font-medium text-gray-900">{selectedLedgerEntry.approvedAt || '-'}</p></div>
              <div className="rounded-xl border bg-gray-50 p-3"><p className="text-xs text-gray-500">Rejected</p><p className="font-medium text-gray-900">{selectedLedgerEntry.rejectedAt || '-'}</p></div>
            </div>

            <div className="rounded-xl border bg-white p-4">
              <p className="text-xs text-gray-500 mb-1">Description</p>
              <p className="text-sm text-gray-800">{selectedLedgerEntry.description || '-'}</p>
            </div>

            <div className="rounded-xl border bg-white p-4">
              <p className="text-xs text-gray-500 mb-1">Remarks</p>
              <p className="text-sm text-gray-800">{selectedLedgerEntry.note || '-'}</p>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-blue-50 border border-blue-100 p-3">
              <p className="text-sm text-blue-800">Supporting proof file</p>
              <a
                href={getProofUrl(selectedLedgerEntry.ledgerProof)}
                target="_blank"
                rel="noreferrer"
                className="text-xs px-3 py-1.5 rounded-md border border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                Open Proof
              </a>
            </div>
          </div>
        )}
      </StudentModal>

      <StudentModal
        isOpen={!!selectedProofDocument}
        onClose={() => setSelectedProofDocument(null)}
        title="Proof Document Details"
      >
        {selectedProofDocument && (
          <div className="space-y-4 pt-2">
            <div className="rounded-2xl bg-indigo-50 border border-indigo-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">{selectedProofDocument.fileName || 'Proof Document'}</p>
                  <p className="text-xs text-gray-600 mt-1">Document ID: {selectedProofDocument.id}</p>
                </div>
                <Badge className="bg-indigo-100 text-indigo-700">{selectedProofDocument.status || '-'}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border bg-gray-50 p-3"><p className="text-xs text-gray-500">Linked Transaction</p><p className="font-medium text-gray-900">{selectedProofDocument.linkedTransaction || '-'}</p></div>
              <div className="rounded-xl border bg-gray-50 p-3"><p className="text-xs text-gray-500">Uploaded</p><p className="font-medium text-gray-900">{selectedProofDocument.uploadDate || '-'}</p></div>
            </div>

            <div className="rounded-xl border bg-white p-4">
              <p className="text-xs text-gray-500 mb-1">Description</p>
              <p className="text-sm text-gray-800">{selectedProofDocument.description || 'Supporting document attached to this transaction.'}</p>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-indigo-50 border border-indigo-100 p-3">
              <p className="text-sm text-indigo-800">Open uploaded proof</p>
              <a
                href={getProofUrl(selectedProofDocument.ledgerProof)}
                target="_blank"
                rel="noreferrer"
                className="text-xs px-3 py-1.5 rounded-md border border-indigo-300 text-indigo-700 hover:bg-indigo-100"
              >
                View File
              </a>
            </div>
          </div>
        )}
      </StudentModal>

      {/* Rating Modal */}
      <StudentModal
        isOpen={showRatingModal}
        onClose={() => {
          setShowRatingModal(false);
          setRating(0);
          setComment('');
        }}
        title="Rate this Project"
      >
        <div className="space-y-6 pt-4">
          {/* Star Rating */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">How would you rate this project?</p>
            <div className="flex justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">
              Comment (Optional)
            </label>
            <textarea
              placeholder="Share your thoughts about this project..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmitRating}
              disabled={rating === 0 || isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl transition-colors font-medium"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Rating'}
            </button>
            <button
              onClick={() => {
                setShowRatingModal(false);
                setRating(0);
                setComment('');
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>

        </div>
      </StudentModal>
    </div>
  );
}
