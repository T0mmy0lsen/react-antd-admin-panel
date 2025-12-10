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
        Schema::create('formular_creator_configs_inputs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('formular_creator_config_id');
            $table->unsignedBigInteger('configs_input_id');
            $table->unsignedBigInteger('value_id');
            $table->softDeletes();
            $table->timestamps();

            // Foreign key constraints with custom names
            $table->foreign('formular_creator_config_id', 'custom_fk_formular_creator_configs')
                ->references('id')->on('formular_creator_configs');

            $table->foreign('configs_input_id', 'custom_fk_configs_inputs')
                ->references('id')->on('configs_inputs');

            $table->foreign('value_id', 'custom_fk_values')
                ->references('id')->on('values');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formular_creator_configs_inputs');
    }
};
