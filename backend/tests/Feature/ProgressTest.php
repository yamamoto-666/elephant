<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use App\Models\User;
use App\Models\Course;
use App\Models\Unit;
use App\Models\Lesson;
use Tests\TestCase;
use App\Models\QuizResult;

class ProgressTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic feature test example.
     */
    public function test_guest_cannot_access_progress(): void
    {
        $response = $this->getJson('/api/progress');

        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_get_progress(): void
    {
        $user = User::factory()->create([
            'xp' => 20,
            'level' => 1,
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/progress');

        $response->assertOk();

        $response->assertJsonPath('total_xp', 20);
        $response->assertJsonPath('level', 1);
        $response->assertJsonPath('completed_lessons', 0);
        $response->assertJsonPath('average_score', 0);
    }

    public function test_progress_counts_unique_completed_lessons(): void
    {
        $user = User::factory()->create([
            'xp' => 20,
            'level' => 1,
        ]);

        $course = Course::create([
            'title' => 'Daily English',
            'difficulty' => 'beginner',
        ]);

        $unit = Unit::create([
            'course_id' => $course->id,
            'title' => 'Hello',
            'order_number' => 1,
        ]);

        $lesson1 = Lesson::create([
            'unit_id' => $unit->id,
            'title' => 'Greetings',
            'order_number' => 1,
        ]);

        $lesson2 = Lesson::create([
            'unit_id' => $unit->id,
            'title' => 'Hello',
            'order_number' => 2,
        ]);

        QuizResult::factory()->create([
            'user_id' => $user->id,
            'lesson_id' => $lesson1->id,
            'status' => 'completed',
            'score' => 100,
        ]);

        QuizResult::factory()->create([
            'user_id' => $user->id,
            'lesson_id' => $lesson1->id,
            'status' => 'completed',
            'score' => 80,
        ]);

        QuizResult::factory()->create([
            'user_id' => $user->id,
            'lesson_id' => $lesson2->id,
            'status' => 'completed',
            'score' => 60,
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/progress');

        $response->assertOk();

        $response->assertJsonPath('completed_lessons', 2);
        $response->assertJsonPath('average_score', 80);
        $response->assertJsonPath('total_xp', 20);
    }

    public function test_progress_excludes_other_users_quiz_results(): void
    {
        // 2人のユーザーを作成
        $userA = User::factory()->create(['xp' => 20]);
        $userB = User::factory()->create(['xp' => 50]);

        // コース
        $course = Course::create([
            'title' => 'Daily English',
            'difficulty' => 'beginner',
        ]);

        // ユニット
        $unit = Unit::create([
            'course_id' => $course->id,
            'title' => 'Greetings',
            'order_number' => 1,
        ]);

        // 2つのレッスン
        $lesson1 = Lesson::create([
            'unit_id' => $unit->id,
            'title' => 'Hello',
            'order_number' => 1,
        ]);

        $lesson2 = Lesson::create([
            'unit_id' => $unit->id,
            'title' => 'Introduction',
            'order_number' => 2,
        ]);

        // User Aの履歴
        QuizResult::factory()->create([
            'user_id' => $userA->id,
            'lesson_id' => $lesson1->id,
            'status' => 'completed',
            'score' => 100,
        ]);

        // User Bの履歴
        QuizResult::factory()->create([
            'user_id' => $userB->id,
            'lesson_id' => $lesson2->id,
            'status' => 'completed',
            'score' => 60,
        ]);

        // User Aとしてアクセス
        $response = $this->actingAs($userA, 'sanctum')
            ->getJson('/api/progress');

        $response->assertOk();
        $response->assertJsonPath('total_xp', 20);
        $response->assertJsonPath('completed_lessons', 1);
        $response->assertJsonPath('average_score', 100);
    }

    public function test_progress_excludes_in_progress_quizzes(): void
    {
        // ① テスト用ユーザー
        $user = User::factory()->create([
            'xp' => 10,
            'level' => 1,
        ]);

        // ② コース・ユニットを作成
        $course = Course::create([
            'title' => 'Daily English',
            'difficulty' => 'beginner',
        ]);

        $unit = Unit::create([
            'course_id' => $course->id,
            'title' => 'Greetings',
            'order_number' => 1,
        ]);

        // ③ 2つのレッスンを作成
        $lesson1 = Lesson::create([
            'unit_id' => $unit->id,
            'title' => 'Lesson 1',
            'order_number' => 1,
        ]);

        $lesson2 = Lesson::create([
            'unit_id' => $unit->id,
            'title' => 'Lesson 2',
            'order_number' => 2,
        ]);

        // ④ 完了済みクイズ
        QuizResult::factory()->create([
            'user_id' => $user->id,
            'lesson_id' => $lesson1->id,
            'status' => 'completed',
            'score' => 100,
        ]);

        // ⑤ 進行中クイズ
        QuizResult::factory()->create([
            'user_id' => $user->id,
            'lesson_id' => $lesson2->id,
            'status' => 'in_progress',
            'score' => 0,
        ]);

        // ⑥ 学習進捗APIを呼び出す
        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/progress');

        // ⑦ 正しい集計結果を検証
        $response->assertOk();
        $response->assertJsonPath('completed_lessons', 1);
        $response->assertJsonPath('average_score', 100);
        $response->assertJsonPath('total_xp', 10);
    }
}
