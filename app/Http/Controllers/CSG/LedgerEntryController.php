<?php
// app/Http/Controllers/LedgerEntryController.php

namespace App\Http\Controllers\CSG;

use App\Http\Controllers\Controller;
use App\Models\CSG\LedgerEntry;
use App\Models\CSG\Project;
use App\Models\CSG\Approval;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LedgerEntryController extends Controller
{
    /**
     * Get ledger entries for a specific project
     */
    public function index($projectId)
    {
        try {
            $entries = LedgerEntry::where('project_id', $projectId)
                ->where('archive', 0)
                ->orderBy('created_at', 'desc')
                ->get();
            
            // Get the project to include initial budget breakdown
            $project = Project::find($projectId);
            
            // Map entries and add project budget breakdown for the initial entry
            $mappedEntries = $entries->map(function($entry) use ($project) {
                $entryData = $entry->toArray();
                
                // If this is the initial ledger entry (created when project was created)
                // You can identify it by checking if it's the first entry or by a flag
                if ($entry->is_initial_entry || $entry->description === 'Initial project expense allocation') {
                    // For the initial entry, show the project's budget breakdown
                    $entryData['budget_breakdown'] = $project->budget_breakdown 
                        ? (is_string($project->budget_breakdown) ? json_decode($project->budget_breakdown, true) : $project->budget_breakdown)
                        : [];
                    $entryData['is_initial_entry'] = true;
                } else {
                    // For other entries, use their own budget breakdown
                    $entryData['budget_breakdown'] = $entry->budget_breakdown 
                        ? (is_string($entry->budget_breakdown) ? json_decode($entry->budget_breakdown, true) : $entry->budget_breakdown)
                        : [];
                    $entryData['is_initial_entry'] = false;
                }
                
                return $entryData;
            });
            
            return response()->json($mappedEntries);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch ledger entries',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all ledger entries (optionally filtered by project)
     */
    public function all(Request $request)
    {
        try {
            $query = LedgerEntry::where('archive', 0);

            if ($request->filled('project_id')) {
                $query->where('project_id', $request->input('project_id'));
            }

            // Only return entries for projects that exist and are not archived
            $entries = $query->with('project')
                ->whereHas('project', function ($q) {
                    $q->where('archive', 0);  // Only show entries from non-archived projects
                })
                ->orderBy('created_at', 'desc')
                ->get();

            // Process budget breakdown for each entry
            $processedEntries = $entries->map(function($entry) {
                $entryData = $entry->toArray();

                // For initial entries, ALWAYS pull the current project's budget breakdown
                // Check multiple conditions to ensure we catch all initial entries
                $isInitial = $entry->is_initial_entry 
                    || strpos($entry->description, 'Initial') !== false
                    || $entry->description === 'Initial project expense allocation';
                
                if ($isInitial && $entry->project) {
                    // Always use project's current budget breakdown for initial entries
                    $entryData['budget_breakdown'] = $entry->project->budget_breakdown
                        ? (is_string($entry->project->budget_breakdown) ? json_decode($entry->project->budget_breakdown, true) : $entry->project->budget_breakdown)
                        : [];
                    $entryData['is_initial_entry'] = true;
                } else {
                    // For non-initial entries, use their own stored budget breakdown
                    $entryData['budget_breakdown'] = $entry->budget_breakdown
                        ? (is_string($entry->budget_breakdown) ? json_decode($entry->budget_breakdown, true) : $entry->budget_breakdown)
                        : [];
                    $entryData['is_initial_entry'] = $isInitial;
                }

                // Add project name for easier display
                $entryData['project_name'] = $entry->project ? $entry->project->title : 'Unknown Project';

                return $entryData;
            });

            return response()->json($processedEntries);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch ledger entries',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a new ledger entry
     */
    public function store(Request $request)
    {
        try {
            // Validate the request
            $validated = $request->validate([
                'project_id' => 'required|exists:projects,id',
                'type' => 'required|in:Income,Expense',
                'description' => 'required|string|max:1000',
                'amount' => 'required|numeric|min:0',
                'budget_breakdown' => 'nullable|json',
                'ledger_proof' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
                'approval_status' => 'nullable|string',
                'is_initial_entry' => 'nullable|boolean',
                'created_by' => 'nullable|exists:users,id',
            ]);
            
            // Create new ledger entry
            $entry = new LedgerEntry();
            $entry->id = Str::uuid()->toString();
            $entry->project_id = $request->project_id;
            $entry->type = $request->type;
            $entry->amount = $request->amount;
            $entry->description = $request->description;
            $entry->approval_status = $request->approval_status ?? 'Draft';
            $entry->is_initial_entry = $request->is_initial_entry ?? false;
            $entry->created_by = $request->created_by;
            
            // Handle budget breakdown (store as JSON)
            if ($request->has('budget_breakdown')) {
                $entry->budget_breakdown = $request->budget_breakdown;
            }
            
            // Handle file upload
            if ($request->hasFile('ledger_proof')) {
                $file = $request->file('ledger_proof');
                $fileName = time() . '_' . $file->getClientOriginalName();
                $filePath = $file->storeAs('ledger_proofs', $fileName, 'public');
                $entry->ledger_proof = $filePath;
            }
            
            $entry->created_at = now();
            $entry->updated_at = now();
            
            $entry->save();
            
            // Add file URL to response
            if ($entry->ledger_proof) {
                $entry->ledger_proof_url = Storage::url($entry->ledger_proof);
            }
            
            return response()->json($entry, 201);
            
        } catch (ValidationException $e) {
            \Log::warning('Ledger entry validation failed: ' . json_encode($e->errors()));
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Ledger entry creation failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to create ledger entry',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update an existing ledger entry
     */
    public function update(Request $request, $id)
    {
        try {
            $entry = LedgerEntry::findOrFail($id);
            
            // Validate the request
            $validated = $request->validate([
                'type' => 'required|in:Income,Expense',
                'description' => 'required|string|max:1000',
                'amount' => 'required|numeric|min:0',
                'budget_breakdown' => 'nullable|json',
                'updated_by' => 'nullable|exists:users,id',
            ]);
            
            // Update the entry
            $entry->type = $request->type;
            $entry->description = $request->description;
            $entry->amount = $request->amount;
            $entry->updated_by = $request->updated_by;
            
            // Handle budget breakdown
            if ($request->has('budget_breakdown')) {
                $entry->budget_breakdown = $request->budget_breakdown;
            }
            
            $entry->updated_at = now();
            $entry->save();
            
            return response()->json($entry);
            
        } catch (ValidationException $e) {
            \Log::warning('Ledger entry update validation failed: ' . json_encode($e->errors()));
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Ledger entry update failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update ledger entry',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Submit ledger entry for approval
     */
    public function submitForApproval($id)
    {
        try {
            $entry = LedgerEntry::findOrFail($id);
            
            // Update approval status to Pending Adviser Approval
            $entry->approval_status = 'Pending Adviser Approval';
            $entry->updated_at = now();
            $entry->save();
            
            // Create approval record (no teacher/adviser table query)
            try {
                $approverEmployeeId = $entry->approved_by;

                if (!$approverEmployeeId && $entry->project) {
                    $approverEmployeeId = $entry->project->approve_by;
                }

                if (!$approverEmployeeId && auth()->check()) {
                    $approverEmployeeId = (string) auth()->id();
                }

                Approval::create([
                    'employee_id' => $approverEmployeeId,
                    'project_id' => (string) $entry->project_id,
                    'reference_type' => 'ledger',
                    'approvable_type' => 'ledger_entry',
                    'status' => 'pending',
                ]);
            } catch (\Exception $approvalError) {
                \Log::warning('Approval insertion skipped for ledger submit: ' . $approvalError->getMessage());
            }
            
            return response()->json($entry);
            
        } catch (\Exception $e) {
            \Log::error('Ledger entry submit for approval failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to submit ledger entry for approval',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a ledger entry
     */
    public function destroy($id)
    {
        try {
            $entry = LedgerEntry::findOrFail($id);
            $entry->archive = 1;
            $entry->updated_at = now();
            $entry->save();
            
            return response()->json(['message' => 'Ledger entry archived successfully']);
            
        } catch (\Exception $e) {
            \Log::error('Ledger entry archiving failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to archive ledger entry',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Restore an archived ledger entry
     */
    public function restore($id)
    {
        try {
            $entry = LedgerEntry::findOrFail($id);
            $entry->archive = 0;
            $entry->updated_at = now();
            $entry->save();

            return response()->json(['message' => 'Ledger entry restored successfully']);

        } catch (\Exception $e) {
            \Log::error('Ledger entry restore failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to restore ledger entry',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
