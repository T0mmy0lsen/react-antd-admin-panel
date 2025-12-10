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
        Schema::create('formular_triggers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('formular_id_when')->constrained('formulars');
            $table->foreignId('formular_id_then')->constrained('formulars');
            $table->foreignId('formular_creator_trigger_id')->constrained('formular_triggers');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formular_triggers');
    }
};
