import { TrendingUp, Award, Trophy, FolderKanban, Calendar, Star, Target, Zap } from 'lucide-react';

export function StudentDashboardHome({
  onNavigate,
  onViewProject,
  stats = {},
  activeProjects = [],
  recentBadges = [],
  upcomingMeetings = [],
  leaderboardSummary = null,
}) {
  return (
    <div className="space-y-6 pb-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-[20px] p-8 text-white shadow-lg">
        <h1 className="text-white mb-2">Welcome back, Student!</h1>
        <p className="text-blue-100 mb-6">Track your progress and stay updated</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <TrendingUp className="w-6 h-6 mb-2" />
            <p className="text-2xl mb-1">500</p>
            <p className="text-xs text-blue-100">Total Points</p>
          </div> */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <Award className="w-6 h-6 mb-2" />
            <p className="text-2xl mb-1">{stats.badgesEarned ?? 0}</p>
            <p className="text-xs text-blue-100">Badges Earned</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <Trophy className="w-6 h-6 mb-2" />
            <p className="text-2xl mb-1">{stats.leaderboardRank ? `#${stats.leaderboardRank}` : '-'}</p>
            <p className="text-xs text-blue-100">Leaderboard Rank</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <Star className="w-6 h-6 mb-2" />
            <p className="text-2xl mb-1">Level {stats.engagementLevel ?? (leaderboardSummary?.level || 1)}</p>
            <p className="text-xs text-blue-100">Engagement Level</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => onNavigate('projects')}
          className="p-4 bg-white rounded-[20px] border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left"
        >
          <FolderKanban className="w-8 h-8 text-blue-600 mb-2" />
          <p className="text-sm text-gray-900">View Projects</p>
          <p className="text-xs text-gray-500 mt-1">{stats.activeProjectsCount ?? activeProjects.length} active</p>
        </button>

        <button
          onClick={() => onNavigate('meetings')}
          className="p-4 bg-white rounded-[20px] border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left"
        >
          <Calendar className="w-8 h-8 text-blue-600 mb-2" />
          <p className="text-sm text-gray-900">Meetings</p>
          <p className="text-xs text-gray-500 mt-1">{stats.upcomingMeetingsCount ?? upcomingMeetings.length} upcoming</p>
        </button>

        {/* <button
          onClick={() => onNavigate('points')}
          className="p-4 bg-white rounded-[20px] border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all text-left"
        >
          <Zap className="w-8 h-8 text-purple-600 mb-2" />
          <p className="text-sm text-gray-900">My Points</p>
          <p className="text-xs text-gray-500 mt-1">View history</p>
        </button> */}
      </div>

      {/* Active Projects */}
      <div className="p-6 rounded-[20px] border-0 shadow-sm bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-900">Active Projects</h2>
          <button
            onClick={() => onNavigate('projects')}
            className="text-sm text-blue-600 hover:underline"
          >
            View All
          </button>
        </div>

        <div className="space-y-3">
          {(activeProjects || []).map((project, index) => (
            <button
              key={index}
              onClick={() => onViewProject?.(project.id)}
              className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-sm text-gray-900 mb-1">{project.title}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>Due: {project.deadline}</span>
                    <span>•</span>
                    <span>{project.participants} participants</span>
                  </div>
                </div>
                {/* Badge replacement */}
                <span className="inline-flex items-center rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                  {project.status}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(project.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600">{project.rating}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600">{project.progress}%</span>
              </div>
            </button>
          ))}
          {!activeProjects?.length && <p className="text-sm text-gray-500">No active projects yet.</p>}
        </div>
      </div>

      {/* Recent Badges & Upcoming Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-[20px] border-0 shadow-sm bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900">Recent Badges</h2>
            <button
              onClick={() => onNavigate('badges')}
              className="text-sm text-blue-600 hover:underline"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {(recentBadges || []).map((badge, index) => (
              <div key={index} className={`${badge.color} rounded-xl p-3 text-center`}>
                <p className="text-2xl mb-1">{badge.icon}</p>
                <p className="text-xs text-gray-700">{badge.name}</p>
              </div>
            ))}
            {!recentBadges?.length && <p className="text-sm text-gray-500 col-span-3">No recent badges.</p>}
          </div>
        </div>

        <div className="p-6 rounded-[20px] border-0 shadow-sm bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900">Upcoming Meetings</h2>
            <button
              onClick={() => onNavigate('meetings')}
              className="text-sm text-blue-600 hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {(upcomingMeetings || []).map((meeting, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                  <p className="text-xs text-blue-600">{meeting.date.split(' ')[0]}</p>
                  <p className="text-xs text-blue-900">{meeting.date.split(' ')[1]}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{meeting.title}</p>
                  <p className="text-xs text-gray-500">{meeting.time} • {meeting.location}</p>
                </div>
              </div>
            ))}
            {!upcomingMeetings?.length && <p className="text-sm text-gray-500">No upcoming meetings.</p>}
          </div>
        </div>
      </div>

      {/* Progress to Next Level */}
      {/* <div className="p-6 rounded-[20px] border-0 shadow-sm bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-gray-600">Progress to Level 6</p>
            <p className="text-xs text-gray-500">You need 100 more points</p>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-blue-600">83%</span>
          </div>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" style={{ width: '83%' }}></div>
        </div>
      </div> */}
    </div>
  );
}