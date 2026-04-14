<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TeacherAdviser extends Model
{
    protected $table = 'teacher_adviser';
    protected $keyType = 'string';
    public $incrementing = false;
    
    protected $fillable = [
        'id',
        'user_id',
        'institute_id',
        'is_adviser',
        'archive',
    ];

    protected $casts = [
        'is_adviser' => 'boolean',
        'archive' => 'boolean',
    ];

    /**
     * Relationship: User
     * A teacher record belongs to a user
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    /**
     * Relationship: Institute
     * A teacher record belongs to an institute
     */
    public function institute(): BelongsTo
    {
        return $this->belongsTo(Institute::class, 'institute_id', 'id');
    }
}
