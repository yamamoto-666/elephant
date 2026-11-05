<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

use App\Models\User;
use App\Models\Course;
use App\Models\Unit;
use App\Models\Lesson;
use App\Models\Question;
use App\Models\Answer;
use App\Models\QuizResult;

class QuizApiTest extends TestCase
{
    use RefreshDatabase;

    // ==========================================
    // 1. 未ログインユーザーはクイズを開始できない
    // ==========================================
    public function test_guest_cannot_start_quiz(): void
    {
        $response = $this->postJson('/api/lessons/1/quiz/start');

        $response->assertStatus(401);
    }

    // ==========================================
    // 2. ログイン済みユーザーはクイズを開始できる
    // ==========================================
    public function test_authenticated_user_can_start_quiz(): void
    {
        $user = User::factory()->create();

        $lesson = $this->createLesson();

        Question::create([
            'lesson_id' => $lesson->id,
            'question_text' => 'What does Hello mean?',
            'question_type' => 'multiple_choice',
            'order_number' => 1,
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/lessons/{$lesson->id}/quiz/start");

        // HTTP 201を確認
        $response->assertStatus(201);

        // クイズ結果が保存されたことを確認
        $this->assertDatabaseHas('quiz_results', [
            'user_id' => $user->id,
            'lesson_id' => $lesson->id,
            'status' => 'in_progress',
            'total_questions' => 1,
        ]);
    }

    // ==========================================
    // 3. 問題が0問のレッスンは開始できない
    // ==========================================
    public function test_cannot_start_quiz_without_questions(): void
    {
        $user = User::factory()->create();

        $lesson = $this->createLesson('Empty Lesson');

        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/lessons/{$lesson->id}/quiz/start");

        // HTTP 422を確認
        $response->assertStatus(422);

        // クイズ結果が作成されていないことを確認
        $this->assertDatabaseMissing('quiz_results', [
            'user_id' => $user->id,
            'lesson_id' => $lesson->id,
        ]);
    }

    // ==========================================
    // 4. 未ログインユーザーは回答できない
    // ==========================================
    public function test_guest_cannot_submit_answer(): void
    {
        $response = $this->postJson('/api/quiz-results/1/answers', [
            'question_id' => 1,
            'answer_id' => 1,
        ]);

        $response->assertStatus(401);
    }

    // ==========================================
    // 5. 回答保存・採点・XP付与・再挑戦
    // ==========================================
    public function test_authenticated_user_can_submit_answer(): void
    {
        // --------------------------------------
        // テストデータを作成
        // --------------------------------------
        $user = User::factory()->create();

        $lesson = $this->createLesson();

        $question = Question::create([
            'lesson_id' => $lesson->id,
            'question_text' => 'What does Hello mean?',
            'question_type' => 'multiple_choice',
            'order_number' => 1,
        ]);

        $answer = new Answer();
        $answer->question_id = $question->id;
        $answer->answer_text = 'こんにちは';
        $answer->is_correct = true;
        $answer->save();

        $quizResult = new QuizResult();
        $quizResult->user_id = $user->id;
        $quizResult->lesson_id = $lesson->id;
        $quizResult->status = 'in_progress';
        $quizResult->total_questions = 1;
        $quizResult->save();

        // --------------------------------------
        // ① 回答保存のテスト
        // --------------------------------------
        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/quiz-results/{$quizResult->id}/answers", [
                'question_id' => $question->id,
                'answer_id' => $answer->id,
            ]);

        $response->assertStatus(201);
        $response->assertJsonPath('is_correct', true);

        $this->assertDatabaseHas('user_answers', [
            'user_id' => $user->id,
            'quiz_result_id' => $quizResult->id,
            'question_id' => $question->id,
            'answer_id' => $answer->id,
            'is_correct' => true,
        ]);
    }
    // ==========================================
    // 6. 未ログインユーザーはクイズを終了できない
    // ==========================================
    public function test_guest_cannot_finish_quiz(): void
    {
        $response = $this->postJson('/api/quiz-results/1/finish');

        $response->assertStatus(401);
    }

