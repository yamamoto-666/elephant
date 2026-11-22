<?php

namespace Tests\Feature;

use App\Models\Question;
use Database\Seeders\LearningContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LearningContentSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeder_creates_expected_learning_content(): void
    {
        $this->seed(LearningContentSeeder::class);
        $this->assertDatabaseCount('courses', 1);

        $this->assertDatabaseCount('courses', 1);
        $this->assertDatabaseCount('units', 2);
        $this->assertDatabaseCount('lessons', 6);
        $this->assertDatabaseCount('questions', 30);
        $this->assertDatabaseCount('answers', 120);

        $questions = Question::with('answers')->get();

        foreach ($questions as $question) {
            $this->assertCount(
                4,
                $question->answers,
                "問題ID {$question->id} の選択肢が４個ではありません。",
            );

            $this->assertCount(
                1,
                $question->answers->where('is_correct', true),
                "問題ID {$question->id} の正解が１個ではありません。",
            );
        }
    }

    public function test_seeder_does_not_duplicate_learning_content(): void
    {
        $this->seed(LearningContentSeeder::class);

        $this->seed(LearningContentSeeder::class);

        $this->assertDatabaseCount('courses', 1);
        $this->assertDatabaseCount('units', 2);
        $this->assertDatabaseCount('lessons', 6);
        $this->assertDatabaseCount('questions', 30);
        $this->assertDatabaseCount('answers', 120);
    }
}
