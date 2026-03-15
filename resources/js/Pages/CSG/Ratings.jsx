import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import {
  Star,
  TrendingUp,
  ThumbsUp,
  MessageSquare,
  Filter,
  CheckCircle,
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

const mockProjectRatings = [
  {
    projectId: 1,
    projectName: 'Community Outreach Program',
    averageRating: 4.8,
    totalRatings: 45,
    ratingDistribution: { 5: 38, 4: 5, 3: 2, 2: 0, 1: 0 },
    recentComments: [
      {
        id: 1,
        studentName: 'Emma Johnson',
        rating: 5,
        comment: 'Amazing initiative! The workshops were very helpful and well-organized.',
        date: '2024-11-20',
      },
      {
        id: 2,
        studentName: 'James Smith',
        rating: 5,
        comment: 'This project has made a real impact in our community. Great work!',
        date: '2024-11-19',
      },
      {
        id: 3,
        studentName: 'Sofia Martinez',
        rating: 4,
        comment: 'Very good project with clear objectives. Would love to see more like this.',
        date: '2024-11-18',
      },
    ],
  },
  {
    projectId: 2,
    projectName: 'Annual Sports Fest',
    averageRating: 4.6,
    totalRatings: 38,
    ratingDistribution: { 5: 28, 4: 8, 3: 2, 2: 0, 1: 0 },
    recentComments: [
      {
        id: 4,
        studentName: 'Michael Chen',
        rating: 5,
        comment: 'Best sports fest ever! Great organization and variety of events.',
        date: '2024-11-17',
      },
      {
        id: 5,
        studentName: 'Isabella Rodriguez',
        rating: 4,
        comment: 'Really enjoyed participating. The schedule could be better though.',
        date: '2024-11-16',
      },
    ],
  },
  {
    projectId: 3,
    projectName: 'Tech Innovation Summit',
    averageRating: 4.9,
    totalRatings: 52,
    ratingDistribution: { 5: 48, 4: 3, 3: 1, 2: 0, 1: 0 },
    recentComments: [
      {
        id: 6,
        studentName: 'David Lee',
        rating: 5,
        comment: 'Incredible speakers and networking opportunities. Learned so much!',
        date: '2024-11-15',
      },
      {
        id: 7,
        studentName: 'Olivia Brown',
        rating: 5,
        comment: 'The workshops were excellent. Hope to see more tech events like this.',
        date: '2024-11-14',
      },
    ],
  },
];

function CSGRatingsPageInner() {
  const [selectedProject, setSelectedProject] = useState('all');
  const [sortBy, setSortBy] = useState('highest');

  const filteredRatings =
    selectedProject === 'all'
      ? mockProjectRatings
      : mockProjectRatings.filter((r) => r.projectId.toString() === selectedProject);

  const sortedRatings = [...filteredRatings].sort((a, b) => {
    if (sortBy === 'highest') return b.averageRating - a.averageRating;
    if (sortBy === 'lowest') return a.averageRating - b.averageRating;
    if (sortBy === 'most-rated') return b.totalRatings - a.totalRatings;
    return 0;
  });

  const totalRatings = mockProjectRatings.reduce((sum, r) => sum + r.totalRatings, 0);
  const overallAverage =
    mockProjectRatings.reduce((sum, r) => sum + r.averageRating, 0) / mockProjectRatings.length;
  const satisfactionRate = Math.round(
    mockProjectRatings.reduce((sum, r) => sum + (r.ratingDistribution[5] + r.ratingDistribution[4]), 0) /
      totalRatings *
      100
  );

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : i < rating
            ? 'fill-yellow-200 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderSmallStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Project Ratings</h1>
        <p className="text-gray-500">Student feedback and ratings for CSG projects</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-[20px] border-0 shadow-sm p-6 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Overall Average</p>
              <div className="flex items-center gap-3 mt-2">
                <p className="text-3xl font-semibold text-gray-900">
                  {overallAverage.toFixed(1)}
                </p>
                <div className="flex">{renderStars(overallAverage)}</div>
              </div>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="rounded-[20px] border-0 shadow-sm p-6 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Ratings</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">{totalRatings}</p>
              <p className="text-xs text-gray-400 mt-1">Across all projects</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="rounded-[20px] border-0 shadow-sm p-6 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Satisfaction Rate</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">{satisfactionRate}%</p>
              <p className="text-xs text-green-600 mt-1">↑ 5% from last month</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <ThumbsUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="rounded-[20px] border-0 shadow-sm p-6 bg-white">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h2 className="text-gray-900 font-semibold">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <option value="all">All Projects</option>
            {mockProjectRatings.map((rating) => (
              <option key={rating.projectId} value={rating.projectId.toString()}>
                {rating.projectName}
              </option>
            ))}
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="most-rated">Most Rated</option>
          </Select>
        </div>
      </Card>

      {/* Project Ratings */}
      <div className="space-y-6">
        {sortedRatings.map((project) => (
          <Card key={project.projectId} className="rounded-[20px] border-0 shadow-sm p-6 bg-white">
            {/* Project Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {project.projectName}
                </h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-semibold text-gray-900">
                      {project.averageRating.toFixed(1)}
                    </span>
                    <div className="flex">{renderStars(project.averageRating)}</div>
                  </div>
                  <span className="text-sm text-gray-500">({project.totalRatings} ratings)</span>
                </div>
              </div>

              <Badge className="bg-blue-100 text-blue-700 rounded-lg px-3 py-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                {Math.round((project.ratingDistribution[5] / project.totalRatings) * 100)}%
                Excellent
              </Badge>
            </div>

            {/* Rating Distribution */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Rating Distribution</h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = project.ratingDistribution[stars];
                  const percentage = (count / project.totalRatings) * 100;
                  return (
                    <div key={stars} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-6">{stars}</span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Comments */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Recent Comments</h3>
              <div className="space-y-4">
                {project.recentComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                        {comment.studentName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {comment.studentName}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">{renderSmallStars(comment.rating)}</div>
                            <span className="text-xs text-gray-400">{comment.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{comment.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}

        {sortedRatings.length === 0 && (
          <Card className="rounded-[20px] border-0 shadow-sm p-12 bg-white text-center">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No ratings found</h3>
            <p className="text-gray-500">Try adjusting your filters</p>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function CSGRatingsPage() {
  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Project Ratings</h2>}>
      <Head title="Project Ratings" />
      <div className="py-8 px-4 lg:px-0 md:px-0">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <CSGRatingsPageInner />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}