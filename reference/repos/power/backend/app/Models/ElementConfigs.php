<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class ElementConfigs extends Model
{
    use HasFactory, SoftDeletes;

    protected $with = ['config', 'inputs'];

    protected $fillable = [
        'formular_creator_element_id',
        'config_id',
    ];

    public function config(): HasOne
    {
        return $this->hasOne(Configs::class, 'id', 'config_id');
    }

    public function inputs(): HasMany
    {
        return $this->hasMany(ElementConfigsInput::class, 'element_config_id', 'id');
    }
}
