<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserAnswer;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $wrongAnswers = UserAnswer::query()
            ->where('is_correct', false)
            ->whereHas('quizResult', function ($query) use ($user) {
                $query->where('user_id', $user->id)
                ->where('status', 'completed');
            })
            ->with('question')
            ->latest()
            ->get()
            ->unique('question_id')
            ->values();
        
        return response()->json([
                'wrong_answers' => $wrongAnswers,
        ]);
    }
}
