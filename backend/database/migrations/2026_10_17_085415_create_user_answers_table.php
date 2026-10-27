<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_answers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('quiz_result_id');
            $table->unsignedBigInteger('question_id');
            $table->unsignedBigInteger('answer_id');
            $table->boolean('is_correct');
            $table->timestamp('answered_at')->useCurrent();
            $table->timestamps();

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->cascadeOnDelete();

            $table->foreign('question_id')
                ->references('id')
                ->on('questions')
                ->restrictOnDelete();

            $table->foreign(['quiz_result_id', 'user_id'])
                ->references(['id', 'user_id'])
                ->on('quiz_results')
                ->cascadeOnDelete();

            $table->foreign(['answer_id', 'question_id'])
                ->references(['id', 'question_id'])
                ->on('answers')
                ->restrictOnDelete();

            $table->unique(['quiz_result_id', 'question_id']);
            $table->index(['quiz_result_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_answers');
    }
};
