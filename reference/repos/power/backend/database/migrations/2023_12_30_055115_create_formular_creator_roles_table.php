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
        Schema::create('formular_creator_roles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('formular_creator_id')->constrained('formular_creators');
            $table->foreignId('role_id')->constrained('roles');
            $table->foreignId('area_id')->constrained('areas');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formular_roles');
    }
};
