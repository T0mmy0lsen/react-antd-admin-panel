<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class FormularCreatorElements extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'class',
        'class_id',
        'section',
        'group',
        'order',
        'formular_creator_id',
        'parent_id',
        'value_set_id'
    ];

    protected $with = ['valueSet', 'elements', 'condition', 'configs', 'configsValueOption'];

    protected $appends = ['backendClass'];

    public function getBackendClassAttribute(): string
    {
        return 'FormularCreatorElements';
    }

    public function valueSet(): HasOne
    {
        return $this->hasOne(ValueSets::class, 'id', 'value_set_id');
    }

    public function elements(): HasMany
    {
        return $this->hasMany(FormularCreatorElements::class, 'parent_id', 'id');
    }

    public function condition(): HasMany
    {
        return $this->hasMany(ElementConditionValue::class, 'element_id_condition', 'id');
    }

    public function action(): HasOne
    {
        return $this->hasOne(ElementActions::class, 'formular_creator_element_id', 'id');
    }

    public function configs(): HasMany
    {
        return $this->hasMany(ElementConfigs::class, 'formular_creator_element_id', 'id');
    }

    public function configsValueOption(): HasMany
    {
        return $this->hasMany(ElementValueOptionConfigs::class, 'formular_creator_element_id', 'id');
    }

    public function access(): HasMany
    {
        return $this->hasMany(ElementAccess::class, 'formular_creator_element_id', 'id');
    }
}
