<?php

namespace App\Http\Controllers\CSG;

use App\Http\Controllers\Controller;
use App\Models\CSG\Meeting;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class MeetingController extends Controller
{
    /**
     * Get all meetings
     */
    public function all(Request $request)
    {
        try {
            $query = Meeting::where('archive', false);

            // Optional filters
            if ($request->filled('student_id')) {
                $query->where('student_id', $request->input('student_id'));
            }

            if ($request->filled('is_done')) {
                $query->where('is_done', $request->input('is_done'));
            }

            if ($request->filled('archive')) {
                $query->where('archive', $request->input('archive'));
            }

            $meetings = $query->orderBy('scheduled_date', 'desc')->get();

            // Map meetings to include formatted data using model accessors
            $processedMeetings = $meetings->map(function($meeting) {
                return [
                    'id' => $meeting->id,
                    'student_id' => $meeting->student_id,
                    'title' => $meeting->title,
                    'description' => $meeting->description,
                    'scheduled_date' => $meeting->scheduled_date,
                    'created_at' => $meeting->created_at,
                    'is_done' => $meeting->is_done,
                    'minutes_content' => $meeting->minutes_content,
                    'minutes_file_url' => $meeting->minutes_file_url,
                    'minutes_file_name' => $meeting->minutes_file_name,
                    'expected_attendees' => $meeting->expected_attendees ?? 0,
                    'attendees' => $meeting->attendees ?? [],
                    'meeting_proof' => $meeting->meeting_proof,
                    'updated_at' => $meeting->updated_at,
                    'archive' => $meeting->archive,
                    'status' => $meeting->status,
                    'date' => $meeting->date,
                    'time' => $meeting->time,
                    'hasMinutes' => $meeting->has_minutes,
                ];
            });

            return response()->json($processedMeetings);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch meetings',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a new meeting
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'student_id' => 'nullable|string',
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'scheduled_date' => 'required|date_format:Y-m-d\TH:i',
                'expected_attendees' => 'nullable|integer|min:0',
                'attendees' => 'nullable|string', // Accept as string
                'meeting_proof' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:10240',
            ]);

            // Handle file upload
            $meeting_proof = null;
            if ($request->hasFile('meeting_proof')) {
                $file = $request->file('meeting_proof');
                $fileName = time() . '_' . $file->getClientOriginalName();
                $filePath = $file->storeAs('meeting_proofs', $fileName, 'public');
                $meeting_proof = $filePath;
            }

            // Handle attendees properly - convert comma-separated string to array for JSON storage
            $attendeesArray = [];
            if ($request->has('attendees') && !empty($request->input('attendees'))) {
                $attendeesString = $request->input('attendees');
                $attendeesArray = array_map('trim', explode(',', $attendeesString));
                $attendeesArray = array_filter($attendeesArray);
            }

            $meeting = Meeting::create([
                'id' => Str::uuid()->toString(),
                'student_id' => $request->input('student_id'),
                'title' => $request->input('title'),
                'description' => $request->input('description'),
                'scheduled_date' => $request->input('scheduled_date'),
                'expected_attendees' => $request->input('expected_attendees'),
                'attendees' => $attendeesArray,
                'meeting_proof' => $meeting_proof,
                'is_done' => false,
                'archive' => false,
            ]);

            return response()->json([
                'message' => 'Meeting created successfully',
                'id' => $meeting->id,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create meeting',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update a meeting
     */
  // In MeetingController.php - update method
public function update(Request $request, $id)
{
    try {
        $meeting = Meeting::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'scheduled_date' => 'required|date_format:Y-m-d\TH:i',
            'expected_attendees' => 'nullable|integer|min:0',
            'attendees' => 'nullable|string', // Accept as string
            'is_done' => 'nullable|boolean',
            'minutes_content' => 'nullable|string',
            'meeting_proof' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:10240',
            'proof' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ]);

        $updateData = [
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'scheduled_date' => $request->input('scheduled_date'),
            'expected_attendees' => $request->input('expected_attendees'),
            'is_done' => $request->input('is_done') ? true : false,
            'minutes_content' => $request->input('minutes_content'),
        ];

        // Handle attendees properly - convert comma-separated string to array for JSON storage
        if ($request->has('attendees') && !empty($request->input('attendees'))) {
            $attendeesString = $request->input('attendees');
            // Split by comma and trim each attendee name
            $attendeesArray = array_map('trim', explode(',', $attendeesString));
            // Remove empty values
            $attendeesArray = array_filter($attendeesArray);
            $updateData['attendees'] = $attendeesArray;
        } elseif ($request->has('attendees') && $request->input('attendees') === '') {
            $updateData['attendees'] = [];
        }

        // Handle proof file upload
        if ($request->hasFile('proof')) {
            $file = $request->file('proof');
            $fileName = time() . '_proof_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('meeting_proofs', $fileName, 'public');
            $updateData['meeting_proof'] = $filePath;
        } elseif ($request->hasFile('meeting_proof')) {
            $file = $request->file('meeting_proof');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('meeting_proofs', $fileName, 'public');
            $updateData['meeting_proof'] = $filePath;
        }

        $meeting->update($updateData);

        return response()->json(['message' => 'Meeting updated successfully']);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Failed to update meeting',
            'error' => $e->getMessage(),
        ], 500);
    }
}

    /**
     * Delete a meeting (soft delete via archive)
     */
    public function destroy($id)
    {
        try {
            $meeting = Meeting::findOrFail($id);
            $meeting->archive = true;
            $meeting->updated_at = now();
            $meeting->save();

            return response()->json(['message' => 'Meeting archived successfully']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete meeting',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Toggle archive status
     */
    public function toggleArchive($id)
    {
        try {
            $meeting = Meeting::findOrFail($id);
            $meeting->archive = !$meeting->archive;
            $meeting->save();

            return response()->json(['message' => 'Meeting archive status updated']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update meeting',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Mark meeting as done
     */
    public function markAsDone($id, Request $request)
    {
        try {
            $meeting = Meeting::findOrFail($id);

            $updateData = [
                'is_done' => true,
            ];

            // Handle file upload for minutes
            if ($request->hasFile('minutes_content')) {
                $file = $request->file('minutes_content');
                $fileName = time() . '_minutes_' . $file->getClientOriginalName();
                $filePath = $file->storeAs('meeting_minutes', $fileName, 'public');
                $updateData['meeting_proof'] = $filePath;
            } elseif ($request->input('minutes_content')) {
                $updateData['minutes_content'] = $request->input('minutes_content');
            }

            if ($request->input('attendees')) {
                $updateData['attendees'] = $request->input('attendees');
            }

            $meeting->update($updateData);

            return response()->json(['message' => 'Meeting marked as completed']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to mark meeting as done',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}