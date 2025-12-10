<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserRoles extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['user_id', 'area_id', 'role_id'];
    protected $with = ['area', 'role'];
    protected $appends = ['backendClass'];

    public function getBackendClassAttribute(): string
    {
        return 'UserRoles';
    }

    public function area(): HasOne
    {
        return $this->hasOne(Area::class, 'id', 'area_id');
    }

    public function role(): HasOne
    {
        return $this->hasOne(Role::class, 'id', 'role_id');
    }
}
