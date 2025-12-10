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
        Schema::create('element_filter_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('target_element_id')->constrained('formular_creator_elements');
            $table->foreignId('target_header_id')->constrained('value_sets_headers');
            $table->foreignId('filter_by_element_id')->constrained('formular_creator_elements');
            $table->foreignId('filter_by_header_id')->constrained('value_sets_headers');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('element_filter_values');
    }
};
