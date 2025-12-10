<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class FormularCreatorConfigs extends Model
{
    use HasFactory, SoftDeletes;

    protected $with = ['config', 'inputs'];

    protected $fillable = [
        'formular_creator_id',
        'config_id',
    ];

    protected $appends = ['backendClass'];

    public function getBackendClassAttribute(): string
    {
        return 'FormularCreatorConfigs';
    }

    public function config(): HasOne
    {
        return $this->hasOne(Configs::class, 'id', 'config_id');
    }

    public function inputs(): HasMany
    {
        return $this->hasMany(FormularCreatorConfigsInput::class, 'formular_creator_config_id', 'id');
    }
}
