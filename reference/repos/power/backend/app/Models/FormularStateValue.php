<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class FormularStateValue extends Model
{
    use HasFactory, SoftDeletes;

    protected $with = ['config', 'value'];

    protected $fillable = [
        'formular_state_id',
        'config_id',
        'value_id'
    ];

    protected $appends = ['backendClass'];

    public function getBackendClassAttribute(): string
    {
        return 'FormularStateValue';
    }

    public function config(): HasOne
    {
        return $this->hasOne(Configs::class, 'id', 'config_id');
    }

    public function value(): HasOne
    {
        return $this->hasOne(Value::class, 'id', 'value_id');
    }
}
