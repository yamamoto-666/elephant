<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\UnitController;
use App\Http\Controllers\Api\LessonController;
use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Api\QuizController;
use App\Http\Controllers\Api\ProgressController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\QuizResultController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{course}', [CourseController::class , 'show']);
Route::get('/courses/{course}/units', [UnitController::class, 'index']);
Route::get('/units/{unit}/lessons', [LessonController::class, 'index']);

Route::get('/lessons/{lesson}/questions', [QuestionController::class, 'index']);
Route::post('/questions/{question}/answer', [QuestionController::class, 'submitAnswer']);
Route::get('/progress', [ProgressController::class, 'index'])->middleware('auth:sanctum');
Route::get('/reviews/questions', [ReviewController::class, 'index'])->middleware('auth:sanctum');

//クイズ開始
Route::post('/lessons/{lesson}/quiz/start', [QuizResultController::class, 'store'])->middleware('auth:sanctum');

//回答保存
Route::post('/quiz-results/{quizResult}/answers', [QuizResultController::class, 'submitAnswer'])->middleware('auth:sanctum');

//クイズ終了
Route::post('/quiz-results/{quizResult}/finish', [QuizController::class, 'finish'])
    ->middleware('auth:sanctum');