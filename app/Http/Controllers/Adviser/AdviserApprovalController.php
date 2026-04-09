<?php

namespace App\Http\Controllers\Adviser;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\CSG\Meeting;
use App\Models\User;
use App\Models\User\LedgerEntry;
use App\Models\User\Project;
use App\Support\AdviserLedgerFormatter;
use App\Support\BlockchainService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdviserApprovalController extends Controller
{
    public function index()
    {
        // Include CSG/submitted rows that still need adviser action (DB mixes approval_status and status)
        $projectQuery = Project::query()
            ->where('archive', false)
            ->whereIn('approval_status', [
                'Pending Adviser Approval',
                'Pending Approval',
            ])
            ->with(['student.user'])
            ->orderByDesc('updated_at');

        $projects = $projectQuery->get()->map(fn (Project $p) => $this->serializeProject($p, 'Pending Approval'));

        $ledgerPending = LedgerEntry::query()
            ->where('approval_status', 'Pending Adviser Approval')
            ->where('is_initial_entry', false)
            ->with('project')
            ->orderByDesc('updated_at')
            ->get();

        $ledgerRows = $ledgerPending->map(fn (LedgerEntry $e) => $this->serializeLedgerCard($e));

        $proofRows = $ledgerPending
            ->filter(fn (LedgerEntry $e) => ! empty($e->ledger_proof))
            ->map(fn (LedgerEntry $e) => $this->serializeProofCard($e))
            ->values();

        $meetings = $this->pendingMeetings()->map(fn (Meeting $m) => $this->serializeMeeting($m));

        $rejectedProjects = Project::query()
            ->where('archive', false)
            ->where('approval_status', 'Rejected')
            ->with(['student.user'])
            ->orderByDesc('updated_at')
            ->get()
            ->map(fn (Project $p) => $this->serializeProject($p, 'Rejected'));

        $rejectedLedger = LedgerEntry::query()
            ->where('approval_status', 'Rejected')
            ->where('is_initial_entry', false)
            ->with('project')
            ->orderByDesc('updated_at')
            ->get()
            ->map(fn (LedgerEntry $e) => $this->serializeLedgerCard($e, 'Rejected'));

        $rejectedMeetings = Meeting::query()
            ->where('archive', false)
            ->where('is_done', true)
            ->orderByDesc('updated_at')
            ->get()
            ->filter(function (Meeting $m) {
                return ($this->meetingMinutesMeta($m)['adviser_minutes_status'] ?? null) === 'rejected';
            })
            ->map(fn (Meeting $m) => $this->serializeMeeting($m, 'Rejected'));

        $rejectedItems = $rejectedProjects->concat($rejectedLedger)->concat($rejectedMeetings)->sortByDesc(fn ($i) => $i['submittedDate'] ?? '')->values();

        // Fetch approved items
        $approvedProjects = Project::query()
            ->where('archive', false)
            ->where('approval_status', 'Approved')
            ->with(['student.user'])
            ->orderByDesc('updated_at')
            ->get()
            ->map(fn (Project $p) => $this->serializeProject($p, 'Approved'));

        $approvedLedger = LedgerEntry::query()
            ->where('approval_status', 'Approved')
            ->where('is_initial_entry', false)
            ->with('project')
            ->orderByDesc('updated_at')
            ->get()
            ->map(fn (LedgerEntry $e) => $this->serializeLedgerCard($e, 'Approved'));

        $approvedMeetings = Meeting::query()
            ->where('archive', false)
            ->where('is_done', true)
            ->orderByDesc('updated_at')
            ->get()
            ->filter(function (Meeting $m) {
                return ($this->meetingMinutesMeta($m)['adviser_minutes_status'] ?? null) === 'approved';
            })
            ->map(fn (Meeting $m) => $this->serializeMeeting($m, 'Approved'));

        $approvedItems = $approvedProjects->concat($approvedLedger)->concat($approvedMeetings)->sortByDesc(fn ($i) => $i['submittedDate'] ?? '')->values();

        return Inertia::render('Adviser/Approvals', [
            'pendingProjects' => $projects,
            'pendingLedger' => $ledgerRows,
            'pendingProofs' => $proofRows,
            'pendingMeetings' => $meetings,
            'approvedItems' => $approvedItems,
            'rejectedItems' => $rejectedItems,
        ]);
    }

    public function approve(Request $request)
    {
        $data = $request->validate([
            'type' => 'required|in:project,ledger,proof,meeting',
            'id' => 'required|string',
            'notes' => 'nullable|string|max:2000',
        ]);

        $userId = auth()->id();

        match ($data['type']) {
            'project' => $this->approveProject($data['id'], $userId, $data['notes'] ?? ''),
            'ledger', 'proof' => $this->approveLedger($data['id'], $userId, $data['notes'] ?? ''),
            'meeting' => $this->approveMeeting($data['id'], $data['notes'] ?? ''),
        };

        return back();
    }

    public function reject(Request $request)
    {
        $data = $request->validate([
            'type' => 'required|in:project,ledger,proof,meeting',
            'id' => 'required|string',
            'reason' => 'required|string|min:3|max:2000',
        ]);

        match ($data['type']) {
            'project' => $this->rejectProject($data['id'], $data['reason']),
            'ledger', 'proof' => $this->rejectLedger($data['id'], $data['reason']),
            'meeting' => $this->rejectMeeting($data['id'], $data['reason']),
        };

        return back();
    }

    private function approveProject(string $id, $userId, string $notes = ''): void
    {
        $project = Project::where('id', $id)->where('archive', false)->firstOrFail();
        $project->update([
            'approval_status' => 'Approved',
            'approve_by' => (string) $userId,
            'approved_at' => now(),
            'updated_by' => $userId,
            'note' => $notes,
        ]);

        // Create genesis block in blockchain for this project
        try {
            BlockchainService::createGenesisBlock($project->id, [
                'title' => $project->title,
                'description' => $project->description,
                'amount' => $project->budget,
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to create genesis block for project: ' . $e->getMessage());
        }

        // Auto-approve the initial budget breakdown (ledger entry)
        $initialLedgerEntry = LedgerEntry::where('project_id', $id)
            ->where(function ($q) {
                $q->where('is_initial_entry', true)
                  ->orWhere('description', 'Initial project expense allocation');
            })
            ->first();
        
        if ($initialLedgerEntry) {
            $initialLedgerEntry->update([
                'approval_status' => 'Approved',
                'approved_by' => $userId,
                'approved_at' => now(),
                'updated_by' => $userId,
                'rejected_at' => null,
                'note' => $notes,
            ]);

            $this->writeAudit(
                'Ledger Entry Approved (Auto)',
                $initialLedgerEntry->id,
                'ledger_entry',
                'Auto-approved initial budget breakdown for project: '.($project->title ?? $project->id),
                'ledger'
            );
        }

        $this->writeAudit(
            'Project Approved',
            $project->id,
            'project',
            'Approved project: '.($project->title ?? $project->id),
            'approvals'
        );
    }

    private function rejectProject(string $id, string $reason): void
    {
        $project = Project::where('id', $id)->where('archive', false)->firstOrFail();
        $project->update([
            'approval_status' => 'Rejected',
            'note' => $reason,
            'updated_by' => auth()->id(),
        ]);

        // Auto-reject the initial budget breakdown (ledger entry)
        $initialLedgerEntry = LedgerEntry::where('project_id', $id)
            ->where(function ($q) {
                $q->where('is_initial_entry', true)
                  ->orWhere('description', 'Initial project expense allocation');
            })
            ->first();
        
        if ($initialLedgerEntry) {
            $initialLedgerEntry->update([
                'approval_status' => 'Rejected',
                'rejected_at' => now(),
                'updated_by' => auth()->id(),
                'approved_by' => null,
                'approved_at' => null,
                'note' => 'Rejected with project: '.$reason,
            ]);

            $this->writeAudit(
                'Ledger Entry Rejected (Auto)',
                $initialLedgerEntry->id,
                'ledger_entry',
                'Auto-rejected initial budget breakdown for project: '.($project->title ?? $project->id),
                'ledger'
            );
        }

        $this->writeAudit(
            'Project Rejected',
            $project->id,
            'project',
            'Rejected project: '.($project->title ?? $project->id).' — '.$reason,
            'approvals'
        );
    }

    private function approveLedger(string $id, $userId, string $notes = ''): void
    {
        $entry = LedgerEntry::where('id', $id)->firstOrFail();
        $entry->update([
            'approval_status' => 'Approved',
            'approved_by' => $userId,
            'approved_at' => now(),
            'updated_by' => $userId,
            'rejected_at' => null,
            'note' => $notes,
        ]);

        // Add block to blockchain chain for this project
        try {
            BlockchainService::addBlockToChain($entry->id, $entry->project_id, [
                'description' => $entry->description,
                'amount' => $entry->amount,
                'type' => $entry->type,
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to add ledger block to chain: ' . $e->getMessage());
        }

        $details = ($entry->description ?? '').' — '.$entry->project?->title;
        $this->writeAudit(
            'Ledger Entry Approved',
            $entry->id,
            'ledger_entry',
            $details,
            'ledger'
        );
    }

    private function rejectLedger(string $id, string $reason): void
    {
        $entry = LedgerEntry::where('id', $id)->firstOrFail();
        $entry->update([
            'approval_status' => 'Rejected',
            'note' => $reason,
            'rejected_at' => now(),
            'updated_by' => auth()->id(),
            'approved_by' => null,
            'approved_at' => null,
        ]);

        $this->writeAudit(
            'Ledger Entry Rejected',
            $entry->id,
            'ledger_entry',
            ($entry->description ?? '').' — '.$reason,
            'ledger'
        );
    }

    private function approveMeeting(string $id, string $notes = ''): void
    {
        $meeting = Meeting::where('id', $id)->where('archive', false)->firstOrFail();
        $meta = $this->meetingMinutesMeta($meeting);
        $meta['adviser_minutes_status'] = 'approved';
        $meta['adviser_approval_notes'] = $notes;
        unset($meta['minutes_rejection_reason']);
        $meeting->action_items = json_encode($meta);
        $meeting->save();

        $this->writeAudit(
            'Meeting Minutes Approved',
            $meeting->id,
            'meeting',
            $meeting->title ?? $meeting->id,
            'approvals'
        );
    }

    private function rejectMeeting(string $id, string $reason): void
    {
        $meeting = Meeting::where('id', $id)->where('archive', false)->firstOrFail();
        $meta = $this->meetingMinutesMeta($meeting);
        $meta['adviser_minutes_status'] = 'rejected';
        $meta['minutes_rejection_reason'] = $reason;
        $meeting->action_items = json_encode($meta);
        $meeting->save();

        $this->writeAudit(
            'Meeting Minutes Rejected',
            $meeting->id,
            'meeting',
            ($meeting->title ?? $meeting->id).' — '.$reason,
            'approvals'
        );
    }

    private function pendingMeetings()
    {
        return Meeting::query()
            ->where('archive', false)
            ->where('is_done', true)
            ->where(function ($q) {
                $q->whereNotNull('meeting_proof')->orWhereNotNull('minutes_content');
            })
            ->orderByDesc('updated_at')
            ->get()
            ->filter(function (Meeting $m) {
                $s = $this->meetingMinutesMeta($m)['adviser_minutes_status'] ?? null;

                return $s !== 'approved' && $s !== 'rejected';
            })
            ->values();
    }

    private function meetingMinutesMeta(Meeting $m): array
    {
        $raw = $m->action_items;
        if (! $raw) {
            return [];
        }
        $j = json_decode($raw, true);

        return is_array($j) ? $j : [];
    }

    private function userName(?string $userId): string
    {
        if (! $userId) {
            return 'Unknown';
        }
        $u = User::find($userId);

        return $u?->name ?? 'Unknown';
    }

    private function serializeProject(Project $p, string $status): array
    {
        $submittedBy = $this->userName($p->created_by)
            ?: ($p->student?->user?->name ?? $p->proposed_by ?? 'Unknown');

        return [
            'id' => $p->id,
            'title' => $p->title ?? 'Untitled',
            'submittedBy' => $submittedBy,
            'submittedDate' => optional($p->updated_at)->format('Y-m-d') ?? '',
            'status' => $status,
            'category' => $p->category ?? '',
            'amount' => $p->budget !== null ? (float) $p->budget : null,
            'budget_breakdown' => $p->budget_breakdown ?? null,
            'type' => 'project',
            'approvalType' => 'project',
            'objective' => $p->objective ?? 'Not specified',
            'description' => $p->description ?? 'No description provided',
            'venue' => $p->venue ?? 'Not specified',
            'start_date' => $p->start_date ?? null,
            'end_date' => $p->end_date ?? null,
            'created_by' => $this->userName($p->created_by),
            'created_at' => optional($p->created_at)->format('Y-m-d H:i:s') ?? 'N/A',
            'proposed_by' => $p->proposed_by ?? 'Not specified',
            'ledger_proof' => $p->ledger_proof ?? null,
        ];
    }

    private function serializeLedgerCard(LedgerEntry $e, ?string $forceStatus = null): array
    {
        $status = $forceStatus ?? 'Pending Approval';
        if ($forceStatus === null && $e->approval_status === 'Rejected') {
            $status = 'Rejected';
        }

        return [
            'id' => $e->id,
            'title' => $e->description ?? 'Ledger entry',
            'submittedBy' => $this->userName($e->created_by),
            'submittedDate' => optional($e->created_at)->format('Y-m-d') ?? '',
            'status' => $status === 'Rejected' ? 'Rejected' : 'Pending Approval',
            'amount' => (float) $e->amount,
            'project' => $e->project?->title ?? '',
            'hash' => substr($e->project_id ?? $e->id, 0, 32), // Based on project ID
            'budget_breakdown' => $e->budget_breakdown ?? null,
            'type' => 'ledger',
            'approvalType' => 'ledger',
            'description' => $e->description ?? 'No description provided',
            'created_by' => $this->userName($e->created_by),
            'created_at' => optional($e->created_at)->format('Y-m-d H:i:s') ?? 'N/A',
            'entry_type' => $e->type ?? 'Expense',
        ];
    }

    private function serializeProofCard(LedgerEntry $e): array
    {
        $card = $this->serializeLedgerCard($e);
        $card['type'] = 'proof';
        $card['title'] = basename($e->ledger_proof ?? 'proof');

        return $card;
    }

    private function serializeMeeting(Meeting $m, ?string $forceStatus = null): array
    {
        $meta = $this->meetingMinutesMeta($m);
        $status = $forceStatus ?? (($meta['adviser_minutes_status'] ?? null) === 'rejected' ? 'Rejected' : 'Pending Approval');

        return [
            'id' => $m->id,
            'title' => ($m->title ?? 'Meeting').($m->minutes_file_name ? ' — Minutes' : ''),
            'submittedBy' => $m->student_id ?? 'Unknown',
            'submittedDate' => optional($m->updated_at)->format('Y-m-d') ?? '',
            'status' => $status,
            'type' => 'meeting',
        ];
    }

    private function writeAudit(string $action, ?string $actionableId, ?string $actionableType, string $details, string $module): void
    {
        AuditLog::create([
            'id' => (string) Str::uuid(),
            'user_id' => auth()->id(),
            'actionable_id' => $actionableId,
            'actionable_type' => $actionableType,
            'action' => $action,
            'module' => $module,
            'details' => $details,
            'ip_address' => request()->ip(),
            'browser_info' => substr((string) request()->userAgent(), 0, 500),
            'archive' => 0,
        ]);
    }
}
