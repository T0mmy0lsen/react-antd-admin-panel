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
        Schema::create('formular_job_statuses', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('formular_id');
            $table->unsignedInteger('formular_creator_config_id');
            $table->unsignedInteger('config_id');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formular_job_statuses');
    }
};
