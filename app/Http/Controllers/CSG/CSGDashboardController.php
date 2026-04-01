<?php

namespace App\Http\Controllers\CSG;

use App\Http\Controllers\Controller;
use App\Models\CSG\LedgerEntry;
use App\Models\CSG\Meeting;
use App\Models\CSG\Project;
use App\Models\User\Rating;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CSGDashboardController extends Controller
{
    public function index()
    {
        $stats = $this->computeCSGDashboardStats();
        return Inertia::render('CSG/Dashboard', $stats);
    }

    private function computeCSGDashboardStats()
    {
        $activeProjectsCount = Project::where('archive', 0)->count();
        $pendingApprovalCount = Project::where('archive', 0)->where('approval_status', 'Pending Adviser Approval')->count();

        // Calculate average rating and CSAT
        $ratings = Rating::where('archive', false)->get();
        $averageRating = $ratings->count() > 0 ? round($ratings->avg('rating_score'), 2) : 0.0;
        
        // CSAT: ratings of 3-5 stars = satisfied, 1-2 stars = not satisfied
        $satisfied = $ratings->whereIn('rating_score', [3, 4, 5])->count();
        $csatRate = $ratings->count() > 0 ? (int) round(100 * $satisfied / $ratings->count()) : 0;
        $totalRatings = $ratings->count();

        $ledgerSumsPerProject = LedgerEntry::select('project_id',
            DB::raw("SUM(CASE WHEN type = 'Income' THEN amount ELSE 0 END) as income"),
            DB::raw("SUM(CASE WHEN type = 'Expense' THEN amount ELSE 0 END) as expense")
        )->groupBy('project_id')->get();

        $projectNetValues = $ledgerSumsPerProject->map(fn($row) => (float) $row->income - (float) $row->expense);
        $avgNetForProject = $projectNetValues->count() > 0
            ? round($projectNetValues->avg(), 2)
            : 0;

        $projects = Project::where('archive', 0)
            ->latest('created_at')
            ->take(4)
            ->get()
            ->map(function ($project) {
                $ledger = LedgerEntry::where('project_id', $project->id)
                    ->selectRaw("SUM(CASE WHEN type = 'Income' THEN amount ELSE 0 END) as income")
                    ->selectRaw("SUM(CASE WHEN type = 'Expense' THEN amount ELSE 0 END) as expense")
                    ->first();

                $income = $ledger->income ? (float) $ledger->income : 0;
                $expense = $ledger->expense ? (float) $ledger->expense : 0;
                $progress = match ($project->status) {
                    'Completed' => 100,
                    'Ongoing' => 70,
                    'Planning', 'Draft' => 15,
                    default => 40,
                };

                return [
                    'id' => $project->id,
                    'title' => $project->title,
                    'status' => $project->status ?? 'Draft',
                    'income' => $income,
                    'expense' => $expense,
                    'progress' => $progress,
                    'start_date' => optional($project->start_date)->format('M d, Y'),
                    'end_date' => optional($project->end_date)->format('M d, Y'),
                ];
            });

        $recentLedgerEntries = LedgerEntry::with('project')
            ->latest('created_at')
            ->take(5)
            ->get()
            ->map(function ($entry) {
                return [
                    'id' => $entry->id,
                    'desc' => $entry->project?->title ? $entry->project->title : $entry->description,
                    'title' => $entry->description,
                    'amount' => ($entry->type === 'Income' ? '+' : '-') . '₱' . number_format($entry->amount, 2),
                    'status' => $entry->approval_status ?: 'Draft',
                    'type' => strtolower($entry->type),
                ];
            });

        $upcomingMeetings = Meeting::where('archive', false)
            ->where('is_done', false)
            ->orderBy('scheduled_date', 'asc')
            ->take(5)
            ->get()
            ->map(function ($meeting) {
                return [
                    'id' => $meeting->id,
                    'title' => $meeting->title,
                    'date' => optional($meeting->scheduled_date)->format('M d, Y'),
                    'time' => optional($meeting->scheduled_date)->format('h:i A'),
                    'attendees' => $meeting->expected_attendees ?? 0,
                ];
            });

        return [
            'statistics' => [
                'activeProjects' => $activeProjectsCount,
                'pendingApprovals' => $pendingApprovalCount,
                'avgNetPerProject' => $avgNetForProject,
                'averageRating' => $averageRating,
                'csatRate' => $csatRate,
                'totalRatings' => $totalRatings,
            ],
            'projects' => $projects,
            'recentLedgerEntries' => $recentLedgerEntries,
            'upcomingMeetings' => $upcomingMeetings,
        ];
    }
}