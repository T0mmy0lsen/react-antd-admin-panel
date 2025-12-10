<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ValueOption extends Model
{
    protected $fillable = ['value_set_id', 'value', 'description'];
    protected $with = ['fields'];
    protected $appends = ['backendClass'];

    use HasFactory, SoftDeletes;

    public function getBackendClassAttribute()
    {
        return 'ValueOption';
    }

    public function fields(): HasMany
    {
        return $this->hasMany(ValueOptionFields::class);
    }
}
