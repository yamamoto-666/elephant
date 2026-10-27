<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\UnitController;
use App\Http\Controllers\Api\LessonController;
use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Api\QuizController;
use App\Http\Controllers\Api\ProgressController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{course}', [CourseController::class , 'show']);
Route::get('/courses/{course}/units', [UnitController::class, 'index']);
Route::get('/units/{unit}/lessons', [LessonController::class, 'index']);
Route::get('/lessons/{lesson}/questions', [QuestionController::class, 'index']);
Route::post('/questions/{question}/answer', [QuestionController::class, 'submitAnswer']);
Route::post('/lessons/{lesson}/quiz/start', [QuizController::class, 'start'])
    ->middleware('auth:sanctum');
Route::post('/quiz-results/{quizResult}/answers', [QuizController::class, 'submitAnswer'])
    ->middleware('auth:sanctum');
Route::post('/quiz-results/{quizResult}/finish', [QuizController::class, 'finish'])
    ->middleware('auth:sanctum');
Route::get('/progress', [ProgressController::class, 'index'])->middleware('auth:sanctum');
