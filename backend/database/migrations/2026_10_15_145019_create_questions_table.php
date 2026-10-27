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
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('lesson_id');
            $table->foreign('lesson_id')
            ->references('id')
            ->on('lessons')
            ->restrictOnDelete();
            $table->text('question_text');
            $table->string('question_type', 50);
            $table->text('explanation')->nullable();
            $table->integer('order_number');
            $table->timestamps();
            $table->unique(['lesson_id', 'order_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
