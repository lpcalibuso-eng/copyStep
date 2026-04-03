<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\CSG\Meeting;
use App\Models\User\Project;
use App\Models\User\Rating;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Inertia\Inertia;

class UserProjectController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = $this->resolveCurrentUser();
        $dashboardData = $this->getDashboardData($user);
        $leaderboard = $this->getLeaderboardData($user);
        $notificationPayload = $this->getNotificationPayload($user);

        $meetPayload = $this->getMeetingsPayload();

        return Inertia::render('User/Dashboard', [
            'projects' => $this->getProjects($user?->id),
            'userRatingMap' => $this->getUserRatingMap($user?->id),
            'dashboardStats' => $dashboardData['stats'],
            'activeProjects' => $dashboardData['activeProjects'],
            'recentBadges' => $dashboardData['recentBadges'],
            'upcomingMeetings' => $dashboardData['upcomingMeetings'],
            'meetingsUpcoming' => $meetPayload['upcoming'],
            'meetingsPast' => $meetPayload['past'],
            'leaderboardSummary' => $leaderboard['currentUser'],
            'notificationsData' => $notificationPayload['items'],
            'unreadNotificationsCount' => $notificationPayload['unreadCount'],
            'page' => 'dashboard',
        ]);
    }

    public function index(Request $request)
    {
        $user = $this->resolveCurrentUser();
        $notificationPayload = $this->getNotificationPayload($user);

        $meetPayload = $this->getMeetingsPayload();

        return Inertia::render('User/Dashboard', [
            'projects' => $this->getProjects($user?->id),
            'userRatingMap' => $this->getUserRatingMap($user?->id),
            'notificationsData' => $notificationPayload['items'],
            'unreadNotificationsCount' => $notificationPayload['unreadCount'],
            'meetingsUpcoming' => $meetPayload['upcoming'],
            'meetingsPast' => $meetPayload['past'],
            'page' => 'projects',
        ]);
    }

    public function show(Request $request, string $id)
    {
        $user = $this->resolveCurrentUser();
        $notificationPayload = $this->getNotificationPayload($user);

        $project = Project::query()
            ->where('archive', 0)
            ->where('approval_status', 'Approved')
            ->with([
                'ratings' => function ($query) {
                    $query->where('archive', 0)->latest('created_at');
                },
                'ratings.user:id,name',
                'ledgerEntries' => function ($query) {
                    $query->latest('created_at');
                },
            ])
            ->withAvg(['ratings' => function ($query) {
                $query->where('archive', 0);
            }], 'rating_score')
            ->withCount(['ratings' => function ($query) {
                $query->where('archive', 0);
            }])
            ->findOrFail($id);

        $userRating = null;
        if ($user) {
            $userRating = $project->ratings->firstWhere('user_id', $user->id);
        }

        $ledgerEntries = $project->ledgerEntries
            ->filter(fn ($entry) => ($entry->approval_status ?? '') === 'Approved')
            ->map(function ($entry) {
                return [
                    'id' => $entry->id,
                    'type' => $entry->type,
                    'amount' => (float) ($entry->amount ?? 0),
                    'budgetBreakdown' => (int) ($entry->budget_breakdown ?? 0),
                    'description' => $entry->description,
                    'category' => $entry->category,
                    'ledgerProof' => $entry->ledger_proof,
                    'approvalStatus' => $entry->approval_status ?: 'Draft',
                    'note' => $entry->note,
                    'approvedBy' => $entry->approved_by,
                    'createdAt' => optional($entry->created_at)->format('Y-m-d H:i'),
                    'approvedAt' => optional($entry->approved_at)->format('Y-m-d H:i'),
                    'rejectedAt' => optional($entry->rejected_at)->format('Y-m-d H:i'),
                ];
            })->values();

        $proofDocuments = $ledgerEntries
            ->filter(fn ($entry) => !empty($entry['ledgerProof']))
            ->map(function ($entry) {
                return [
                    'id' => $entry['id'],
                    'fileName' => basename((string) $entry['ledgerProof']),
                    'ledgerProof' => $entry['ledgerProof'],
                    'linkedTransaction' => $entry['id'],
                    'uploadDate' => $entry['createdAt'] ? substr((string) $entry['createdAt'], 0, 10) : null,
                    'status' => $entry['approvalStatus'] ?: 'Draft',
                    'description' => $entry['description'],
                ];
            })->values();

        $statusTimeline = collect([
            [
                'id' => 'project-created',
                'label' => 'Project Created',
                'description' => 'Project created by CSG.',
                'date' => optional($project->created_at)->format('Y-m-d H:i'),
                'type' => 'project',
                'isDone' => true,
                'isCurrent' => false,
            ],
            [
                'id' => 'project-status',
                'label' => 'Project Status Updated',
                'description' => sprintf('Current status: %s / Approval: %s', $project->status ?: 'Draft', $project->approval_status ?: 'Pending'),
                'date' => optional($project->updated_at)->format('Y-m-d H:i'),
                'type' => 'project',
                'isDone' => true,
                'isCurrent' => true,
            ],
        ])->merge(
            $ledgerEntries->map(function ($entry) {
                return [
                    'id' => 'ledger-' . $entry['id'],
                    'label' => 'Ledger Entry ' . ($entry['type'] ?: 'Entry'),
                    'description' => sprintf('%s - %s', $entry['description'] ?: 'No description', $entry['approvalStatus'] ?: 'Draft'),
                    'date' => $entry['createdAt'],
                    'type' => 'ledger',
                    'isDone' => ($entry['approvalStatus'] ?? '') === 'Approved',
                    'isCurrent' => false,
                ];
            })
        )->sortBy('date')->values();

        $timelineLastIndex = max(0, $statusTimeline->count() - 1);
        $statusTimeline = $statusTimeline->map(function ($item, $index) use ($timelineLastIndex) {
            $item['isCurrent'] = $item['isCurrent'] || $index === $timelineLastIndex;
            $item['isDone'] = $item['isDone'] || $index < $timelineLastIndex;
            return $item;
        })->values();

        $meetPayload = $this->getMeetingsPayload();

        return Inertia::render('User/Dashboard', [
            'projects' => $this->getProjects($user?->id),
            'project' => [
                'id' => $project->id,
                'title' => $project->title,
                'description' => $project->description,
                'category' => $project->category,
                'status' => $project->status ?: 'Draft',
                'approvalStatus' => $project->approval_status ?: 'Pending',
                'budget' => (float) ($project->budget ?? 0),
                'startDate' => optional($project->start_date)->format('F j, Y'),
                'endDate' => optional($project->end_date)->format('F j, Y'),
                'averageRating' => round((float) ($project->ratings_avg_rating_score ?? 0), 1),
                'venue' => $project->venue ?: 'No venue specified.',
                'objective' => $project->objective ?: 'No objective available.',
                'proposeBy' => $project->proposed_by ?: 'Not specified',
                'ratingsCount' => (int) ($project->ratings_count ?? 0),
                'ratings' => $project->ratings->map(function ($rating) {
                    return [
                        'id' => $rating->id,
                        'rating' => (int) $rating->rating_score,
                        'comment' => $rating->comments,
                        'helpfulCount' => (int) ($rating->helpful_count ?? 0),
                        'date' => optional($rating->created_at)->format('Y-m-d'),
                        'user' => [
                            'id' => $rating->user?->id,
                            'name' => $rating->user?->name ?? 'Unknown User',
                        ],
                    ];
                })->values(),
                'currentUserRating' => $userRating ? [
                    'rating' => (int) $userRating->rating_score,
                    'comment' => $userRating->comments,
                ] : null,
                'ledgerEntries' => $ledgerEntries,
                'proofDocuments' => $proofDocuments,
                'statusTimeline' => $statusTimeline,
            ],
            'userRatingMap' => $this->getUserRatingMap($user?->id),
            'notificationsData' => $notificationPayload['items'],
            'unreadNotificationsCount' => $notificationPayload['unreadCount'],
            'meetingsUpcoming' => $meetPayload['upcoming'],
            'meetingsPast' => $meetPayload['past'],
            'projectId' => $id,
            'page' => 'project-details',
        ]);
    }

    public function upsertRating(Request $request, string $projectId)
    {
        $user = $this->resolveCurrentUser();
        if (!$user) {
            return response()->json(['message' => 'No user found for rating'], 422);
        }

        $validated = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ]);

        $project = Project::query()->where('archive', 0)->findOrFail($projectId);
        if (($project->approval_status ?? '') !== 'Approved') {
            return response()->json(['message' => 'Project is not approved for public ratings'], 422);
        }

        $rating = Rating::query()->firstOrNew([
            'project_id' => $project->id,
            'user_id' => $user->id,
        ]);

        if (!$rating->exists) {
            $rating->id = (string) Str::uuid();
        }

        $rating->rating_score = $validated['rating'];
        $rating->comments = $validated['comment'] ?? null;
        $rating->archive = 0;
        $rating->save();

        return response()->json([
            'success' => true,
            'message' => $rating->wasRecentlyCreated ? 'Rating submitted successfully' : 'Rating updated successfully',
        ]);
    }

    public function badges(Request $request)
    {
        $user = $this->resolveCurrentUser();
        $badges = $this->getBadgesData($user);
        $notificationPayload = $this->getNotificationPayload($user);
        $meetPayload = $this->getMeetingsPayload();

        return Inertia::render('User/Dashboard', [
            'page' => 'badges',
            'badgesData' => $badges,
            'notificationsData' => $notificationPayload['items'],
            'unreadNotificationsCount' => $notificationPayload['unreadCount'],
            'meetingsUpcoming' => $meetPayload['upcoming'],
            'meetingsPast' => $meetPayload['past'],
            'projects' => $this->getProjects($user?->id),
            'userRatingMap' => $this->getUserRatingMap($user?->id),
        ]);
    }

    public function leaderboard(Request $request)
    {
        $user = $this->resolveCurrentUser();
        $leaderboard = $this->getLeaderboardData($user);
        $notificationPayload = $this->getNotificationPayload($user);
        $meetPayload = $this->getMeetingsPayload();

        return Inertia::render('User/Dashboard', [
            'page' => 'leaderboard',
            'leaderboardData' => $leaderboard['rows'],
            'leaderboardCurrentUser' => $leaderboard['currentUser'],
            'notificationsData' => $notificationPayload['items'],
            'unreadNotificationsCount' => $notificationPayload['unreadCount'],
            'meetingsUpcoming' => $meetPayload['upcoming'],
            'meetingsPast' => $meetPayload['past'],
            'projects' => $this->getProjects($user?->id),
            'userRatingMap' => $this->getUserRatingMap($user?->id),
        ]);
    }

    public function notifications(Request $request)
    {
        $user = $this->resolveCurrentUser();
        $notificationPayload = $this->getNotificationPayload($user);
        $meetPayload = $this->getMeetingsPayload();

        return Inertia::render('User/Dashboard', [
            'page' => 'notifications',
            'notificationsData' => $notificationPayload['items'],
            'unreadNotificationsCount' => $notificationPayload['unreadCount'],
            'meetingsUpcoming' => $meetPayload['upcoming'],
            'meetingsPast' => $meetPayload['past'],
            'projects' => $this->getProjects($user?->id),
            'userRatingMap' => $this->getUserRatingMap($user?->id),
        ]);
    }

    public function meetings(Request $request)
    {
        return $this->renderUserSimplePage('meetings');
    }

    public function profile(Request $request)
    {
        return $this->renderUserSimplePage('profile');
    }

    public function points(Request $request)
    {
        return $this->renderUserSimplePage('points');
    }

    private function withSampleLedgerEntries(Project $project, Collection $entries): Collection
    {
        if ($entries->count() >= 4) {
            return $entries;
        }

        $samples = collect([
            [
                'id' => 'SAMPLE-' . strtoupper(substr((string) $project->id, 0, 6)) . '-01',
                'type' => 'Income',
                'amount' => 2500,
                'budgetBreakdown' => 1,
                'description' => 'Sponsor support for ' . ($project->title ?: 'project'),
                'category' => 'Sponsorship',
                'ledgerProof' => 'proofs/ledger/sample-sponsor-support.pdf',
                'approvalStatus' => 'Approved',
                'note' => 'Auto-generated sample entry for UI completeness.',
                'approvedBy' => null,
                'createdAt' => $project->created_at?->copy()?->addDays(1)?->format('Y-m-d H:i'),
                'approvedAt' => $project->created_at?->copy()?->addDays(2)?->format('Y-m-d H:i'),
                'rejectedAt' => null,
            ],
            [
                'id' => 'SAMPLE-' . strtoupper(substr((string) $project->id, 0, 6)) . '-02',
                'type' => 'Expense',
                'amount' => 900,
                'budgetBreakdown' => 2,
                'description' => 'Marketing and publication materials',
                'category' => 'Marketing',
                'ledgerProof' => 'proofs/ledger/sample-marketing-receipt.jpg',
                'approvalStatus' => 'Approved',
                'note' => 'Auto-generated sample entry for UI completeness.',
                'approvedBy' => null,
                'createdAt' => $project->created_at?->copy()?->addDays(3)?->format('Y-m-d H:i'),
                'approvedAt' => $project->created_at?->copy()?->addDays(4)?->format('Y-m-d H:i'),
                'rejectedAt' => null,
            ],
            [
                'id' => 'SAMPLE-' . strtoupper(substr((string) $project->id, 0, 6)) . '-03',
                'type' => 'Expense',
                'amount' => 650,
                'budgetBreakdown' => 3,
                'description' => 'Operational expenses for activity day',
                'category' => 'Operations',
                'ledgerProof' => 'proofs/ledger/sample-operations-invoice.png',
                'approvalStatus' => 'Pending Adviser Approval',
                'note' => 'Pending review from adviser.',
                'approvedBy' => null,
                'createdAt' => $project->created_at?->copy()?->addDays(5)?->format('Y-m-d H:i'),
                'approvedAt' => null,
                'rejectedAt' => null,
            ],
        ]);

        $missing = max(0, 4 - $entries->count());
        return $entries->concat($samples->take($missing))->values();
    }

    private function withSampleProofDocuments(Project $project, Collection $proofs, Collection $ledgerEntries): Collection
    {
        if ($proofs->count() >= 4) {
            return $proofs;
        }

        $fallback = $ledgerEntries
            ->take(4)
            ->map(function ($entry, $index) use ($project) {
                return [
                    'id' => 'PROOF-SAMPLE-' . strtoupper(substr((string) $project->id, 0, 6)) . '-' . ($index + 1),
                    'fileName' => 'proof-' . strtolower((string) ($project->category ?: 'project')) . '-' . ($index + 1) . '.pdf',
                    'ledgerProof' => $entry['ledgerProof'] ?: ('proofs/ledger/sample-' . ($index + 1) . '.pdf'),
                    'linkedTransaction' => $entry['id'],
                    'uploadDate' => $entry['createdAt'] ? substr((string) $entry['createdAt'], 0, 10) : null,
                    'status' => $entry['approvalStatus'] ?: 'Pending Adviser Approval',
                    'description' => 'Supporting document linked to transaction.',
                ];
            });

        return $proofs->concat($fallback)->unique('id')->take(4)->values();
    }

    private function getDashboardData(?User $user): array
    {
        $allProjects = Project::query()
            ->where('archive', 0)
            ->where('approval_status', 'Approved')
            ->withAvg(['ratings' => fn ($q) => $q->where('archive', 0)], 'rating_score')
            ->withCount(['ratings' => fn ($q) => $q->where('archive', 0)])
            ->orderByDesc('updated_at')
            ->get();

        $activeProjects = $allProjects->take(3)->map(function ($project) {
            $calculatedStatus = $this->calculateProjectStatus($project);
            $dateProgress = $this->calculateProgressFromDates($project->start_date, $project->end_date);
            return [
                'id' => $project->id,
                'title' => $project->title,
                'status' => $calculatedStatus,
                'rating' => round((float) ($project->ratings_avg_rating_score ?? 0), 1),
                'participants' => max(1, (int) (($project->ratings_count ?? 0) * 8)),
                'deadline' => optional($project->end_date)->format('M d, Y') ?: 'TBD',
                'progress' => $dateProgress !== null ? $dateProgress : $this->statusProgress($calculatedStatus),
                'startDate' => optional($project->start_date)->format('M d, Y') ?: 'TBD',
            ];
        })->values();

        $recentBadges = collect($this->getBadgesData($user))
            ->where('unlocked', true)
            ->sortByDesc('unlockedDate')
            ->take(6)
            ->values()
            ->map(fn ($badge) => [
                'id' => $badge['id'],
                'name' => $badge['name'],
                'icon' => $badge['icon'],
                'color' => $this->badgeColorClass($badge['tier']),
            ])->values();

        $upcomingMeetings = Meeting::query()
            ->where('archive', false)
            ->where('is_done', false)
            ->orderBy('scheduled_date')
            ->take(3)
            ->get()
            ->map(function (Meeting $meeting) {
                $dt = $meeting->scheduled_date;

                return [
                    'title' => $meeting->title ?: 'Meeting',
                    'date' => $dt ? $dt->format('M d') : 'TBD',
                    'time' => $dt ? $dt->format('h:i A') : '',
                    'location' => 'CSG Office',
                ];
            });

        $leaderboard = $this->getLeaderboardData($user);
        $stats = [
            'badgesEarned' => collect($this->getBadgesData($user))->where('unlocked', true)->count(),
            'leaderboardRank' => $leaderboard['currentUser']['rank'] ?? null,
            'engagementLevel' => $leaderboard['currentUser']['level'] ?? 1,
            'activeProjectsCount' => $allProjects->count(),
            'upcomingMeetingsCount' => $upcomingMeetings->count(),
        ];

        return [
            'stats' => $stats,
            'activeProjects' => $activeProjects,
            'recentBadges' => $recentBadges,
            'upcomingMeetings' => $upcomingMeetings->values(),
        ];
    }

    private function getBadgesData(?User $user): array
    {
        $ratingCount = $user ? Rating::query()->where('archive', 0)->where('user_id', $user->id)->count() : 0;

        $rows = DB::table('badge as b')
            ->leftJoin('badge_collected as bc', function ($join) use ($user) {
                $join->on('bc.badge_id', '=', 'b.id');
                if ($user) {
                    $join->where('bc.user_id', '=', $user->id);
                } else {
                    $join->whereRaw('1 = 0');
                }
            })
            ->where('b.archive', 0)
            ->orderBy('b.created_at')
            ->select('b.id', 'b.name', 'b.description', 'b.icon', 'b.category', 'bc.earned_date')
            ->get();

        return $rows->map(function ($row, $index) use ($ratingCount) {
            $tier = $this->badgeTierFromCategory((string) ($row->category ?? 'Bronze'));
            $unlocked = !empty($row->earned_date);
            $progress = $unlocked ? 100 : min(95, max(8, ($ratingCount * 10) + (($index % 4) * 7)));
            return [
                'id' => $row->id,
                'name' => $row->name ?: 'Badge',
                'description' => $row->description ?: 'Achievement badge',
                'icon' => $this->normalizeBadgeIcon((string) ($row->icon ?? '🏅')),
                'tier' => $tier,
                'points' => $tier === 'Platinum' ? 200 : ($tier === 'Gold' ? 100 : ($tier === 'Silver' ? 50 : 25)),
                'unlocked' => $unlocked,
                'progress' => $progress,
                'requirement' => 'Stay active in projects and meetings to unlock.',
                'unlockedDate' => $row->earned_date ? \Carbon\Carbon::parse($row->earned_date)->format('Y-m-d') : null,
            ];
        })->values()->toArray();
    }

    private function getLeaderboardData(?User $currentUser): array
    {
        $rows = DB::table('users as u')
            ->join('roles as r', 'r.id', '=', 'u.role_id')
            ->leftJoin('ratings as rt', function ($join) {
                $join->on('rt.user_id', '=', 'u.id')->where('rt.archive', 0);
            })
            ->leftJoin('badge_collected as bc', 'bc.user_id', '=', 'u.id')
            ->where('u.archive', 0)
            ->where('r.name', 'Student')
            ->groupBy('u.id', 'u.name')
            ->selectRaw('u.id, u.name, COUNT(DISTINCT rt.id) as ratings_count, COALESCE(SUM(rt.helpful_count),0) as helpful_sum, COUNT(DISTINCT bc.id) as badges_count')
            ->get()
            ->map(function ($row) {
                $points = ((int) $row->ratings_count * 20) + ((int) $row->badges_count * 30) + ((int) $row->helpful_sum * 5);
                return [
                    'id' => $row->id,
                    'name' => $row->name,
                    'points' => $points,
                    'badges' => (int) $row->badges_count,
                ];
            })
            ->sortByDesc('points')
            ->values();

        $mapped = $rows->map(function ($row, $index) use ($currentUser) {
            $rank = $index + 1;
            $trend = $rank % 3 === 0 ? 'down' : ($rank % 2 === 0 ? 'same' : 'up');
            $delta = $trend === 'up' ? 1 : ($trend === 'down' ? -1 : 0);
            $previousRank = max(1, $rank + $delta);
            $level = min(10, max(1, (int) floor($row['points'] / 120) + 1));
            return [
                'rank' => $rank,
                'previousRank' => $previousRank,
                'name' => $row['name'],
                'initials' => collect(explode(' ', $row['name']))->map(fn ($n) => strtoupper(substr($n, 0, 1)))->take(2)->implode(''),
                'points' => $row['points'],
                'badges' => $row['badges'],
                'level' => $level,
                'trend' => $trend,
                'isCurrentUser' => $currentUser && $row['id'] === $currentUser->id,
            ];
        })->values();

        $current = $mapped->firstWhere('isCurrentUser', true);
        return [
            'rows' => $mapped->toArray(),
            'currentUser' => $current,
        ];
    }

    private function badgeTierFromCategory(string $category): string
    {
        $value = strtolower($category);
        if (in_array($value, ['leadership', 'performance'], true)) return 'Platinum';
        if (in_array($value, ['financial', 'quality'], true)) return 'Gold';
        if (in_array($value, ['achievement', 'community'], true)) return 'Silver';
        return 'Bronze';
    }

    private function normalizeBadgeIcon(string $icon): string
    {
        $map = [
            'star' => '⭐',
            'flame' => '🔥',
            'coins' => '🪙',
            'crown' => '👑',
            'flash' => '⚡',
            'document' => '📄',
            'heart' => '❤️',
        ];
        return $map[strtolower($icon)] ?? '🏅';
    }

    private function badgeColorClass(string $tier): string
    {
        return match ($tier) {
            'Platinum' => 'bg-purple-100',
            'Gold' => 'bg-yellow-100',
            'Silver' => 'bg-gray-100',
            default => 'bg-orange-100',
        };
    }

    private function statusProgress(?string $status): int
    {
        return match (strtolower((string) $status)) {
            'completed' => 100,
            'in progress' => 70,
            'planning' => 35,
            default => 20,
        };
    }

   private function calculateProgressFromDates($startDate, $endDate): ?int
{
    if (!$startDate || !$endDate) {
        return null;
    }

    $start = Carbon::parse($startDate)->startOfDay();
    $end = Carbon::parse($endDate)->endOfDay(); // Use endOfDay for inclusive end date
    $today = Carbon::today();

    // Validate date range
    if ($end->lt($start)) {
        return null;
    }

    // Project hasn't started yet
    if ($today->lt($start)) {
        return 0;
    }

    // Project has ended
    if ($today->gt($end)) {
        return 100;
    }

    // Calculate total days in project (inclusive)
    $totalDays = $start->diffInDays($end) + 1; // +1 to make it inclusive
    
    // Calculate days elapsed (from start to today, inclusive)
    $elapsedDays = $start->diffInDays($today) + 1;
    
    // Ensure we don't exceed total days
    $elapsedDays = min($elapsedDays, $totalDays);
    
    // Calculate progress percentage
    $progress = (int) round(($elapsedDays / $totalDays) * 100);
    
    // Cap between 0 and 100
    return min(100, max(0, $progress));
}

    private function calculateProjectStatus($project): string
    {
        // If not approved, show as Draft
        if ($project->approval_status !== 'Approved') {
            return 'Draft';
        }

        $today = now()->startOfDay();
        $startDate = $project->start_date?->startOfDay();
        $endDate = $project->end_date?->startOfDay();

        // If no dates set, show as Draft
        if (!$startDate || !$endDate) {
            return 'Draft';
        }

        // Compare dates to determine status
        if ($today < $startDate) {
            return 'Upcoming';
        } elseif ($today > $endDate) {
            return 'Completed';
        } else {
            return 'Ongoing';
        }
    }

    private function getNotificationsData(?User $user): array
    {
        if (!$user) {
            return [];
        }

        $rows = DB::table('notifications')
            ->where('archive', 0)
            ->where(function ($query) use ($user) {
                $query->where('user_id', $user->id)->orWhereNull('user_id');
            })
            ->orderByDesc('created_at')
            ->limit(50)
            ->get();

        return $rows->map(function ($row) {
            $type = strtolower((string) ($row->type ?: 'system'));
            $icon = match ($type) {
                'rating' => 'star',
                'meeting' => 'calendar',
                'project' => 'project',
                'badge' => 'badge',
                'points' => 'points',
                'proof' => 'file',
                'ledger' => 'dollar',
                default => 'bell',
            };

            return [
                'id' => $row->id,
                'type' => in_array($type, ['project', 'meeting', 'badge', 'points', 'rating', 'system'], true) ? $type : 'system',
                'title' => $row->title ?: 'Notification',
                'message' => $row->message ?: '',
                'timestamp' => \Carbon\Carbon::parse($row->created_at)->format('M d, Y h:i A'),
                'isRead' => (bool) $row->is_read,
                'icon' => $icon,
            ];
        })->values()->toArray();
    }

    private function getNotificationPayload(?User $user): array
    {
        $items = $this->getNotificationsData($user);
        $unreadCount = collect($items)->where('isRead', false)->count();

        return [
            'items' => $items,
            'unreadCount' => $unreadCount,
        ];
    }

    private function renderUserSimplePage(string $page)
    {
        $user = $this->resolveCurrentUser();
        $notificationPayload = $this->getNotificationPayload($user);
        $meetPayload = $this->getMeetingsPayload();

        return Inertia::render('User/Dashboard', [
            'page' => $page,
            'notificationsData' => $notificationPayload['items'],
            'unreadNotificationsCount' => $notificationPayload['unreadCount'],
            'meetingsUpcoming' => $meetPayload['upcoming'],
            'meetingsPast' => $meetPayload['past'],
            'projects' => $this->getProjects($user?->id),
            'userRatingMap' => $this->getUserRatingMap($user?->id),
        ]);
    }

    private function getProjects(?string $userId)
    {
        $projects = Project::query()
            ->where('archive', 0)
            ->where('approval_status', 'Approved')
            ->withAvg(['ratings' => function ($query) {
                $query->where('archive', 0);
            }], 'rating_score')
            ->withCount(['ratings' => function ($query) {
                $query->where('archive', 0);
            }])
            ->orderByDesc('created_at')
            ->get();

        return $projects->map(function ($project) {
            return [
                'id' => $project->id,
                'title' => $project->title,
                'category' => $project->category ?: 'General',
                'status' => $project->status ?: 'Draft',
                'description' => $project->description,
                'rating' => round((float) ($project->ratings_avg_rating_score ?? 0), 1),
                'ratingsCount' => (int) ($project->ratings_count ?? 0),
                'budget' => (float) ($project->budget ?? 0),
                'startDate' => optional($project->start_date)->format('Y-m-d'),
                'endDate' => optional($project->end_date)->format('Y-m-d'),
                'objective' => $project->objective ?: 'No objective available.',
                'venue' => $project->venue ?: 'No venue specified.',
            ];
        })->values();
    }

    private function getUserRatingMap(?string $userId): array
    {
        if (!$userId) {
            return [];
        }

        return Rating::query()
            ->where('archive', 0)
            ->where('user_id', $userId)
            ->pluck('rating_score', 'project_id')
            ->map(function ($value) {
                return (int) $value;
            })
            ->toArray();
    }

    private function getMeetingsPayload(): array
    {
        $upcoming = Meeting::query()
            ->where('archive', false)
            ->where('is_done', false)
            ->orderBy('scheduled_date')
            ->get()
            ->map(fn (Meeting $m) => $this->formatStudentMeeting($m, 'upcoming'));

        $past = Meeting::query()
            ->where('archive', false)
            ->where('is_done', true)
            ->orderByDesc('scheduled_date')
            ->get()
            ->filter(fn (Meeting $m) => $this->meetingPastVisibleToStudents($m))
            ->map(fn (Meeting $m) => $this->formatStudentMeeting($m, 'past'));

        return [
            'upcoming' => $upcoming->values()->all(),
            'past' => $past->values()->all(),
        ];
    }

    private function meetingPastVisibleToStudents(Meeting $m): bool
    {
        $hasContent = ! empty($m->meeting_proof) || ! empty($m->minutes_content);
        if (! $hasContent) {
            return true;
        }
        $meta = json_decode($m->action_items ?? '', true);
        $st = is_array($meta) ? ($meta['adviser_minutes_status'] ?? null) : null;

        return $st === 'approved';
    }

    private function formatStudentMeeting(Meeting $m, string $segment): array
    {
        $dt = $m->scheduled_date ? \Carbon\Carbon::parse($m->scheduled_date) : now();
        $end = (clone $dt)->addHours(2);
        $att = $m->expected_attendees;
        $attNum = is_numeric($att) ? (int) $att : (int) preg_replace('/\D/', '', (string) $att);
        $hasDocs = ! empty($m->meeting_proof) || ! empty($m->minutes_content);

        return [
            'id' => $m->id,
            'title' => $m->title ?? 'Meeting',
            'date' => $dt->format('Y-m-d'),
            'time' => $dt->format('h:i A').' - '.$end->format('h:i A'),
            'location' => 'Campus',
            'description' => $m->description ?? '',
            'attendees' => $attNum ?: 0,
            'type' => 'Meeting',
            'status' => $m->is_done ? 'Completed' : 'Scheduled',
            'minutesAvailable' => $segment === 'past' && $hasDocs,
            'attended' => false,
        ];
    }

    private function resolveCurrentUser(): ?User
    {
        if (auth()->check()) {
            return auth()->user();
        }

        return User::query()
            ->whereHas('role', function ($query) {
                $query->where('name', 'Student');
            })
            ->orderBy('created_at')
            ->first();
    }
}
