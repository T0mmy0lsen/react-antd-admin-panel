<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class ConfigsInput extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'config_id',
        'input_value_id',
        'input_class_id',
        'input_value_set_id',
    ];

    protected $with = ['inputValueSet', 'inputClass', 'inputValue'];

    protected $appends = ['backendClass'];

    public function getBackendClassAttribute(): string
    {
        return 'ConfigsInput';
    }

    public function config(): HasOne
    {
        return $this->hasOne(Configs::class, 'id', 'config_id');
    }

    public function inputValueSet(): HasOne
    {
        return $this->hasOne(ValueSets::class, 'id', 'input_value_set_id');
    }

    public function inputClass(): HasOne
    {
        return $this->hasOne(ElementClass::class, 'id', 'input_class_id');
    }

    public function inputValue(): HasOne
    {
        return $this->hasOne(Value::class, 'id', 'input_value_id');
    }
}
