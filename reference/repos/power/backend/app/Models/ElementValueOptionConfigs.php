<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ElementValueOptionConfigs extends Model
{
    use HasFactory;

    protected $fillable = [
        'formular_creator_element_id',
        'value_set_id',
        'config_id',
    ];

    protected $with = ['config', 'valueSet', 'inputs'];

    public function config()
    {
        return $this->hasOne(Configs::class, 'id', 'config_id');
    }

    public function valueSet(): HasOne
    {
        return $this->hasOne(ValueSets::class, 'id', 'value_set_id');
    }

    public function inputs()
    {
        return $this->hasMany(ElementConfigsInput::class, 'element_value_option_config_id', 'id');
    }
}
