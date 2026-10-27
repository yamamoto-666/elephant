<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\LessonResource;
use App\Models\Unit;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class LessonController extends Controller
{
    public function index(Unit $unit): AnonymousResourceCollection
    {
        $lessons = $unit->lessons;

        return LessonResource::Collection($lessons);
    }
}
