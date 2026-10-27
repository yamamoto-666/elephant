<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\QuizResult;

class ProgressController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $completedQuizzes = QuizResult::where('user_id', $user->id)
            ->where('status', 'completed');

        $completedLessons = (clone $completedQuizzes)
            ->distinct()
            ->count('lesson_id');

        $averageScore = (clone $completedQuizzes)
            ->avg('score');

        return response()->json([
            'total_xp' => $user->xp,
            'level' => $user->level,
            'completed_lessons' => $completedLessons,
            'average_score' => round($averageScore ?? 0, 1),
        ]);
    }
}
