import { useState } from 'react';
import { Card } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Trophy, TrendingUp, TrendingDown, Minus, Award, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const leaderboardData = [
  {
    rank: 1,
    previousRank: 2,
    name: 'Alex Johnson',
    initials: 'AJ',
    points: 1250,
    badges: 18,
    level: 8,
    trend: 'up',
  },
  {
    rank: 2,
    previousRank: 1,
    name: 'Maria Garcia',
    initials: 'MG',
    points: 1180,
    badges: 16,
    level: 7,
    trend: 'down',
  },
  {
    rank: 3,
    previousRank: 4,
    name: 'James Chen',
    initials: 'JC',
    points: 1050,
    badges: 15,
    level: 7,
    trend: 'up',
  },
  {
    rank: 4,
    previousRank: 3,
    name: 'Sarah Williams',
    initials: 'SW',
    points: 980,
    badges: 14,
    level: 6,
    trend: 'down',
  },
  {
    rank: 5,
    previousRank: 5,
    name: 'David Kim',
    initials: 'DK',
    points: 920,
    badges: 13,
    level: 6,
    trend: 'same',
  },
  {
    rank: 6,
    previousRank: 7,
    name: 'Emma Martinez',
    initials: 'EM',
    points: 880,
    badges: 13,
    level: 6,
    trend: 'up',
  },
  {
    rank: 7,
    previousRank: 6,
    name: 'Michael Brown',
    initials: 'MB',
    points: 850,
    badges: 12,
    level: 5,
    trend: 'down',
  },
  {
    rank: 8,
    previousRank: 9,
    name: 'Lisa Anderson',
    initials: 'LA',
    points: 820,
    badges: 12,
    level: 5,
    trend: 'up',
  },
  {
    rank: 9,
    previousRank: 8,
    name: 'Robert Taylor',
    initials: 'RT',
    points: 790,
    badges: 11,
    level: 5,
    trend: 'down',
  },
  {
    rank: 10,
    previousRank: 11,
    name: 'Jennifer Lee',
    initials: 'JL',
    points: 760,
    badges: 11,
    level: 5,
    trend: 'up',
  },
  {
    rank: 11,
    previousRank: 10,
    name: 'Kevin Patel',
    initials: 'KP',
    points: 730,
    badges: 10,
    level: 5,
    trend: 'down',
  },
  {
    rank: 12,
    previousRank: 12,
    name: 'Amanda White',
    initials: 'AW',
    points: 700,
    badges: 10,
    level: 4,
    trend: 'same',
  },
  {
    rank: 24,
    previousRank: 26,
    name: 'Student Name',
    initials: 'ST',
    points: 500,
    badges: 12,
    level: 5,
    trend: 'up',
    isCurrentUser: true,
  },
];

const getTrendIcon = (trend) => {
  if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
  if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
  return <Minus className="w-4 h-4 text-gray-400" />;
};

const getTrendColor = (trend) => {
  if (trend === 'up') return 'text-green-600';
  if (trend === 'down') return 'text-red-600';
  return 'text-gray-400';
};

const getRankColor = (rank) => {
  if (rank === 1) return 'from-yellow-400 to-yellow-600';
  if (rank === 2) return 'from-gray-300 to-gray-500';
  if (rank === 3) return 'from-orange-400 to-orange-600';
  return 'from-blue-600 to-blue-700';
};

