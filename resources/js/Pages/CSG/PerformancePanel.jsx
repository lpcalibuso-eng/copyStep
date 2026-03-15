import React from 'react';
import ReactDOM from 'react-dom';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import {
  TrendingUp,
  CheckCircle,
  FileText,
  Star,
  DollarSign,
  Target,
  Award,
  BarChart3,
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

function Progress({ value, className = '' }) {
  return (
    <div className={`w-full h-2 bg-gray-100 rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-blue-600 rounded-full transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function CSGPerformancePageInner() {
  const metrics = {
    projectCompletion: 85,
    adviserApprovalRate: 92,
    averageStudentRating: 4.7,
    proofSubmissionCompliance: 88,
    ledgerAccuracy: 96,
    studentEngagement: 87,
  };

  const projectPerformance = [
    { name: 'Community Outreach', score: 95, rating: 4.8, completion: 100, status: 'Completed' },
    { name: 'Sports Fest', score: 88, rating: 4.6, completion: 75, status: 'Ongoing' },
    { name: 'Tech Summit', score: 92, rating: 4.9, completion: 100, status: 'Completed' },
    { name: 'Sustainability', score: 78, rating: 4.3, completion: 60, status: 'Ongoing' },
  ];

  const monthlyTrends = [
    { month: 'Aug', projects: 8, rating: 4.5, engagement: 82 },
    { month: 'Sep', projects: 10, rating: 4.6, engagement: 85 },
    { month: 'Oct', projects: 12, rating: 4.7, engagement: 87 },
    { month: 'Nov', projects: 14, rating: 4.8, engagement: 90 },
  ];

  const achievements = [
    {
      title: 'Excellence Award',
      description: 'Achieved 90%+ approval rate',
      icon: Award,
      color: 'purple',
    },
    {
      title: 'High Rated Projects',
      description: '4.5+ average rating',
      icon: Star,
      color: 'blue',
    },
    {
      title: 'Completion Master',
      description: '85%+ project completion',
      icon: CheckCircle,
      color: 'green',
    },
  ];

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 75) return 'bg-blue-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getMetricBadge = (value) => {
    if (value >= 90) return { text: 'Excellent', color: 'bg-green-100 text-green-700' };
    if (value >= 75) return { text: 'High', color: 'bg-blue-100 text-blue-700' };
    if (value >= 60) return { text: 'Good', color: 'bg-yellow-100 text-yellow-700' };
    return { text: 'Needs Improvement', color: 'bg-red-100 text-red-700' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Performance Dashboard</h1>
        <p className="text-gray-500">Track your CSG performance metrics and achievements</p>
      </div>

      {/* Overall Performance Score */}
      <Card className="rounded-[20px] border-0 shadow-sm p-6 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blue-100 text-sm mb-1">Overall Performance Score</p>
              <p className="text-5xl font-bold">89</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <Award className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm text-white/90">+7% from last month</span>
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="rounded-[20px] border-0 shadow-sm p-6 bg-white">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <Badge className={`rounded-lg ${getMetricBadge(metrics.projectCompletion).color}`}>
              {getMetricBadge(metrics.projectCompletion).text}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mb-2">Project Completion Rate</p>
          <p className="text-3xl font-semibold text-gray-900 mb-3">
            {metrics.projectCompletion}%
          </p>
          <Progress value={metrics.projectCompletion} />
        </Card>

        <Card className="rounded-[20px] border-0 shadow-sm p-6 bg-white">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <Badge className={`rounded-lg ${getMetricBadge(metrics.adviserApprovalRate).color}`}>
              {getMetricBadge(metrics.adviserApprovalRate).text}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mb-2">Adviser Approval Rate</p>
          <p className="text-3xl font-semibold text-gray-900 mb-3">
            {metrics.adviserApprovalRate}%
          </p>
          <Progress value={metrics.adviserApprovalRate} />
        </Card>

        <Card className="rounded-[20px] border-0 shadow-sm p-6 bg-white">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <Badge className="bg-yellow-100 text-yellow-700 rounded-lg">Outstanding</Badge>
          </div>
          <p className="text-sm text-gray-500 mb-2">Avg. Student Rating</p>
          <p className="text-3xl font-semibold text-gray-900 mb-3">
            {metrics.averageStudentRating}
          </p>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(metrics.averageStudentRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </Card>

        <Card className="rounded-[20px] border-0 shadow-sm p-6 bg-white">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <Badge className={`rounded-lg ${getMetricBadge(metrics.proofSubmissionCompliance).color}`}>
              {getMetricBadge(metrics.proofSubmissionCompliance).text}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mb-2">Proof Submission Compliance</p>
          <p className="text-3xl font-semibold text-gray-900 mb-3">
            {metrics.proofSubmissionCompliance}%
          </p>
          <Progress value={metrics.proofSubmissionCompliance} />
        </Card>

        <Card className="rounded-[20px] border-0 shadow-sm p-6 bg-white">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <Badge className={`rounded-lg ${getMetricBadge(metrics.ledgerAccuracy).color}`}>
              {getMetricBadge(metrics.ledgerAccuracy).text}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mb-2">Ledger Accuracy</p>
          <p className="text-3xl font-semibold text-gray-900 mb-3">{metrics.ledgerAccuracy}%</p>
          <Progress value={metrics.ledgerAccuracy} />
        </Card>

        <Card className="rounded-[20px] border-0 shadow-sm p-6 bg-white">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <Badge className={`rounded-lg ${getMetricBadge(metrics.studentEngagement).color}`}>
              {getMetricBadge(metrics.studentEngagement).text}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mb-2">Student Engagement</p>
          <p className="text-3xl font-semibold text-gray-900 mb-3">{metrics.studentEngagement}%</p>
          <Progress value={metrics.studentEngagement} />
        </Card>
      </div>

      {/* Project Performance Table */}
      <Card className="rounded-[20px] border-0 shadow-sm p-6 bg-white">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Project Performance Breakdown</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-blue-50">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Project
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">
                  Score
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">
                  Rating
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">
                  Completion
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {projectPerformance.map((project, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                >
                  <td className="py-4 px-4">
                    <p className="text-sm font-medium text-gray-900">{project.name}</p>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div
                        className={`w-12 h-12 ${getScoreBg(
                          project.score
                        )} rounded-xl flex items-center justify-center`}
                      >
                        <span className={`font-semibold ${getScoreColor(project.score)}`}>
                          {project.score}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-900">{project.rating}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Progress value={project.completion} className="h-2 flex-1" />
                      <span className="text-sm text-gray-600 w-12">{project.completion}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Badge
                      className={`rounded-lg ${
                        project.status === 'Completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {project.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Monthly Trends */}
      <Card className="rounded-[20px] border-0 shadow-sm p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Monthly Performance Trends</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {monthlyTrends.map((trend, index) => (
            <div key={index} className="space-y-4">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 mb-1">{trend.month} 2024</p>
              </div>

              <div className="space-y-3">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-xs text-blue-600 mb-1">Projects</p>
                  <p className="text-xl font-semibold text-blue-900">{trend.projects}</p>
                </div>

                <div className="bg-yellow-50 rounded-xl p-4">
                  <p className="text-xs text-yellow-600 mb-1">Avg Rating</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <p className="text-xl font-semibold text-yellow-900">{trend.rating}</p>
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-xs text-green-600 mb-1">Engagement</p>
                  <p className="text-xl font-semibold text-green-900">{trend.engagement}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Achievements */}
      <Card className="rounded-[20px] border-0 shadow-sm p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Achievements</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
            <div className="w-12 h-12 bg-purple-200 rounded-xl flex items-center justify-center mb-3">
              <Award className="w-6 h-6 text-purple-700" />
            </div>
            <p className="text-sm font-semibold text-purple-900 mb-1">Excellence Award</p>
            <p className="text-xs text-purple-700">Achieved 90%+ approval rate</p>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
            <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center mb-3">
              <Star className="w-6 h-6 text-blue-700" />
            </div>
            <p className="text-sm font-semibold text-blue-900 mb-1">High Rated Projects</p>
            <p className="text-xs text-blue-700">4.5+ average rating</p>
          </div>

          <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
            <div className="w-12 h-12 bg-green-200 rounded-xl flex items-center justify-center mb-3">
              <CheckCircle className="w-6 h-6 text-green-700" />
            </div>
            <p className="text-sm font-semibold text-green-900 mb-1">Completion Master</p>
            <p className="text-xs text-green-700">85%+ project completion</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function CSGPerformancePage() {
  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Performance Dashboard</h2>}>
      <Head title="Performance Dashboard" />
      <div className="py-8 px-4 lg:px-0 md:px-0">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <CSGPerformancePageInner />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}