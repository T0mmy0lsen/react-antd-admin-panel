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
        Schema::create('formular_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('formular_id')->constrained('formulars');
            $table->foreignId('formular_creator_id')->constrained('formular_creators');
            $table->foreignId('formular_creator_element_id')->constrained('formular_creator_elements');
            $table->foreignId('value_id')->constrained('values');
            // $table->foreignId('value_set_id')->constrained('value_sets');
            // $table->string('value_set_type');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formular_values');
    }
};
