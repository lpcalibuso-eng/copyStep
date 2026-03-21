import { useState } from 'react';
import { Card } from '@/Components/ui/card';
import { Badge as BadgeComponent } from '@/Components/ui/badge';
import { Lock, Star, CheckCircle2 } from 'lucide-react';
import { StudentModal } from '@/Components/ui/StudentModal';

const badges = [
  // Bronze Tier
  {
    id: 1,
    name: 'First Steps',
    description: 'Complete your first action in STEP',
    icon: '👣',
    tier: 'Bronze',
    points: 25,
    unlocked: true,
    progress: 100,
    requirement: 'Rate 1 project or attend 1 meeting',
    unlockedDate: '2024-11-01',
  },
  {
    id: 2,
    name: 'Active Participant',
    description: 'Engage with at least 5 activities',
    icon: '🌟',
    tier: 'Bronze',
    points: 25,
    unlocked: true,
    progress: 100,
    requirement: 'Complete 5 different activities',
    unlockedDate: '2024-11-05',
  },
  {
    id: 3,
    name: 'Meeting Regular',
    description: 'Attend 3 meetings',
    icon: '📅',
    tier: 'Bronze',
    points: 25,
    unlocked: true,
    progress: 100,
    requirement: 'Attend 3 CSG meetings',
    unlockedDate: '2024-11-10',
  },
  {
    id: 4,
    name: 'Opinion Sharer',
    description: 'Rate your first project',
    icon: '💭',
    tier: 'Bronze',
    points: 25,
    unlocked: true,
    progress: 100,
    requirement: 'Rate any project',
    unlockedDate: '2024-11-02',
  },

  // Silver Tier
  {
    id: 5,
    name: 'Project Supporter',
    description: 'Rate 10 different projects',
    icon: '🎯',
    tier: 'Silver',
    points: 50,
    unlocked: true,
    progress: 100,
    requirement: 'Rate 10 projects',
    unlockedDate: '2024-11-15',
  },
  {
    id: 6,
    name: 'Feedback Champion',
    description: 'Leave 20 helpful comments',
    icon: '💬',
    tier: 'Silver',
    points: 50,
    unlocked: true,
    progress: 100,
    requirement: 'Leave 20 comments on projects',
    unlockedDate: '2024-11-18',
  },
  {
    id: 7,
    name: 'Dedicated Attendee',
    description: 'Attend 10 meetings',
    icon: '🎓',
    tier: 'Silver',
    points: 50,
    unlocked: true,
    progress: 100,
    requirement: 'Attend 10 CSG meetings',
    unlockedDate: '2024-11-20',
  },
  {
    id: 8,
    name: 'Rising Star',
    description: 'Reach Level 5',
    icon: '⭐',
    tier: 'Silver',
    points: 50,
    unlocked: true,
    progress: 100,
    requirement: 'Reach engagement level 5',
    unlockedDate: '2024-11-22',
  },

  // Gold Tier
  {
    id: 9,
    name: 'Top Contributor',
    description: 'Be in top 10 of leaderboard',
    icon: '🏆',
    tier: 'Gold',
    points: 100,
    unlocked: true,
    progress: 100,
    requirement: 'Rank in top 10 on leaderboard',
    unlockedDate: '2024-11-24',
  },
  {
    id: 10,
    name: 'Master Rater',
    description: 'Rate 50 projects',
    icon: '🎖️',
    tier: 'Gold',
    points: 100,
    unlocked: false,
    progress: 60,
    requirement: 'Rate 50 projects (30/50)',
  },
  {
    id: 11,
    name: 'Meeting Maven',
    description: 'Perfect attendance for a semester',
    icon: '📚',
    tier: 'Gold',
    points: 100,
    unlocked: false,
    progress: 75,
    requirement: 'Attend all meetings in a semester (9/12)',
  },
  {
    id: 12,
    name: 'Engagement Expert',
    description: 'Reach Level 8',
    icon: '💎',
    tier: 'Gold',
    points: 100,
    unlocked: false,
    progress: 40,
    requirement: 'Reach engagement level 8',
  },

  // Platinum Tier
  {
    id: 13,
    name: 'Legendary Contributor',
    description: 'Maintain top 3 rank for a month',
    icon: '👑',
    tier: 'Platinum',
    points: 200,
    unlocked: false,
    progress: 0,
    requirement: 'Stay in top 3 for 30 consecutive days',
  },
  {
    id: 14,
    name: 'Perfect Score',
    description: 'Rate 100 projects with quality feedback',
    icon: '🌠',
    tier: 'Platinum',
    points: 200,
    unlocked: false,
    progress: 30,
    requirement: 'Rate 100 projects (30/100)',
  },
  {
    id: 15,
    name: 'Ultimate Attendee',
    description: 'Perfect attendance for entire year',
    icon: '🎪',
    tier: 'Platinum',
    points: 200,
    unlocked: false,
    progress: 25,
    requirement: 'Attend all meetings for full academic year (6/24)',
  },
  {
    id: 16,
    name: 'STEP Legend',
    description: 'Reach Level 10 (Max)',
    icon: '🏅',
    tier: 'Platinum',
    points: 200,
    unlocked: false,
    progress: 15,
    requirement: 'Reach maximum engagement level 10',
  },
  // Additional badges
  {
    id: 17,
    name: 'Team Player',
    description: 'Collaborate on 5 projects',
    icon: '🤝',
    tier: 'Bronze',
    points: 25,
    unlocked: true,
    progress: 100,
    requirement: 'Participate in 5 collaborative projects',
    unlockedDate: '2024-11-12',
  },
  {
    id: 18,
    name: 'Quick Starter',
    description: 'Be among first 10 to rate new projects',
    icon: '⚡',
    tier: 'Silver',
    points: 50,
    unlocked: true,
    progress: 100,
    requirement: 'Rate 5 projects within first hour of posting',
    unlockedDate: '2024-11-16',
  },
];

