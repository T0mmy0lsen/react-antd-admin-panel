<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ElementValueOptionConfigsInput extends Model
{
    use HasFactory;

    protected $fillable = [
        'element_value_option_config_id',
        'configs_input_id',
        'value_id',
    ];
}
