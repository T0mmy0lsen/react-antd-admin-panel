<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ValueString extends Model
{
    protected $fillable = ['value_set_id', 'value'];
    protected $appends = ['backendClass'];

    use HasFactory, SoftDeletes;

    public function valueSet()
    {
        return $this->belongsTo(ValueSets::class, 'value_set_id', 'id');
    }

    public function getBackendClassAttribute()
    {
        return 'ValueString';
    }
}
