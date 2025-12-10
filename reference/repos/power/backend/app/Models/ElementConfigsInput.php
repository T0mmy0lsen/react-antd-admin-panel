<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ElementConfigsInput extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'element_config_id',
        'configs_input_id',
        'filter_id',
        'value_id',
    ];

    protected $with = ['configsInput', 'filter', 'value'];

    protected $appends = ['backendClass'];

    public function getBackendClassAttribute(): string
    {
        return 'ElementConfigsInput';
    }

    public function filter()
    {
        return $this->belongsTo(ElementFilterValue::class, 'filter_id', 'id');
    }

    public function value()
    {
        return $this->belongsTo(Value::class, 'value_id', 'id');
    }

    public function configsInput()
    {
        return $this->belongsTo(ConfigsInput::class, 'configs_input_id', 'id');
    }
}
