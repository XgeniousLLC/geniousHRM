<?php

namespace Modules\Recruitment\app\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobPosting extends Model
{
    protected $fillable = [
        'title', 'department_id', 'position_id', 'location', 'type', 'work_mode',
        'salary_min', 'salary_max', 'description', 'requirements', 'status', 'deadline',
    ];

    protected $casts = ['deadline' => 'date'];

    public function department(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Department::class);
    }

    public function position(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Position::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(JobApplication::class);
    }
}
