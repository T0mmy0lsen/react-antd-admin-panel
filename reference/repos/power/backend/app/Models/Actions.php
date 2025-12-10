<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Actions extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['action', 'name', 'description', 'class', 'class_id'];

    protected $appends = ['backendClass'];

    public function getBackendClassAttribute(): string
    {
        return 'Actions';
    }
}
