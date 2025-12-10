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
        Schema::create('formular_creator_elements', function (Blueprint $table) {
            $table->id();
            $table->text('name');
            $table->text('description')->nullable();
            $table->text('class');
            $table->foreignId('class_id')->constrained('element_classes');
            $table->unsignedInteger('section');
            $table->unsignedInteger('group');
            $table->unsignedInteger('order');
            $table->foreignId('formular_creator_id')->constrained('formular_creators');
            $table->foreignId('parent_id')->nullable()->constrained('formular_creator_elements');
            $table->foreignId('value_set_id')->nullable()->constrained('value_sets');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formular_creator_elements');
    }
};
