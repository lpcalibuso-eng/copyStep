import React, { useMemo, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import {
  Star,
  TrendingUp,
  ThumbsUp,
  MessageSquare,
  Filter,
  Search,
  Download,
  BarChart3,
} from 'lucide-react';

function Badge({ children, className = '' }) {
  return (
    <span className={['inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', className].join(' ')}>
      {children}
    </span>
  );
}

function Select({ value, onValueChange, children, className = '' }) {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={['w-full px-3 py-2 border border-gray-200 rounded-xl bg-white', className].join(' ')}
    >
      {children}
    </select>
  );
}

function Avatar({ children, className = '' }) {
  return (
    <div className={['inline-flex items-center justify-center rounded-full overflow-hidden', className].join(' ')}>
      {children}
    </div>
  );
}

function AvatarFallback({ children, className = '' }) {
  return (
    <div className={['w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-medium', className].join(' ')}>
      {children}
    </div>
  );
}

function csvEscape(val) {
  const s = String(val ?? '');
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function inDateRange(isoOrDate, dateRange) {
  if (dateRange === 'all') return true;
  if (!isoOrDate) return true;
  const d = new Date(isoOrDate);
  if (Number.isNaN(d.getTime())) return true;
  const now = new Date();
  const days = dateRange === 'week' ? 7 : dateRange === 'month' ? 30 : 90;
  const start = new Date(now);
  start.setDate(start.getDate() - days);
  return d >= start;
}

export function RatingsAnalyticsPage() {
  const { projectSummaries = [], studentRatings = [], kpi = {} } = usePage().props;

  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRatings = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return studentRatings.filter((rating) => {
      const matchesProject = selectedProject === 'all' || rating.projectName === selectedProject;
      const matchesRating = selectedRating === 'all' || String(rating.rating) === selectedRating;
      const matchesSearch =
        (rating.studentName || '').toLowerCase().includes(q) ||
        (rating.comment || '').toLowerCase().includes(q) ||
        (rating.projectName || '').toLowerCase().includes(q);
      const matchesDate = inDateRange(rating.createdAt || rating.date, dateRange);
      return matchesProject && matchesRating && matchesSearch && matchesDate;
    });
  }, [dateRange, searchQuery, selectedProject, selectedRating, studentRatings]);

  const totalRatings = kpi.totalRatings ?? studentRatings.length;
  const overallAverage = totalRatings ? (kpi.overallAverage ?? 0) : 0;
  const satisfactionRate = kpi.satisfactionRate ?? 0;

  const handleExport = () => {
    const headers = ['Student', 'Project', 'Rating', 'Comment', 'Helpful', 'Date'];
    const rows = filteredRatings.map((r) => [
      csvEscape(r.studentName),
      csvEscape(r.projectName),
      csvEscape(r.rating),
      csvEscape(r.comment),
      csvEscape(r.helpful),
      csvEscape(r.date),
    ]);
    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ratings_export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
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

  const renderSmallStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
    ));

  const projectCount = kpi.projectCountWithRatings ?? projectSummaries.filter((p) => p.totalRatings > 0).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Ratings & Analytics</h1>
          <p className="text-gray-500">Student feedback on approved projects (database-backed)</p>
        </div>
        <Button type="button" variant="outline" className="rounded-xl" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-[20px] p-6 border-0 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overall Average</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-3xl text-gray-900">{totalRatings ? overallAverage.toFixed(2) : '—'}</p>
                {totalRatings > 0 && <div className="flex">{renderStars(overallAverage)}</div>}
              </div>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="rounded-[20px] p-6 border-0 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Ratings</p>
              <p className="text-3xl text-gray-900 mt-1">{totalRatings}</p>
              <p className="text-xs text-gray-500 mt-1">
                Across
                {' '}
                {projectCount}
                {' '}
                projects with feedback
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="rounded-[20px] p-6 border-0 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Satisfaction Rate</p>
              <p className="text-3xl text-gray-900 mt-1">
                {totalRatings ? `${satisfactionRate}%` : '—'}
              </p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                % of ratings ≥ 4★
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <ThumbsUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="rounded-[20px] border-0 shadow-sm p-6">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-200 outline-none transition"
            />
          </div>

          <Select
            className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-200 outline-none transition"
            value={selectedProject}
            onValueChange={setSelectedProject}
          >
            <option value="all">All Projects</option>
            {projectSummaries.map((project) => (
              <option key={project.id} value={project.projectName}>
                {project.projectName}
              </option>
            ))}
          </Select>

          <Select
            className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-200 outline-none transition"
            value={selectedRating}
            onValueChange={setSelectedRating}
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </Select>

          <Select
            className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-200 outline-none transition"
            value={dateRange}
            onValueChange={setDateRange}
          >
            <option value="all">All Time</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter (90d)</option>
          </Select>
        </div>
      </Card>

      <Card className="rounded-[20px] border-0 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          {/* <BarChart3 className="w-5 h-5 text-gray-600" /> */}
          <h2 className="text-gray-900">Project Ratings Overview</h2>
        </div>

        <div className="space-y-4">
          {projectSummaries.length === 0 && (
            <p className="text-sm text-gray-500">No approved projects with analytics yet.</p>
          )}
          {projectSummaries.map((project) => (
            <div key={project.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-gray-900 mb-1">{project.projectName}</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl text-gray-900">{project.totalRatings ? project.averageRating.toFixed(2) : '—'}</span>
                      {project.totalRatings > 0 && <div className="flex">{renderStars(project.averageRating)}</div>}
                    </div>
                    <span className="text-sm text-gray-500">
                      (
                      {project.totalRatings}
                      {' '}
                      ratings)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {project.trend === 'up' && project.totalRatings > 0 && (
                    <Badge className="bg-green-100 text-green-700">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +
                      {project.trendValue.toFixed(1)}
                    </Badge>
                  )}
                  {project.trend === 'down' && project.totalRatings > 0 && (
                    <Badge className="bg-red-100 text-red-700">
                      <TrendingUp className="w-3 h-3 mr-1 rotate-180" />
                      -
                      {project.trendValue.toFixed(1)}
                    </Badge>
                  )}
                  {(project.trend === 'stable' || !project.totalRatings) && (
                    <Badge className="bg-gray-100 text-gray-700">Stable</Badge>
                  )}
                </div>
              </div>

              {project.totalRatings > 0 && (
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = project.ratingDistribution[stars] ?? 0;
                    const pct = project.totalRatings ? (count / project.totalRatings) * 100 : 0;
                    return (
                      <div key={stars} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 w-6">{stars}</span>
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-sm text-gray-600 w-16 text-right">
                          {count}
                          {' '}
                          (
                          {pct.toFixed(0)}
                          %)
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card className="rounded-[20px] border-0 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-900">Student Ratings & Comments</h2>
          <Badge className="bg-blue-100 text-blue-700">
            {filteredRatings.length}
            {' '}
            results
          </Badge>
        </div>

        <div className="space-y-4">
          {filteredRatings.map((rating) => (
            <div
              key={rating.id}
              className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-all"
            >
              <div className="flex gap-4">
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarFallback>
                    {(rating.studentName || 'S')
                      .split(' ')
                      .filter(Boolean)
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-sm text-gray-900">{rating.studentName}</p>
                      <p className="text-xs text-gray-500">{rating.projectName}</p>
                    </div>
                    <span className="text-xs text-gray-500">{rating.date}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">{renderSmallStars(rating.rating)}</div>
                    <Badge className="bg-gray-100 text-gray-700 text-xs">
                      {rating.rating}
                      /5
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-700 mb-2">{rating.comment}</p>

                  <div className="flex items-center gap-2">
                    <ThumbsUp className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {rating.helpful}
                      {' '}
                      found this helpful
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRatings.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">No ratings found</h3>
            <p className="text-gray-600">Try adjusting your filters</p>
          </div>
        )}
      </Card>
    </div>
  );
}

export default function AdviserRatingsPage() {
  return (
    <AuthenticatedLayout>
      <Head title="Ratings & Analytics" />
      <div className="py-8 px-4 lg:px-0 md:px-0">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <RatingsAnalyticsPage />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
