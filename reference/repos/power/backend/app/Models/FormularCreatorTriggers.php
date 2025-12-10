<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class FormularCreatorTriggers extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'formular_creator_id_when',
        'formular_creator_id_then'
    ];

    protected $appends = ['backendClass'];

    public function getBackendClassAttribute(): string
    {
        return 'FormularCreatorTriggers';
    }

    public function formularThen(): HasOne
    {
        return $this->hasOne(FormularCreator::class, 'id', 'formular_creator_id_then');
    }

    public function formularWhen(): HasOne
    {
        return $this->hasOne(FormularCreator::class, 'id', 'formular_creator_id_when');
    }
}
