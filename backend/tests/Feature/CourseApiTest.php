<?php

namespace Tests\Feature;

use App\Models\Course;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CourseApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_course_detail_counts_only_its_own_lessons(): void
    {
        // 対象コース：2ユニットに1件ずつ、合計2レッスン
        $course = Course::create([
            'title' => 'Daily English',
            'description' => 'Learn everyday English.',
            'difficulty' => 'beginner',
        ]);

        foreach ([1, 2] as $orderNumber) {
            $unit = $course->units()->create([
                'title' => "Unit {$orderNumber}",
                'order_number' => $orderNumber,
            ]);

            $unit->lessons()->create([
                'title' => "Lesson {$orderNumber}",
                'content' => 'Practice everyday English.',
                'order_number' => 1,
            ]);
        }

        // 別コースのレッスンは、集計に含まれないことを確認する
        $otherCourse = Course::create([
            'title' => 'Travel English',
            'description' => 'Learn English for travel.',
            'difficulty' => 'beginner',
        ]);

        $otherUnit = $otherCourse->units()->create([
            'title' => 'At the Airport',
            'order_number' => 1,
        ]);

        $otherUnit->lessons()->create([
            'title' => 'Checking In',
            'content' => 'Practice checking in at an airport.',
            'order_number' => 1,
        ]);

        $response = $this->getJson("/api/courses/{$course->id}");

        $response
            ->assertOk()
            ->assertJsonPath('data.id', $course->id)
            ->assertJsonPath('data.lessons_count', 2);
    }

        public function test_course_detail_returns_zero_when_it_has_no_lessons(): void
    {
        $course = Course::create([
            'title' => 'New Course',
            'description' => 'A course without lessons.',
            'difficulty' => 'beginner',
        ]);

        $response = $this->getJson("/api/courses/{$course->id}");

        $response
            ->assertOk()
            ->assertJsonPath('data.lessons_count', 0);
    }
}