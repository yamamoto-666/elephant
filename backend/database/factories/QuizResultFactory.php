<?php

namespace Database\Factories;

use App\Models\QuizResult;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<QuizResult>
 */
class QuizResultFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'status' => 'in_progress',
            'total_questions' => '2',
            'correct_count' => '0',
            'wrong_count' => '0',
            'score' => '0',
            'xp_earned' => '0',
        ];
    }
}
