<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Lesson;
use App\Models\QuizResult;
use App\Models\Question;
use App\Models\UserAnswer;

class QuizController extends Controller
{
    // ==========================================
    // 1. クイズ開始 API
    // ==========================================
    public function start(Request $request, Lesson $lesson)
    {
        $totalQuestions = $lesson->questions()->count();

        if ($totalQuestions === 0) {
            return response()->json([
                'message' => 'No questions available.'
            ], 422);
        }

        $quizResult = new QuizResult();

        $quizResult->user_id = $request->user()->id;
        $quizResult->lesson_id = $lesson->id;
        $quizResult->status = 'in_progress';
        $quizResult->total_questions = $totalQuestions;

        $quizResult->save();

        return response()->json([
            'message' => 'Quiz started successfully.',
            'quiz_result' => $quizResult,
        ], 201);
    }

    // ==========================================
    // 2. クイズ回答 API
    // ==========================================
    public function submitAnswer(Request $request, QuizResult $quizResult)
    {
        // クイズの所有者を確認
        if ($quizResult->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Forbidden.'
            ], 403);
        }

        // クイズが進行中か確認
        if ($quizResult->status !== 'in_progress') {
            return response()->json([
                'message' => 'Quiz is not in progress.'
            ], 422);
        }

        // リクエストの入力値を検証
        $validated = $request->validate([
            'question_id' => ['required', 'integer', 'exists:questions,id'],
            'answer_id' => ['required', 'integer', 'exists:answers,id'],
        ]);

        // 問題が対象レッスンに属しているか確認
        $question = Question::where('lesson_id', $quizResult->lesson_id)
            ->findOrFail($validated['question_id']);

        // 回答が対象の問題に属しているか確認
        $answer = $question->answers()
            ->whereKey($validated['answer_id'])
            ->firstOrFail();

        // 同じ問題への重複回答を防ぐ
        if ($quizResult->userAnswers()
            ->where('question_id', $question->id)
            ->exists()
        ) {
            return response()->json([
                'message' => 'Question already answered.'
            ], 409);
        }

        // 回答履歴を保存
        $userAnswer = new UserAnswer();

        $userAnswer->user_id = $request->user()->id;
        $userAnswer->quiz_result_id = $quizResult->id;
        $userAnswer->question_id = $question->id;
        $userAnswer->answer_id = $answer->id;
        $userAnswer->is_correct = (bool) $answer->is_correct;

        $userAnswer->save();

        return response()->json([
            'message' => 'Answer saved successfully.',
            'is_correct' => $userAnswer->is_correct,
            'user_answer_id' => $userAnswer->id,
        ], 201);
    }

    // ==========================================
    // 3. クイズ終了・採点・XP付与 API
    // ==========================================
    public function finish(Request $request, QuizResult $quizResult)
    {
        // 複数のDB更新をまとめて処理
        return DB::transaction(function () use ($request, $quizResult) {

            // ユーザーをロックしてXPの同時更新を制御
            $user = User::whereKey($request->user()->id)
                ->lockForUpdate()
                ->firstOrFail();

            // クイズ結果をロック
            $quizResult = QuizResult::whereKey($quizResult->id)
                ->lockForUpdate()
                ->firstOrFail();

            // クイズの所有者を確認
            if ($quizResult->user_id !== $user->id) {
                return response()->json([
                    'message' => 'Forbidden.'
                ], 403);
            }

            // クイズが進行中か確認
            if ($quizResult->status !== 'in_progress') {
                return response()->json([
                    'message' => 'Quiz is not in progress.'
                ], 422);
            }

            // 回答済み問題数を取得
            $answeredCount = $quizResult->userAnswers()->count();

            // 全問題に回答しているか確認
            if ($answeredCount !== $quizResult->total_questions) {
                return response()->json([
                    'message' => 'Please answer all questions before finishing.'
                ], 422);
            }

            // 正解数を取得
            $correctCount = $quizResult->userAnswers()
                ->where('is_correct', true)
                ->count();

            // 不正解数を計算
            $wrongCount = $answeredCount - $correctCount;

            // スコアを100点満点で計算
            $score = (int) round(
                ($correctCount / $quizResult->total_questions) * 100
            );

            // 同じレッスンでXPを付与済みか確認
            $previouslyAwarded = QuizResult::where('user_id', $quizResult->user_id)
                ->where('lesson_id', $quizResult->lesson_id)
                ->whereNotNull('xp_awarded_at')
                ->exists();

            // 正解1問につき10XP（初回付与のみ）
            $earnedXp = $previouslyAwarded ? 0 : $correctCount * 10;

            // クイズ結果を更新
            $quizResult->correct_count = $correctCount;
            $quizResult->wrong_count = $wrongCount;
            $quizResult->score = $score;
            $quizResult->status = 'completed';
            $quizResult->completed_at = now();
            $quizResult->xp_earned = $earnedXp;

            // XPが獲得できた場合のみ加算
            if ($earnedXp > 0) {
                $user->increment('xp', $earnedXp);

                $quizResult->xp_awarded_at = now();
            }

            // クイズ結果をDBに保存
            $quizResult->save();

            return response()->json([
                'message' => 'Quiz completed successfully.',
                'quiz_result' => $quizResult,
            ], 200);
        });
    }
}