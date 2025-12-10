<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ElementFilterValue extends Model
{
    protected $fillable = [
        'target_element_id',
        'target_header_id',
        'filter_by_element_id',
        'filter_by_header_id',
    ];

    protected $appends = ['backendClass'];

    protected $with = ['targetHeader', 'filterByHeader'];

    public function getBackendClassAttribute(): string
    {
        return 'ElementFilterValue';
    }

    public function targetElement()
    {
        return $this->belongsTo(FormularCreatorElements::class, 'target_element_id');
    }

    public function targetHeader()
    {
        return $this->belongsTo(ValueSetsHeader::class, 'target_header_id');
    }

    public function filterByElement()
    {
        return $this->belongsTo(FormularCreatorElements::class, 'filter_by_element_id');
    }

    public function filterByHeader()
    {
        return $this->belongsTo(ValueSetsHeader::class, 'filter_by_header_id');
    }

    use HasFactory;
}
