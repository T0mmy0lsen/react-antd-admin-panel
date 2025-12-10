<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ValueOptionFields extends Model
{
    protected $fillable = ['value_option_id', 'key', 'value'];

    use HasFactory, SoftDeletes;

    protected $appends = ['backendClass'];

    public function getBackendClassAttribute()
    {
        return 'ValueOptionFields';
    }
}
