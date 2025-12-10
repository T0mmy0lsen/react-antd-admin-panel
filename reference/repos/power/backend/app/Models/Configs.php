<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Configs extends Model
{
    use HasFactory, SoftDeletes;

    public $value;

    protected $fillable = [
        'config',
        'name',
        'description',
        'class',                // The Element Class that uses the config
        'class_id',             // The Element Class that uses the config
    ];

    protected $casts = [
        'input_default' => 'array'
    ];

    protected $with = ['inputs'];

    protected $appends = ['backendClass'];

    public function getBackendClassAttribute(): string
    {
        return 'Configs';
    }

    public function inputs(): HasMany
    {
        return $this->hasMany(ConfigsInput::class, 'config_id', 'id');
    }
}
