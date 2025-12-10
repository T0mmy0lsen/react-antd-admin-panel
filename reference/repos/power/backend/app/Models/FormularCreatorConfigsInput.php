<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FormularCreatorConfigsInput extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'formular_creator_config_id',
        'configs_input_id',
        'value_id',
    ];

    protected $with = ['configsInput', 'value'];

    protected $appends = ['backendClass'];

    public function getBackendClassAttribute(): string
    {
        return 'FormularCreatorConfigsInput';
    }

    public function configsInput()
    {
        return $this->belongsTo(ConfigsInput::class, 'configs_input_id', 'id');
    }

    public function value()
    {
        return $this->belongsTo(Value::class, 'value_id', 'id');
    }
}
