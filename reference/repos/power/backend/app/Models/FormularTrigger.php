<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class FormularTrigger extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'formular_creator_trigger_id',
        'formular_id_when',
        'formular_id_then'
    ];

    protected $appends = ['backendClass'];

    public function getBackendClassAttribute(): string
    {
        return 'FormularTrigger';
    }

    public function triggerCreator(): HasOne
    {
        return $this->hasOne(FormularCreatorTriggers::class, 'id', 'formular_creator_trigger_id');
    }
}
