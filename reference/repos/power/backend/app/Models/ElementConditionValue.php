<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ElementConditionValue extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'element_id_condition',
        'element_id_target',
        'value_option_id'
    ];

    protected $appends = ['backendClass'];

    public function getBackendClassAttribute(): string
    {
        return 'ElementConditionValue';
    }
}