export default function StudentLeaderboardPage({ onNavigate, leaderboardData: externalData = [], currentUser: currentUserProp = null }) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const data = externalData.length ? externalData : leaderboardData;
  
  const currentUser = currentUserProp || data.find(u => u.isCurrentUser);
  const topThree = data.slice(0, 3);
  
  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentPageData = data.slice(startIndex, endIndex);

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 text-2xl font-semibold mb-2">Leaderboard</h1>
        <p className="text-gray-500">See how you rank among your peers</p>
      </div>

      {/* Current User Rank Card */}
      {currentUser && (
        <Card className="p-6 rounded-[20px] border-0 shadow-sm bg-gradient-to-br from-blue-600 to-purple-600 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl flex-shrink-0">
              #{currentUser.rank}
            </div>
            <div className="flex-1">
              <p className="text-sm text-white/80 mb-1">Your Rank</p>
              <h2 className="text-white font-semibold mb-2">{currentUser.name}</h2>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  <span>{currentUser.points} pts</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  <span>{currentUser.badges} badges</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  <span>Level {currentUser.level}</span>
                </div>
              </div>
            </div>
            <div className={`flex items-center gap-2 ${getTrendColor(currentUser.trend)}`}>
              {getTrendIcon(currentUser.trend)}
              <span className="text-sm">
                {currentUser.trend === 'up' && `↑${currentUser.previousRank - currentUser.rank}`}
                {currentUser.trend === 'down' && `↓${currentUser.rank - currentUser.previousRank}`}
                {currentUser.trend === 'same' && '—'}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Top 3 Podium */}
      <div>
        <h2 className="text-gray-900 text-xl font-semibold mb-4">Top Contributors</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Rank 2 (Silver) */}
          <div className="order-2 md:order-1">
            <Card className="p-6 rounded-[20px] border-0 shadow-sm text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-300/20 to-gray-500/20 rounded-bl-full"></div>
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${getRankColor(2)} flex items-center justify-center text-white text-2xl shadow-lg`}>
                <Trophy className="w-10 h-10" />
              </div>
              <div className="mb-2">
                <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600 mb-2">
                  🥈 2nd Place
                </div>
              </div>
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-500 text-white flex items-center justify-center font-semibold">
                {topThree[1]?.initials}
              </div>
              <h3 className="text-gray-900 font-semibold mb-2">{topThree[1]?.name}</h3>
              <p className="text-2xl text-gray-900 mb-1">{topThree[1]?.points}</p>
              <p className="text-xs text-gray-500 mb-3">points</p>
              <div className="flex justify-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  <span>{topThree[1]?.badges}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  <span>Lvl {topThree[1]?.level}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Rank 1 (Gold) - Larger */}
          <div className="order-1 md:order-2">
            <Card className="p-8 rounded-[20px] border-0 shadow-xl text-center relative overflow-hidden md:-mt-4">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-bl-full"></div>
              <div className={`w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br ${getRankColor(1)} flex items-center justify-center text-white text-3xl shadow-xl`}>
                <Trophy className="w-12 h-12" />
              </div>
              <div className="mb-2">
                <div className="inline-block px-3 py-1 bg-yellow-100 rounded-full text-sm text-yellow-700 mb-2">
                  🏆 1st Place
                </div>
              </div>
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-yellow-600 text-white flex items-center justify-center font-semibold text-xl">
                {topThree[0]?.initials}
              </div>
              <h3 className="text-gray-900 font-semibold mb-2">{topThree[0]?.name}</h3>
              <p className="text-3xl text-gray-900 mb-1">{topThree[0]?.points}</p>
              <p className="text-sm text-gray-500 mb-3">points</p>
              <div className="flex justify-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  <span>{topThree[0]?.badges}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  <span>Lvl {topThree[0]?.level}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Rank 3 (Bronze) */}
          <div className="order-3">
            <Card className="p-6 rounded-[20px] border-0 shadow-sm text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-orange-600/20 rounded-bl-full"></div>
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${getRankColor(3)} flex items-center justify-center text-white text-2xl shadow-lg`}>
                <Trophy className="w-10 h-10" />
              </div>
              <div className="mb-2">
                <div className="inline-block px-3 py-1 bg-orange-100 rounded-full text-sm text-orange-700 mb-2">
                  🥉 3rd Place
                </div>
              </div>
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-orange-600 text-white flex items-center justify-center font-semibold">
                {topThree[2]?.initials}
              </div>
              <h3 className="text-gray-900 font-semibold mb-2">{topThree[2]?.name}</h3>
              <p className="text-2xl text-gray-900 mb-1">{topThree[2]?.points}</p>
              <p className="text-xs text-gray-500 mb-3">points</p>
              <div className="flex justify-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  <span>{topThree[2]?.badges}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  <span>Lvl {topThree[2]?.level}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Full Leaderboard */}
      <div>
        <h2 className="text-gray-900 text-xl font-semibold mb-4">All Rankings</h2>
        <Card className="overflow-hidden rounded-[20px] border-0 shadow-sm">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider font-semibold">Rank</th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider font-semibold">Student</th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider font-semibold">Points</th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider font-semibold">Badges</th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider font-semibold">Level</th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider font-semibold">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentPageData.map((user) => (
                  <tr 
                    key={user.rank} 
                    className={`hover:bg-gray-50 transition-colors ${
                      user.isCurrentUser ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getRankColor(user.rank)} flex items-center justify-center text-white font-semibold text-sm`}>
                        {user.rank}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                          user.isCurrentUser ? 'bg-blue-600' : 'bg-gray-500'
                        }`}>
                          {user.initials}
                        </div>
                        <div>
                          <p className="text-sm text-gray-900">
                            {user.name}
                            {user.isCurrentUser && (
                              <Badge className="ml-2 bg-blue-600">You</Badge>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-gray-900">{user.points}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-purple-500" />
                        <span className="text-sm text-gray-900">{user.badges}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary">Level {user.level}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-2 ${getTrendColor(user.trend)}`}>
                        {getTrendIcon(user.trend)}
                        <span className="text-sm">
                          {user.trend === 'up' && `+${user.previousRank - user.rank}`}
                          {user.trend === 'down' && `-${user.rank - user.previousRank}`}
                          {user.trend === 'same' && '—'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing {data.length ? startIndex + 1 : 0} to {Math.min(endIndex, data.length)} of {data.length} results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === 1
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-lg text-sm transition-all ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === totalPages
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-200">
            {currentPageData.map((user) => (
              <div 
                key={user.rank} 
                className={`p-4 ${user.isCurrentUser ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRankColor(user.rank)} flex items-center justify-center text-white flex-shrink-0 font-semibold text-sm`}>
                    {user.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 ${
                        user.isCurrentUser ? 'bg-blue-600' : 'bg-gray-500'
                      }`}>
                        {user.initials}
                      </div>
                      <p className="text-sm text-gray-900 truncate">
                        {user.name}
                        {user.isCurrentUser && (
                          <Badge className="ml-2 bg-blue-600 text-xs">You</Badge>
                        )}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span>{user.points}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-3 h-3 text-purple-500" />
                        <span>{user.badges}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="w-3 h-3 text-blue-500" />
                        <span>Lvl {user.level}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 ${getTrendColor(user.trend)} flex-shrink-0`}>
                    {getTrendIcon(user.trend)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Pagination */}
          <div className="md:hidden flex items-center justify-between px-4 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === totalPages
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </Card>
      </div>

      {/* Call to Action */}
      <Card className="p-6 rounded-[20px] border-0 shadow-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
        <Trophy className="w-12 h-12 mx-auto mb-3 opacity-90" />
        <h3 className="text-white font-semibold mb-2">Climb the Rankings!</h3>
        <p className="text-sm text-white/80 mb-4">
          Earn more points by rating projects, attending meetings, and unlocking badges
        </p>
        <button
          onClick={() => onNavigate('points')}
          className="px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-white/90 transition-colors font-semibold"
        >
          View Points Guide
        </button>
      </Card>
    </div>
  );
}
