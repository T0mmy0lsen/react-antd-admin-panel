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
        Schema::create('element_condition_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('element_id_condition')->constrained('formular_creator_elements');
            $table->foreignId('element_id_target')->constrained('formular_creator_elements');
            $table->foreignId('value_option_id')->constrained('value_options');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formular_creator_element_condition_values');
    }
};