    // ==========================================
    // 7. 他人のクイズには回答できない
    // ==========================================
    public function test_cannot_answer_another_users_quiz(): void
    {
        // クイズの所有者
        $owner = User::factory()->create();

        // 別のユーザー
        $otherUser = User::factory()->create();

        // レッスンを作成
        $lesson = $this->createLesson();

        // 所有者のクイズを作成
        $quizResult = new QuizResult();
        $quizResult->user_id = $owner->id;
        $quizResult->lesson_id = $lesson->id;
        $quizResult->status = 'in_progress';
        $quizResult->total_questions = 1;
        $quizResult->save();

        // 他人のクイズへの回答を試みる
        $response = $this->actingAs($otherUser, 'sanctum')
            ->postJson("/api/quiz-results/{$quizResult->id}/answers", [
                'question_id' => 1,
                'answer_id' => 1,
            ]);

        // HTTP 403を確認
        $response->assertStatus(403);

        // 回答履歴が作成されていないことを確認
        $this->assertDatabaseCount('user_answers', 0);
    }

    // ==========================================
    // 共通処理：テスト用レッスンを作成
    // ==========================================
    private function createLesson(string $title = 'Hello'): Lesson
    {
        $course = Course::create([
            'title' => 'Daily English',
            'difficulty' => 'beginner',
        ]);

        $unit = Unit::create([
            'course_id' => $course->id,
            'title' => 'Greetings',
            'order_number' => 1,
        ]);

        $lesson = Lesson::create([
            'unit_id' => $unit->id,
            'title' => $title,
            'order_number' => 1,
        ]);

        return $lesson;
    }

    public function test_cannot_submit_duplicate_answer(): void
    {
        // ユーザーとレッスンを作成
        $user = User::factory()->create();
        $lesson = $this->createLesson();

        // 問題を作成
        $question = Question::create([
            'lesson_id' => $lesson->id,
            'question_text' => 'What does Hello mean?',
            'question_type' => 'multiple_choice',
            'order_number' => 1,
        ]);

        // 正解の選択肢を作成
        $answer = new Answer();
        $answer->question_id = $question->id;
        $answer->answer_text = 'こんにちは';
        $answer->is_correct = true;
        $answer->save();

        // 進行中のクイズを作成
        $quizResult = new QuizResult();
        $quizResult->user_id = $user->id;
        $quizResult->lesson_id = $lesson->id;
        $quizResult->status = 'in_progress';
        $quizResult->total_questions = 1;
        $quizResult->save();

        $url = "/api/quiz-results/{$quizResult->id}/answers";

        $payload = [
            'question_id' => $question->id,
            'answer_id' => $answer->id,
        ];

        // 1回目は保存できる
        $firstResponse = $this->actingAs($user, 'sanctum')
            ->postJson($url, $payload);

        $firstResponse->assertStatus(201);

        // 2回目は拒否される
        $secondResponse = $this->postJson($url, $payload);

        $secondResponse->assertStatus(409);

        // DBには回答履歴が1件だけ存在する
        $this->assertDatabaseCount('user_answers', 1);
    }

