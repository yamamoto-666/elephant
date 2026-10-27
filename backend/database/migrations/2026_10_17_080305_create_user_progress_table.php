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
        Schema::create('user_progress', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')
            ->references('id')
            ->on('users')
            ->cascadeOnDelete();

            $table->unsignedBigInteger('lesson_id');
            $table->foreign('lesson_id')
            ->references('id')
            ->on('lessons')
            ->restrictOnDelete();

            $table->string('status', 30)->default('not_started');
            $table->integer('score')->default(0);

            $table->timestamp('completed_at')->nullable();
            $table->timestamp('first_cleared_at')->nullable();

            $table->timestamps();

            $table->unique(['user_id', 'lesson_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_progress');
    }
};
