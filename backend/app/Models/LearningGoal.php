<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LearningGoal extends Model
{
    protected $fillable = [
        'name',
        'description',
    ];

    public function userLearningGoals(): HasMany
    {
        return $this->hasMany(UserLearningGoal::class);
    }
}
