<?php

namespace App\Http\Controllers\Adviser;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Chain;
use App\Models\User;
use App\Models\User\LedgerEntry;
use App\Support\AdviserLedgerFormatter;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdviserLedgerController extends Controller
{
    public function index()
    {
        $entries = LedgerEntry::query()
            ->with('project')
            ->orderBy('created_at', 'asc')
            ->get();

        // Build a map of project_id => chain block (latest block for each project)
        $chainBlocks = [];
        foreach ($entries as $entry) {
            $block = Chain::query()
                ->where('project_id', $entry->project_id)
                ->orderByDesc('block_index')
                ->first();
            if ($block) {
                $chainBlocks[$entry->id] = $block;
            }
        }

        $byId = $entries->keyBy('id');
        $rows = [];
        $prev = null;
        $prevChain = null;
        foreach ($entries as $entry) {
            $name = $this->userName($entry->created_by);
            /**
             * @var LedgerEntry|null $prev
             */
            $currentChain = $chainBlocks[$entry->id] ?? null;
            $rows[] = AdviserLedgerFormatter::toFrontendRow(
                $entry,
                $prev,
                $name,
                'CSG Officer',
                $currentChain,
                $prevChain,
                
            );
            $prev = $entry;
            $prevChain = $currentChain;
        }

        $ordered = collect($rows)->sortByDesc('date')->values()->all();

        $auditTrail = AuditLog::query()
            ->with(['user.role'])
            ->where(function ($q) {
                $q->where('module', 'ledger')
                    ->orWhere('module', 'approvals')
                    ->orWhere('actionable_type', 'ledger_entry');
            })
            ->orderByDesc('created_at')
            ->limit(500)
            ->get()
            ->map(fn (AuditLog $log) => [
                'id' => $log->id,
                'action' => $log->action ?? '',
                'performedBy' => $log->user?->name ?? 'System',
                'role' => $log->user?->role?->name ?? 'User',
                'timestamp' => optional($log->created_at)->format('Y-m-d h:i A') ?? '',
                'ipAddress' => $log->ip_address ?? '—',
                'details' => $log->details ?? '',
            ]);

        $projectNames = LedgerEntry::query()
            ->join('projects', 'ledger_entries.project_id', '=', 'projects.id')
            ->where('projects.archive', false)
            ->distinct()
            ->orderBy('projects.title')
            ->pluck('projects.title')
            ->filter()
            ->values();

        return Inertia::render('Adviser/Ledger', [
            'ledgerEntries' => $ordered,
            'auditTrail' => $auditTrail,
            'projectFilterOptions' => $projectNames,
        ]);
    }

    public function approve(Request $request, string $id)
    {
        $entry = LedgerEntry::where('id', $id)->firstOrFail();
        $entry->update([
            'approval_status' => 'Approved',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
            'updated_by' => auth()->id(),
            'rejected_at' => null,
        ]);

        $this->writeAudit(
            'Ledger Entry Approved',
            $entry->id,
            'ledger_entry',
            ($entry->description ?? '').' — '.$entry->project?->title,
            'ledger'
        );

        return back();
    }

    public function reject(Request $request, string $id)
    {
        $data = $request->validate([
            'reason' => 'required|string|min:3|max:2000',
        ]);

        $entry = LedgerEntry::where('id', $id)->firstOrFail();
        $entry->update([
            'approval_status' => 'Rejected',
            'note' => $data['reason'],
            'rejected_at' => now(),
            'updated_by' => auth()->id(),
            'approved_by' => null,
            'approved_at' => null,
        ]);

        $this->writeAudit(
            'Ledger Entry Rejected',
            $entry->id,
            'ledger_entry',
            ($entry->description ?? '').' — '.$data['reason'],
            'ledger'
        );

        return back();
    }

    public function correction(Request $request, string $id)
    {
        $data = $request->validate([
            'reason' => 'required|string|min:3|max:2000',
        ]);

        $entry = LedgerEntry::where('id', $id)->firstOrFail();
        $prefix = AdviserLedgerFormatter::CORRECTION_PREFIX;
        $newNote = $prefix.' '.$data['reason'];
        $entry->update([
            'approval_status' => 'Pending Adviser Approval',
            'note' => $newNote,
            'updated_by' => auth()->id(),
        ]);

        $this->writeAudit(
            'Ledger Correction Requested',
            $entry->id,
            'ledger_entry',
            ($entry->description ?? '').' — '.$data['reason'],
            'ledger'
        );

        return back();
    }

    private function userName(?string $userId): string
    {
        if (! $userId) {
            return 'Unknown';
        }
        $u = User::find($userId);

        return $u?->name ?? 'Unknown';
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
