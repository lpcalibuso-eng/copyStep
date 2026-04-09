<?php

namespace App\Http\Controllers\Adviser;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\CSG\Meeting;
use App\Models\Student;
use App\Models\User;
use App\Models\User\LedgerEntry;
use App\Models\User\Project;
use App\Models\User\Rating;
use Illuminate\Http\Request;
// use Illuminate\Support\Carbon;
// use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdviserDashboardController extends Controller
{
    public function index(Request $request)
    {
        $pendingProjects = Project::query()
            ->where('archive', false)
            ->whereIn('approval_status', ['Pending Adviser Approval', 'Pending Approval'])
            ->count();

              $pendingLedger = LedgerEntry::query()
            ->where('archive', false)
            ->whereIn('approval_status', ['Pending Adviser Approval', 'Pending Approval'])
            ->count();

        $activeCsgCount = Student::where('is_csg', true)->where('csg_is_active', true)->where('archive', false)->count();

        $pendingMeetings = Meeting::query()
            ->where('archive', false)
            ->where('is_done', true)
            ->where(function ($q) {
                $q->whereNotNull('meeting_proof')->orWhereNotNull('minutes_content');
            })
            ->get()
            ->filter(function (Meeting $m) {
                $meta = json_decode($m->action_items ?? '', true);
                $s = is_array($meta) ? ($meta['adviser_minutes_status'] ?? null) : null;

                return $s !== 'approved' && $s !== 'rejected';
            })
            ->count();

        $pendingApprovalsTotal = $pendingProjects + $pendingLedger + $pendingMeetings;

        $ratingAvg = Rating::query()->where('archive', false)->avg('rating_score');
        $avgRating = $ratingAvg !== null ? round((float) $ratingAvg, 2) : 0.0;

        $recentActivity = AuditLog::query()
            ->with('user:id,name')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(function (AuditLog $log) {
                $action = strtolower((string) ($log->action ?? ''));

                return [
                    'action' => $log->action ?? 'Activity',
                    'time' => optional($log->created_at)->diffForHumans() ?? '',
                    'status' => str_contains($action, 'reject') ? 'rejected' : 'approved',
                ];
            });

        $queue = collect();

        foreach (LedgerEntry::with('project')->where('approval_status', 'Pending Adviser Approval')->orderByDesc('updated_at')->limit(2)->get() as $e) {
            $queue->push([
                'type' => 'Ledger Entry',
                'title' => $e->description ?: 'Ledger transaction',
                'amount' => $e->amount !== null ? '₱'.number_format((float) $e->amount, 2) : null,
                'submittedBy' => User::query()->find($e->created_by)?->name ?? 'CSG',
                'time' => optional($e->updated_at)->diffForHumans() ?? '',
                'priority' => 'high',
            ]);
        }

        foreach (Project::query()->where('archive', false)->whereIn('approval_status', ['Pending Adviser Approval', 'Pending Approval'])->orderByDesc('updated_at')->limit(2)->get() as $p) {
            if ($queue->count() >= 3) {
                break;
            }
            $queue->push([
                'type' => 'Project',
                'title' => $p->title ?: 'Project',
                'amount' => $p->budget !== null ? '₱'.number_format((float) $p->budget, 2) : null,
                'submittedBy' => User::query()->find($p->created_by)?->name ?? ($p->proposed_by ?? 'CSG'),
                'time' => optional($p->updated_at)->diffForHumans() ?? '',
                'priority' => 'medium',
            ]);
        }

        return Inertia::render('Adviser/Dashboard', [
            'stats' => [
                'pendingApprovals' => $pendingApprovalsTotal,
                // 'pendingProjects' => $pendingProjects,
                // 'pendingLedger' => $pendingLedger,
                'pendingMeetings' => $pendingMeetings,
                'avgRating' => $avgRating,
                'systemAlerts' => min(10, AuditLog::query()->where('archive', false)->where('created_at', '>=', now()->subDay())->where(function ($q) {
                    $q->where('action', 'like', '%reject%')->orWhere('action', 'like', '%Reject%');
                })->count()),
                'activeCsgCount' => $activeCsgCount,
            ],
            'approvalQueue' => $queue->take(3)->values(),
            'recentActivity' => $recentActivity,
        ]);
    }
}
