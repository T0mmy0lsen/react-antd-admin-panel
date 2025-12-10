<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class ElementAccess extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'formular_creator_element_id',
        'formular_creator_id',
        'role_id',
        'area_id'
    ];

    protected $with = [
        'role',
        'area'
    ];

    protected $appends = ['backendClass'];

    public function getBackendClassAttribute(): string
    {
        return 'ElementAccess';
    }

    public function role(): HasOne
    {
        return $this->hasOne(Role::class, 'id', 'role_id');
    }

    public function area(): HasOne
    {
        return $this->hasOne(Area::class, 'id', 'area_id');
    }
}
