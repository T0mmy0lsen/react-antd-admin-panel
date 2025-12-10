<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ValueSets extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'description', 'type', 'system'];
    protected $with = ['headers'];

    protected $appends = ['collection', 'backendClass'];

    public function getBackendClassAttribute()
    {
        return 'ValueSets';
    }

    public function headers(): HasMany
    {
        return $this->hasMany(ValueSetsHeader::class, 'value_set_id', 'id');
    }

    public function getCollectionAttribute(): Collection
    {
        $valueOptions = $this->hasMany(ValueOption::class, 'value_set_id', 'id')->get();
        $valueBooleans = $this->hasMany(ValueBoolean::class, 'value_set_id', 'id')->get();

        return $valueOptions->concat($valueBooleans);
    }

    public function options(): HasMany
    {
        return $this->hasMany(ValueOption::class, 'value_set_id', 'id');
    }

    public function booleans(): HasMany
    {
        return $this->hasMany(ValueBoolean::class, 'value_set_id', 'id');
    }
}
