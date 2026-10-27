<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserLearningGoal extends Model
{
    protected $fillable = [
        'user_id',
        'learning_goal_id',
    ];

    public function user(): BelongsTo
    {
       return $this->belongsTo(User::class);
    }

    public function learningGoal(): BelongsTo
    {
       return $this->belongsTo(LearningGoal::class);
    }
}
