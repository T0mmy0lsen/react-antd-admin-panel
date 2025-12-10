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
        Schema::create('element_configs_inputs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('element_config_id')->constrained('element_configs');
            $table->foreignId('configs_input_id')->constrained('configs_inputs');
            $table->foreignId('filter_id')->nullable()->constrained('element_filter_values');
            $table->foreignId('value_id')->nullable()->constrained('values');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('element_configs_inputs');
    }
};
