<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LedgerEntry extends Model
{
    use HasFactory;

    protected $table = 'ledger_entries';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'project_id',
        'type',
        'amount',
        'budget_breakdown',
        'description',
        'category',
        'ledger_proof',
        'approval_status',
        'note',
        'approved_by',
        'created_by',
        'updated_by',
        'approved_at',
        'rejected_at',
        'archive',
        'is_initial_entry', //dinagdag para ma-identify kung initial entry ba ito o hindi kasi ang ginawa ko pagna approved si project auto approved naden si initial entry nya
    ];

    protected $casts = [
        'archive' => 'integer',
        'amount' => 'decimal:2',
        'budget_breakdown' => 'json',
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'project_id', 'id');
    }
}
