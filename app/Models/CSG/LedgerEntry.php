<?php
// app/Models/LedgerEntry.php

namespace App\Models\CSG;

use Illuminate\Database\Eloquent\Model;

class LedgerEntry extends Model
{
    protected $table = 'ledger_entries';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $fillable = [
        'id',
        'project_id',
        'type',
        'amount',
        'budget_breakdown',
        'description',
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
        'created_at',
        'updated_at',
    ];
    
    protected $casts = [
        'amount' => 'decimal:2',
        'budget_breakdown' => 'array',
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'archive' => 'integer',
    ];
    
    public function scopeActive($query)
    {
        return $query->where('archive', 0);
    }

    public function scopeArchived($query)
    {
        return $query->where('archive', 1);
    }

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }
}