    public function test_finishing_quiz_calculates_score_and_awards_xp(): void
    {
        //ユーザーとレッスンを作成
        $user = User::factory()->create(['xp' => 0]);
        $lesson = $this->createLesson();

        //問題を作成
        $question = Question::create([
            'lesson_id' => $lesson->id,
            'question_text' => 'Whata does Hello mean?',
            'question_type' => 'multiple_choice',
            'order_number' => 1,
        ]);

        //正解の選択肢作成
        $answer = new Answer();
        $answer->question_id = $question->id;
        $answer->answer_text = 'こんにちは';
        $answer->is_correct = true;
        $answer->save();

        //クイズ開始
        $startResponse = $this->actingAs($user, 'sanctum')
            ->postJson("/api/lessons/{$lesson->id}/quiz/start");

        $quizResultId = $startResponse->json('quiz_result_id');


        //問題に回答
        $answerResponse = $this->postJson(
            "/api/quiz-results/{$quizResultId}/answers",
            [
                'question_id' => $question->id,
                'answer_id' => $answer->id,
            ]
        );

        $answerResponse->assertStatus(201);

        //クイズを終了
        $finishResponse = $this->postJson(
            "/api/quiz-results/{$quizResultId}/finish"
        );

        //APIレスポンスを検証
        $finishResponse->assertStatus(200);
        $finishResponse->assertJsonPath('quiz_result.score', 100);
        $finishResponse->assertJsonPath('quiz_result.xp_earned', 10);
        $finishResponse->assertJsonPath('quiz_result.status', 'completed');

        //DBのクイズ結果を検証
        $this->assertDatabaseHas('quiz_results', [
            'id' => $quizResultId,
            'correct_count' => 1,
            'wrong_count' => 0,
            'score' => 100,
            'xp_earned' => 10,
            'status' => 'completed',
        ]);

        //ユーザーの累計XPを検証
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'xp' => 10,
        ]);
    }

    public function test_cannot_finish_another_users_quiz(): void
    {
        //二人のユーザーを作成
        $owner = User::factory()->create(['xp' => 0]);
        $otherUser = User::factory()->create(['xp' => 0]);

        //レッスンを作成
        $lesson = $this->createLesson();

        //ユーザーAの進行中のクイズを作成
        $quizResult = new QuizResult();
        $quizResult->user_id = $owner->id;
        $quizResult->lesson_id = $lesson->id;
        $quizResult->status = 'in_progress';
        $quizResult->total_questions = 1;
        $quizResult->save();

        //ユーザーBがクイズを終了しようとすると
        $response = $this->actingAs($otherUser, 'sanctum')
            ->postJson("/api/quiz-results/{$quizResult->id}/finish");

        //操作権限がないので拒否
        $response->assertStatus(403);

        //クイズが進行中のままであることを確認
        $this->assertDatabaseHas('quiz_results', [
            'id' => $quizResult->id,
            'status' => 'in_progress',
        ]);

        //所有者のXPが変更されていないことを確認
        $this->assertDatabaseHas('users', [
            'id' => $owner->id,
            'xp' => 0,
        ]);
    }

    public function test_cannot_finish_completed_quiz_twice(): void
    {
        //10XPを持つユーザーを作成
        $user = User::factory()->create([
            'xp' => 10,
        ]);

        //テスト用レッスンを作成
        $lesson = $this->createLesson();

        //テスト済みレッスンを作成
        $quizResult = new QuizResult();

        $quizResult->user_id = $user->id;
        $quizResult->lesson_id = $lesson->id;
        $quizResult->status = 'completed';
        $quizResult->total_questions = 1;

        $quizResult->save();

        //完了済みのクイズ終了APIを実行
        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/quiz-results/{$quizResult->id}/finish");

        //HTTP 422を検証
        $response->assertStatus(422);

        //クイズの状態が変わっていないことを検証
        $this->assertDatabaseHas('quiz_results', [
            'id' => $quizResult->id,
            'status' => 'completed',
        ]);

        //ユーザーのXPが増えて意なことを検証
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'xp' => 10,
        ]);
    }

    public function test_retrying_same_lesson_does_not_award_xp_again(): void
    {
        // ① すでに10 XPを持つユーザー
        $user = User::factory()->create(['xp' => 10]);

        $lesson = $this->createLesson();

        // ② 問題を作成
        $question = Question::create([
            'lesson_id' => $lesson->id,
            'question_text' => 'What does Hello mean?',
            'question_type' => 'multiple_choice',
            'order_number' => 1,
        ]);

        // ③ 正解の選択肢を作成
        $answer = new Answer();
        $answer->question_id = $question->id;
        $answer->answer_text = 'こんにちは';
        $answer->is_correct = true;
        $answer->save();

        // ④ 過去にXPを獲得したクイズ結果を準備
        $previousQuiz = new QuizResult();
        $previousQuiz->user_id = $user->id;
        $previousQuiz->lesson_id = $lesson->id;
        $previousQuiz->status = 'completed';
        $previousQuiz->total_questions = 1;
        $previousQuiz->correct_count = 1;
        $previousQuiz->score = 100;
        $previousQuiz->xp_earned = 10;
        $previousQuiz->xp_awarded_at = now();
        $previousQuiz->save();

        // ⑤ 同じレッスンで新しいクイズを開始
        $startResponse = $this->actingAs($user, 'sanctum')
            ->postJson("/api/lessons/{$lesson->id}/quiz/start");

        $startResponse->assertStatus(201);

        $newQuizId = $startResponse->json('quiz_result_id');

        // ⑥ 新しいクイズに回答
        $answerResponse = $this->postJson(
            "/api/quiz-results/{$newQuizId}/answers",
            [
                'question_id' => $question->id,
                'answer_id' => $answer->id,
            ]
        );

        $answerResponse->assertStatus(201);

        // ⑦ 新しいクイズを終了
        $finishResponse = $this->postJson(
            "/api/quiz-results/{$newQuizId}/finish"
        );

        $finishResponse->assertStatus(200);

        // ⑧ 再挑戦でも100点
        $finishResponse->assertJsonPath('quiz_result.score', 100);

        // ⑨ XPは追加されない
        $finishResponse->assertJsonPath('quiz_result.xp_earned', 0);

        // ⑩ 累計XPも10のまま
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'xp' => 10,
        ]);
    }

    public function test_cannot_finish_quiz_with_unanswered_questions(): void
    {
        //ユーザーを作成
        $user = User::factory()->create([
            'xp' => 0,
        ]);

        //レッスンを作成
        $lesson = $this->createLesson();

        //問題を１問作成
        Question::create([
            'lesson_id' => $lesson->id,
            'question_text' => 'What does Hello mean?',
            'question_type' => 'multiple_choice',
            'order_number' => 1,
        ]);

        //クイズを開始
        $startResponse = $this->actingAs($user, 'sanctum')
            ->postJson("/api/lessons/{$lesson->id}/quiz/start");

        $startResponse->assertStatus(201);

        $quizResultId = $startResponse->json('quiz_result_id');

        //回答せずにクイズを終了せずに試みる
        $finishResponse = $this->postJson(
            "/api/quiz-results/{$quizResultId}/finish"
        );

        //クイズは進行中のまま
        $this->assertDatabaseHas('quiz_results', [
            'id' => $quizResultId,
            'status' => 'in_progress',
        ]);

        //xpも増えていない
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'xp' => 0,
        ]);
    }

    public function test_cannot_finish_partially_answered_quiz(): void
    {
        //ユーザーとレッスンを作成
        $user = User::factory()->create(['xp' => 0]);
        $lesson = $this->createLesson();

        //１問目
        $question1 = Question::create([
            'lesson_id' => $lesson->id,
            'question_text' => 'What does Hello mean?',
            'question_type' => 'multiple_choice',
            'order_number' => 1,
        ]);

        //２問目
        $question2 = Question::create([
            'lesson_id' => $lesson->id,
            'question_text' => 'What does Thank you mean?',
            'question_type' => 'multiple_choice',
            'order_number' => 2,
        ]);

        //１問目の正解を作成
        $answer = new Answer();
        $answer->question_id = $question1->id;
        $answer->answer_text = 'こんにちは';
        $answer->is_correct = true;
        $answer->save();

        //クイズを開始
        $startResponse = $this->actingAs($user, 'sanctum')
            ->postJson("/api/lessons/{$lesson->id}/quiz/start");

        $startResponse->assertStatus(201);

        $quizResultId = $startResponse->json('quiz_result_id');

        //１問目だけ回答
        $answerResponse = $this->postJson(
            "/api/quiz-results/{$quizResultId}/answers",
            [
                'question_id' => $question1->id,
                'answer_id' => $answer->id,
            ]
        );

        //２問目に回答せずに終了しようとする
        $finishResponse = $this->postJson(
            "/api/quiz-results/{$quizResultId}/finish"
        );

        //終了できないことを確認
        $finishResponse->assertStatus(422);

        //クイズは進行中のまま
        $this->assertDatabaseHas('quiz_results', [
            'id' => $quizResultId,
            'total_questions' => 2,
            'status' => 'in_progress',
        ]);

        //xpは付与されない
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'xp' => 0,
        ]);
    }

    public function test_cannot_submit_answer_from_another_question(): void
    {
        //ユーザーとレッスン
        $user = User::factory()->create();
        $lesson = $this->createLesson();

        //１問目
        $question1 = Question::create([
            'lesson_id' => $lesson->id,
            'question_text' => 'What does Hello mean?',
            'question_type' => 'multiple_choice',
            'order_number' => 1,
        ]);

        //２問目
        $question2 = Question::create([
            'lesson_id' => $lesson->id,
            'question_text' => 'What does Thank you mean?',
            'question_type' => 'multiple_choice',
            'order_number' => 2,
        ]);

        //２問目の正解を作成
        $answer = new Answer();
        $answer->question_id = $question2->id;
        $answer->answer_text = 'ありがとう';
        $answer->is_correct = true;
        $answer->save();

        //クイズ開始
        $startResponse = $this->actingAs($user, 'sanctum')
            ->postJson("/api/lessons/{$lesson->id}/quiz/start");

        $startResponse->assertStatus(201);
        $quizResultId = $startResponse->json('quiz_result_id');

        //問題１に対して、問題２の選択肢を送信
        $response = $this->postJson(
            "/api/quiz-results/{$quizResultId}/answers",
            [
                'question_id' => $question1->id,
                'answer_id' => $answer->id,
                ]
            );
        
        //不正な組み合わせなので拒否
        $response->assertStatus(404);

        //回答が保存されていないことを確認
        $this->assertDatabaseMissing('user_answers', [
            'quiz_result_id' => $quizResultId,
            'question_id' => $question1->id,
        ]);
    }
}
