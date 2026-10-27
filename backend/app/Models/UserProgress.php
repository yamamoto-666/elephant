<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class UserProgress extends Model
{
    protected $fillable = [
        'user_id',
        'lesson_id',
        'status',
        'score',
        'completed_at',
        'first_cleared_at',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    protected function casts(): array
    {
        return  [
                'score' => 'integer',
                'completed_at' => 'datetime',
                'first_cleared_at' => 'datetime',
        ];
    }
}
