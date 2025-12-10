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
        Schema::create('configs_inputs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('config_id')->constrained('configs');
            $table->foreignId('input_value_id')->nullable()->constrained('values');
            $table->foreignId('input_class_id')->nullable()->constrained('element_classes');
            $table->foreignId('input_value_set_id')->nullable()->constrained('value_sets');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('configs_inputs');
    }
};
