<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ElementClass extends Model
{
    use HasFactory, SoftDeletes;

    protected $with = [];

    protected $fillable = ['class', 'value_set_able'];

    protected $appends = ['backendClass'];

    public function getBackendClassAttribute(): string
    {
        return 'ElementClass';
    }

    public function actions(): HasMany
    {
        return $this->hasMany(Actions::class, 'class_id', 'id');
    }

    public function configs(): HasMany
    {
        return $this->hasMany(Configs::class, 'class_id', 'id');
    }
}
