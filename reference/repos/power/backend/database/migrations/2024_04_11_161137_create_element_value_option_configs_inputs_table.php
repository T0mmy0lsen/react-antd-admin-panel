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
        Schema::create('element_value_option_configs_inputs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('element_value_option_config_id')->nullable();
            $table->foreignId('configs_input_id')->nullable();
            $table->foreignId('value_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('element_value_option_configs_inputs');
    }
};
