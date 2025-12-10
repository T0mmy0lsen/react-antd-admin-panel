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
        Schema::create('element_configs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('formular_creator_element_id')->constrained('formular_creator_elements');
            $table->foreignId('config_id')->constrained('configs');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formular_creator_element_configs');
    }
};
