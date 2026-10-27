<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class StudyLog extends Model
{
    protected $fillable = [
        'user_id',
        'lesson_id',
        'study_date',
        'study_minutes',
        'xp_earned',
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
        return [
            'study_date' => 'date',
            'study_minutes' => 'integer',
            'xp_earned' => 'integer',
        ];
    }
}
