<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FormularJobStatus extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'formular_id',
        'formular_creator_config_id',
        'config_id',
    ];

    protected $appends = ['backendClass'];

    public function getBackendClassAttribute(): string
    {
        return 'FormularJobStatus';
    }
}
