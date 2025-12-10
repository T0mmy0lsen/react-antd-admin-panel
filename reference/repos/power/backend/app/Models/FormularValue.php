<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class FormularValue extends Model
{
    use HasFactory, SoftDeletes;

    protected $with = ['element', 'value'];
    protected $fillable = [
        'formular_id',
        'formular_creator_id',
        'formular_creator_element_id',
        'value_id'
    ];

    protected $appends = ['backendClass'];

    public function getBackendClassAttribute(): string
    {
        return 'FormularValue';
    }

    public function formular(): HasOne
    {
        return $this->hasOne(Formular::class, 'id', 'formular_id');
    }

    public function value(): HasOne
    {
        return $this->hasOne(Value::class, 'id', 'value_id');
    }

    public function element(): HasOne
    {
        return $this->hasOne(FormularCreatorElements::class, 'id', 'formular_creator_element_id');
    }
}
