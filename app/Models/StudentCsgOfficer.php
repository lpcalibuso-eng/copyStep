<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentCsgOfficer extends Model
{
    use HasFactory;

    protected $table = 'student_csg_officers';

    protected $fillable = [
        'id',
        'user_id',
        'course_id',
        'adviser_id',
        'is_csg',
        'csg_position',
        'csg_term_start',
        'csg_term_end',
        'csg_is_active',
        'archive',
    ];

    protected $casts = [
        'is_csg' => 'boolean',
        'csg_is_active' => 'boolean',
        'archive' => 'boolean',
        'csg_term_start' => 'date',
        'csg_term_end' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id', 'id');
    }

    public function adviser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'adviser_id', 'id');
    }
}