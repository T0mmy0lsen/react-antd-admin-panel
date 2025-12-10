<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Formular extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['user_id', 'formular_creator_id'];

    protected $appends = ['backendClass'];

    public function getBackendClassAttribute(): string
    {
        return 'Formular';
    }

    public function formularValues(): HasMany
    {
        return $this->hasMany(FormularValue::class, 'formular_id', 'id');
    }

    public function formularCreator(): HasOne
    {
        return $this->hasOne(FormularCreator::class, 'id', 'formular_creator_id');
    }

    public function triggers(): HasMany
    {
        return $this->hasMany(FormularTrigger::class, 'formular_id_when', 'id');
    }

    public function formularStates(): HasMany
    {
        return $this->hasMany(FormularState::class, 'formular_id', 'id');
    }
}
