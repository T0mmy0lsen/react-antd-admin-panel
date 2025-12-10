<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ElementActions extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'formular_creator_element_id',
        'formular_creator_id',
        'action_id',
        'action',
        'label',
    ];

    protected $appends = ['backendClass'];

    public function getBackendClassAttribute(): string
    {
        return 'ElementActions';
    }
}
