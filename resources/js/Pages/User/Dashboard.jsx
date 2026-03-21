import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { StudentNavbar } from '@/Components/StudentNavbar';
import { StudentDashboardHome } from './pages/StudentDashboardHome';
import StudentProjectsPage from './pages/StudentProjects';
import StudentMeetingsPage from './pages/StudentMeetings';
import StudentProjectDetails from './pages/StudentProjectDetails';
import StudentBadgesPage from './pages/StudentBadges';
import StudentLeaderboardPage from './pages/StudentLeaderboard';
import StudentNotificationsPage from './pages/StudentNotifications';
import StudentProfilePage from './pages/StudentProfile';

export default function UserDashboard() {
  const { url, props } = usePage();
  const currentPage = props.page || 'dashboard';
  const projectId = props.projectId || null;
  const projects = props.projects || [];
  const project = props.project || null;
  const userRatingMap = props.userRatingMap || {};
  const dashboardStats = props.dashboardStats || {};
  const activeProjects = props.activeProjects || [];
  const recentBadges = props.recentBadges || [];
  const upcomingMeetings = props.upcomingMeetings || [];
  const leaderboardSummary = props.leaderboardSummary || null;
  const badgesData = props.badgesData || [];
  const leaderboardData = props.leaderboardData || [];
  const leaderboardCurrentUser = props.leaderboardCurrentUser || null;
  const notificationsData = props.notificationsData || [];
  const unreadNotificationsCount = props.unreadNotificationsCount || 0;

  // Map routes to current view
  const getCurrentView = () => {
    if (url === '/user' || url === '/user/') return 'dashboard';
    if (url.startsWith('/user/projects/') && url !== '/user/projects') return 'project-details';
    if (url === '/user/projects') return 'projects';
    if (url === '/user/meetings') return 'meetings';
    if (url === '/user/profile') return 'profile';
    if (url === '/user/points') return 'points';
    if (url === '/user/badges') return 'badges';
    if (url === '/user/leaderboard') return 'leaderboard';
    if (url === '/user/notifications') return 'notifications';
    return currentPage || 'dashboard';
  };

  const currentView = getCurrentView();

  const handleNavigate = (view) => {
    const routes = {
      dashboard: '/user',
      projects: '/user/projects',
      meetings: '/user/meetings',
      profile: '/user/profile',
      points: '/user/points',
      badges: '/user/badges',
      leaderboard: '/user/leaderboard',
      notifications: '/user/notifications',
    };
    window.location.href = routes[view] || '/user';
  };

  const handleViewProjectDetails = (id) => {
    window.location.href = `/user/projects/${id}`;
  };

  const handleBackFromDetails = () => {
    window.location.href = '/user/projects';
  };

  const handleLogout = () => {
    router.post('/logout');
  };

  const handleSwitchRole = () => { /* your role switch logic */ };
  const userData = { canSwitch: true };

  return (
    <>
      <StudentNavbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
        userData={userData}
        notificationsData={notificationsData}
        unreadNotificationsCount={unreadNotificationsCount}
      />
      <AuthenticatedLayout
        header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Student Dashboard</h2>}
      >
        <Head title="Student Dashboard" />
        <div className="pt-8 px-4 lg:px-0 md:px-0 lg:pt-24 lg:pb-8 pb-20"> {/* adjust padding to match navbar height */}
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            {currentView === 'dashboard' && (
              <StudentDashboardHome
                onNavigate={handleNavigate}
                onViewProject={handleViewProjectDetails}
                stats={dashboardStats}
                activeProjects={activeProjects}
                recentBadges={recentBadges}
                upcomingMeetings={upcomingMeetings}
                leaderboardSummary={leaderboardSummary}
              />
            )}
            {currentView === 'projects' && (
              <StudentProjectsPage
                onNavigate={handleNavigate}
                onViewDetails={handleViewProjectDetails}
                projects={projects}
                userRatingMap={userRatingMap}
              />
            )}
            {currentView === 'project-details' && (
              <StudentProjectDetails
                projectId={projectId}
                onBack={handleBackFromDetails}
                project={project}
              />
            )}
            {currentView === 'meetings' && <StudentMeetingsPage onNavigate={handleNavigate} />}
            {currentView === 'profile' && <StudentProfilePage onNavigate={handleNavigate} />}
            {currentView === 'badges' && <StudentBadgesPage onNavigate={handleNavigate} badgesData={badgesData} />}
            {currentView === 'leaderboard' && (
              <StudentLeaderboardPage
                onNavigate={handleNavigate}
                leaderboardData={leaderboardData}
                currentUser={leaderboardCurrentUser}
              />
            )}
            {currentView === 'notifications' && (
              <StudentNotificationsPage onNavigate={handleNavigate} notificationsData={notificationsData} />
            )}
          </div>
        </div>
      </AuthenticatedLayout>
    </>
  );
}