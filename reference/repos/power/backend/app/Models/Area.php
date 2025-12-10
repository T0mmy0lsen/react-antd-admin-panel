<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Area extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'description', 'parent_area_id'];

    protected $appends = ['backendClass'];

    public function getBackendClassAttribute(): string
    {
        return 'Area';
    }
}
