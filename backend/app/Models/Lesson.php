<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;


class Lesson extends Model
{
    protected $fillable = [
        'unit_id',
        'title',
        'content',
        'order_number',
    ];

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }

    public function words(): HasMany
    {
        return $this->hasMany(Word::class);
    }
}