const tierColors = {
  Bronze: { bg: 'from-orange-400 to-orange-600', border: 'border-orange-300', text: 'text-orange-700' },
  Silver: { bg: 'from-gray-400 to-gray-600', border: 'border-gray-300', text: 'text-gray-700' },
  Gold: { bg: 'from-yellow-400 to-yellow-600', border: 'border-yellow-300', text: 'text-yellow-700' },
  Platinum: { bg: 'from-purple-400 to-purple-600', border: 'border-purple-300', text: 'text-purple-700' },
};

export default function StudentBadgesPage({ onNavigate, badgesData = [] }) {
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [selectedTier, setSelectedTier] = useState('all');
  const badgeList = badgesData.length ? badgesData : badges;

  const totalBadges = badgeList.length;
  const unlockedBadges = badgeList.filter(b => b.unlocked).length;
  const totalPoints = badgeList.filter(b => b.unlocked).reduce((sum, b) => sum + b.points, 0);

  const filteredBadges = selectedTier === 'all' 
    ? badgeList 
    : badgeList.filter(b => b.tier === selectedTier);

  const handleCloseBadgeModal = () => {
    setSelectedBadge(null);
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 text-2xl font-semibold mb-2">Badges & Achievements</h1>
        <p className="text-gray-500">Unlock badges and earn bonus points</p>
      </div>

      {/* Progress Overview */}
      <Card className="p-8 rounded-[20px] border-0 shadow-sm bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Circular Progress */}
          <div className="relative w-40 h-40 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="white"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${(unlockedBadges / totalBadges) * 440} 440`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-4xl">{unlockedBadges}</p>
                <p className="text-sm opacity-90">/ {totalBadges}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1">
            <h2 className="text-white mb-6 text-xl font-semibold">Your Badge Collection</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <CheckCircle2 className="w-6 h-6 mb-2" />
                <p className="text-2xl mb-1">{unlockedBadges}</p>
                <p className="text-xs text-white/80">Unlocked</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <Lock className="w-6 h-6 mb-2" />
                <p className="text-2xl mb-1">{totalBadges - unlockedBadges}</p>
                <p className="text-xs text-white/80">Locked</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <Star className="w-6 h-6 mb-2" />
                <p className="text-2xl mb-1">{totalPoints}</p>
                <p className="text-xs text-white/80">Badge Points</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tier Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedTier('all')}
          className={`px-4 py-2 rounded-xl transition-all ${
            selectedTier === 'all'
              ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Badges
        </button>
        {['Bronze', 'Silver', 'Gold', 'Platinum'].map((tier) => (
          <button
            key={tier}
            onClick={() => setSelectedTier(tier)}
            className={`px-4 py-2 rounded-xl transition-all ${
              selectedTier === tier
                ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tier}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredBadges.map((badge) => {
          const colors = tierColors[badge.tier];
          return (
            <button
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`p-4 rounded-[20px] border-2 transition-all hover:scale-105 ${
                badge.unlocked
                  ? `${colors.border} bg-white shadow-md`
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-3xl ${
                badge.unlocked
                  ? `bg-gradient-to-br ${colors.bg} shadow-lg`
                  : 'bg-gray-200'
              }`}>
                {badge.unlocked ? badge.icon : <Lock className="w-6 h-6 text-gray-400" />}
              </div>
              <p className="text-sm text-gray-900 mb-1 line-clamp-1">{badge.name}</p>
              <BadgeComponent
                variant="secondary"
                className={`text-xs ${badge.unlocked ? colors.text : 'text-gray-500'}`}
              >
                {badge.tier}
              </BadgeComponent>
              {!badge.unlocked && badge.progress !== undefined && badge.progress > 0 && (
                <div className="mt-2">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${colors.bg} rounded-full`}
                      style={{ width: `${badge.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{badge.progress}%</p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Badge Details Modal */}
      <StudentModal
        isOpen={selectedBadge !== null}
        onClose={handleCloseBadgeModal}
        title={selectedBadge?.name || ''}
      >
        {selectedBadge && (
          <div className="space-y-6 pt-4">
            {/* Badge Icon */}
            <div className="text-center">
              <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center text-6xl mb-4 ${
                selectedBadge.unlocked
                  ? `bg-gradient-to-br ${tierColors[selectedBadge.tier].bg} shadow-xl`
                  : 'bg-gray-200'
              }`}>
                {selectedBadge.unlocked ? selectedBadge.icon : <Lock className="w-12 h-12 text-gray-400" />}
              </div>
              <BadgeComponent className={`${tierColors[selectedBadge.tier].text} mb-2`}>
                {selectedBadge.tier} Tier
              </BadgeComponent>
              {selectedBadge.unlocked && selectedBadge.unlockedDate && (
                <p className="text-xs text-gray-500">
                  Unlocked on {new Date(selectedBadge.unlockedDate).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-gray-900 font-semibold mb-2">Description</h3>
              <p className="text-gray-600 text-sm">{selectedBadge.description}</p>
            </div>

            {/* Requirements */}
            <div>
              <h3 className="text-gray-900 font-semibold mb-2">Requirements</h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-600 text-sm">{selectedBadge.requirement}</p>
              </div>
            </div>

            {/* Progress (for locked badges) */}
            {!selectedBadge.unlocked && selectedBadge.progress !== undefined && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-900 font-semibold">Progress</h3>
                  <span className="text-sm text-gray-600">{selectedBadge.progress}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${tierColors[selectedBadge.tier].bg} rounded-full transition-all`}
                    style={{ width: `${selectedBadge.progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Reward */}
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <Star className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-blue-600">
                {selectedBadge.unlocked ? 'Earned' : 'Earn'} <strong>{selectedBadge.points} points</strong> with this badge
              </p>
            </div>

            {/* Actions */}
            <button
              onClick={handleCloseBadgeModal}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl hover:from-blue-700 hover:to-blue-900 transition-all mt-2 border-t pt-4"
            >
              Close
            </button>
          </div>
        )}
      </StudentModal>
    </div>
  );
}
