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
        Schema::create('values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('value_set_id')->nullable()->constrained('value_sets');
            $table->foreignId('value_datetime_id')->nullable()->constrained('value_datetimes');
            $table->foreignId('value_option_id')->nullable()->constrained('value_options');
            $table->foreignId('value_text_id')->nullable()->constrained('value_strings');
            $table->foreignId('value_int_id')->nullable()->constrained('value_ints');
            $table->foreignId('value_boolean_id')->nullable()->constrained('value_booleans');
            $table->string('debug_value')->nullable();
            $table->string('debug_description')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('config_values');
    }
};
