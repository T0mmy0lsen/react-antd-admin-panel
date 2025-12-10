<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ValueBoolean extends Model
{
    protected $fillable = ['value_set_id', 'value', 'description'];
    protected $appends = ['backendClass'];

    use HasFactory, SoftDeletes;

    public function getBackendClassAttribute()
    {
        return 'ValueBoolean';
    }
}
