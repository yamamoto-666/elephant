<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\QuizResult;
use App\Models\UserAnswer;
use Illuminate\Http\Request;


class QuizResultController extends Controller
{
    public function store(Request $request, Lesson $lesson)
    {
        $totalQuestions = $lesson->questions()->count();

        if($totalQuestions === 0) {
            return response()->json([
                'message' => 'This lesson has no question.',
            ], 422);
        }

        $quizResult = new QuizResult([
            'status' => 'in_progress',
            'total_questions' => $totalQuestions,
        ]);

        $quizResult->user()->associate($request->user());
        $quizResult->lesson()->associate($lesson);

        $quizResult->save();

        return response()->json([
            'message' => 'Quiz started successfully',
            'quiz_result_id' => $quizResult->id,
        ],201);
    }

    public function submitAnswer(Request $request, QuizResult $quizResult)
    {
        if($quizResult->user_id !== $request->user()->id) {
            abort(403, 'You cannot answer this quiz.');
        }

        if($quizResult->status !== 'in_progress') {
            abort(409, 'This quiz is not accepting answers.');
        }

        $validated = $request->validate([
            'question_id' => ['required', 'integer', 'exists:questions,id'],
            'answer_id' => ['required', 'integer', 'exists:answers,id'],
        ]);

        $question = $quizResult->lesson
            ->questions()
            ->whereKey($validated['question_id'])
            ->firstOrFail();

        $answer = $question->answers()
            ->whereKey($validated['answer_id'])
            ->firstOrFail();

        if($quizResult->userAnswers()
            ->where('question_id', $question->id)
            ->exists()) {
            abort(409, 'This question has already been answered.');
        }

        $isCorrect = (bool) $answer->is_correct;

        $userAnswer = new UserAnswer();

        $userAnswer->user()->associate($request->user());
        $userAnswer->quizResult()->associate($quizResult);
        $userAnswer->question()->associate($question);
        $userAnswer->answer()->associate($answer);

        $userAnswer->is_correct = $isCorrect;
        
        $userAnswer->save();

        return response()->json([
            'message' => 'Answer saved successfully',
            'is_correct' => $isCorrect,
        ], 201);
    }
}
