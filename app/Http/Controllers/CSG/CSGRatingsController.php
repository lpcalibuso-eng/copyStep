<?php

namespace App\Http\Controllers\CSG;

use App\Http\Controllers\Controller;
use App\Models\User\Project;
use App\Models\User\Rating;
use Carbon\Carbon;
use Inertia\Inertia;

class CSGRatingsController extends Controller
{
    public function index()
    {
        $projects = Project::query()
            ->where('archive', false)
            ->where('approval_status', 'Approved')
            ->pluck('id');

        $ratings = Rating::query()
            ->where('archive', false)
            ->whereIn('project_id', $projects)
            ->with(['project:id,title', 'user:id,name'])
            ->orderByDesc('created_at')
            ->get();

        $byProject = $ratings->groupBy('project_id');

        $projectSummaries = Project::query()
            ->whereIn('id', $projects)
            ->get()
            ->map(function (Project $project) use ($byProject) {
                $rows = $byProject->get($project->id, collect());
                $total = $rows->count();
                $avg = $total > 0 ? round($rows->avg('rating_score'), 2) : 0.0;
                
                // Rating distribution
                $distribution = [5 => 0, 4 => 0, 3 => 0, 2 => 0, 1 => 0];
                foreach ($rows as $row) {
                    $s = (int) $row->rating_score;
                    if ($s >= 1 && $s <= 5) {
                        $distribution[$s]++;
                    }
                }

                // CSAT Calculation: 1-2 stars = not satisfied, 3-5 stars = satisfied
                $satisfied = $distribution[5] + $distribution[4] + $distribution[3];
                $notSatisfied = $distribution[2] + $distribution[1];
                $csat = $total > 0 ? (int) round(100 * $satisfied / $total) : 0;

                return [
                    'id' => $project->id,
                    'projectName' => $project->title ?? 'Untitled',
                    'averageRating' => $total ? (float) $avg : 0.0,
                    'totalRatings' => $total,
                    'ratingDistribution' => $distribution,
                    'csat' => $csat,
                    'satisfied' => $satisfied,
                    'notSatisfied' => $notSatisfied,
                ];
            })
            ->sortByDesc('totalRatings')
            ->values();

        $recentComments = $ratings->map(function (Rating $r) {
            return [
                'id' => $r->id,
                'studentName' => $r->user?->name ?? 'Student',
                'projectName' => $r->project?->title ?? 'Project',
                'projectId' => $r->project_id,
                'rating' => (int) $r->rating_score,
                'comment' => (string) ($r->comments ?? ''),
                'date' => optional($r->created_at)->format('Y-m-d') ?? '',
                'createdAt' => optional($r->created_at)?->toIso8601String(),
                'helpful' => (int) ($r->helpful_count ?? 0),
            ];
        })->values();

        // Overall statistics
        $overallAvg = $ratings->count() ? round($ratings->avg('rating_score'), 2) : 0.0;
        
        // CSAT: 3-5 stars = satisfied
        $satisfied = $ratings->whereIn('rating_score', [3, 4, 5])->count();
        $notSatisfied = $ratings->whereIn('rating_score', [1, 2])->count();
        $csatRate = $ratings->count() ? (int) round(100 * $satisfied / $ratings->count()) : 0;

        return Inertia::render('CSG/Ratings', [
            'projectSummaries' => $projectSummaries,
            'recentComments' => $recentComments,
            'kpi' => [
                'overallAverage' => (float) $overallAvg,
                'totalRatings' => $ratings->count(),
                'projectCountWithRatings' => $byProject->count(),
                'csatRate' => $csatRate,
                'satisfied' => $satisfied,
                'notSatisfied' => $notSatisfied,
            ],
        ]);
    }

    /**
     * Get ratings data as JSON (for AJAX/API calls)
     */
    public function getRatingsData()
    {
        $projects = Project::query()
            ->where('archive', false)
            ->where('approval_status', 'Approved')
            ->pluck('id');

        $ratings = Rating::query()
            ->where('archive', false)
            ->whereIn('project_id', $projects)
            ->with(['project:id,title', 'user:id,name'])
            ->orderByDesc('created_at')
            ->get();

        $byProject = $ratings->groupBy('project_id');

        $projectSummaries = Project::query()
            ->whereIn('id', $projects)
            ->get()
            ->map(function (Project $project) use ($byProject) {
                $rows = $byProject->get($project->id, collect());
                $total = $rows->count();
                $avg = $total > 0 ? round($rows->avg('rating_score'), 2) : 0.0;
                
                $distribution = [5 => 0, 4 => 0, 3 => 0, 2 => 0, 1 => 0];
                foreach ($rows as $row) {
                    $s = (int) $row->rating_score;
                    if ($s >= 1 && $s <= 5) {
                        $distribution[$s]++;
                    }
                }

                $satisfied = $distribution[5] + $distribution[4] + $distribution[3];
                $notSatisfied = $distribution[2] + $distribution[1];
                $csat = $total > 0 ? (int) round(100 * $satisfied / $total) : 0;

                return [
                    'id' => $project->id,
                    'projectName' => $project->title ?? 'Untitled',
                    'averageRating' => $total ? (float) $avg : 0.0,
                    'totalRatings' => $total,
                    'ratingDistribution' => $distribution,
                    'csat' => $csat,
                    'satisfied' => $satisfied,
                    'notSatisfied' => $notSatisfied,
                ];
            })
            ->sortByDesc('totalRatings')
            ->values();

        $recentComments = $ratings
            ->sortByDesc('created_at')
            ->take(10)
            ->map(function (Rating $r) {
                return [
                    'id' => $r->id,
                    'studentName' => $r->user?->name ?? 'Student',
                    'projectName' => $r->project?->title ?? 'Project',
                    'projectId' => $r->project_id,
                    'rating' => (int) $r->rating_score,
                    'comment' => (string) ($r->comments ?? ''),
                    'date' => optional($r->created_at)->format('Y-m-d') ?? '',
                    'helpful' => (int) ($r->helpful_count ?? 0),
                ];
            })->values();

        $overallAvg = $ratings->count() ? round($ratings->avg('rating_score'), 2) : 0.0;
        $satisfied = $ratings->whereIn('rating_score', [3, 4, 5])->count();
        $notSatisfied = $ratings->whereIn('rating_score', [1, 2])->count();
        $csatRate = $ratings->count() ? (int) round(100 * $satisfied / $ratings->count()) : 0;

        return response()->json([
            'projectSummaries' => $projectSummaries,
            'recentComments' => $recentComments,
            'kpi' => [
                'overallAverage' => (float) $overallAvg,
                'totalRatings' => $ratings->count(),
                'projectCountWithRatings' => $byProject->count(),
                'csatRate' => $csatRate,
                'satisfied' => $satisfied,
                'notSatisfied' => $notSatisfied,
            ],
        ]);
    }
}
