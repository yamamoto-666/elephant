<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;


class QuizResult extends Model
{
    protected $fillable = [
        'status',
        'total_questions',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    public function userAnswers(): HasMany
    {
        return $this->hasMany(UserAnswer::class);
    }

    protected function casts(): array
    {
        return [
            'total_questions' => 'integer',
            'correct_count' => 'integer',
            'wrong_count' => 'integer',
            'score' => 'integer',
            'xp_earned' => 'integer',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
            'xp_awarded_at' => 'datetime',
        ];
    }
}
