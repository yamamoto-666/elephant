<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\QuestionResource;
use App\Models\Lesson;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;


class QuestionController extends Controller
{
    public function index(Lesson $lesson): AnonymousResourceCollection
    {
        $questions = $lesson->questions()
            ->with('answers')
            ->orderBy('order_number')
            ->get();

        return QuestionResource::collection($questions);
    }

    public function submitAnswer(Request $request, Question $question)
    {
        $validated = $request->validate([
            'answer_id' => [
                'required',
                'integer',
                'min:1',
                'exists:answers,id',
            ],
        ]);

        $answer = $question->answers()
            ->whereKey($validated['answer_id'])
            ->firstOrFail();

        $is_correct = (bool) $answer->is_correct;

        return response()->json([
            'question_id' => $question->id,
            'answer_id' => $answer,
            'is_correct' => $is_correct,
            'message' => 'Answer received successfully',
        ]);
    }
}
