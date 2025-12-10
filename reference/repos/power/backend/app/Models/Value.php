<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Value extends Model
{
    use HasFactory, SoftDeletes;

    protected $with = ['valueDatetime', 'valueOption', 'valueText', 'valueInt', 'valueBoolean'];
    protected $fillable = [
        'value_set_id',
        'value_boolean_id',
        'value_datetime_id',
        'value_option_id',
        'value_text_id',
        'value_int_id',
        'debug_value',
        'debug_description'
    ];

    protected $appends = ['backendClass'];

    public static function copy($value)
    {
        return self::create([
            'value_set_id' => $value->value_set_id,
            'value_boolean_id' => $value->value_boolean_id,
            'value_datetime_id' => $value->value_datetime_id,
            'value_option_id' => $value->value_option_id,
            'value_text_id' => $value->value_text_id,
            'value_int_id' => $value->value_int_id,
            'debug_value' => $value->debug_value,
            'debug_description' => $value->debug_description
        ]);
    }

    public function getBackendClassAttribute()
    {
        return 'Value';
    }

    public function getValue()
    {
        return match ($this->value_set_type) {
            'value_boolean_id' => $this->valueBoolean->value,
            'value_datetime_id' => $this->valueDatetime->value,
            'value_option_id' => $this->valueOption->value,
            'value_text_id' => $this->valueText->value,
            'value_int_id' => $this->valueInt->value,
            default => null,
        };
    }

    public function valueBoolean()
    {
        return $this->hasOne(ValueBoolean::class, 'id', 'value_boolean_id');
    }

    public function valueDatetime()
    {
        return $this->hasOne(ValueDatetime::class, 'id', 'value_datetime_id');
    }

    public function valueOption()
    {
        return $this->hasOne(ValueOption::class, 'id', 'value_option_id');
    }

    public function valueText()
    {
        return $this->hasOne(ValueString::class, 'id', 'value_text_id');
    }

    public function valueInt()
    {
        return $this->hasOne(ValueInt::class, 'id', 'value_int_id');
    }

    public static function valueCreate(array $data)
    {
        switch ($data['value_set_type']) {
            case 'Boolean':
                return self::create([
                    'value_set_id' => $data['value_set_id'],
                    'value_boolean_id' => $data['value'],
                    'debug_value' => $data['debug_value'] ?? null,
                    'debug_description' => $data['debug_description'] ?? null,
                ]);
            case 'Datetime':
                return self::create([
                    'value_set_id' => $data['value_set_id'],
                    'value_datetime_id' => ValueDatetime::create([
                        'value' => $data['value'],
                        'value_set_id' => $data['value_set_id'],
                    ])->id,
                    'debug_value' => $data['debug_value'] ?? null,
                    'debug_description' => $data['debug_description'] ?? null,
                ]);
            case 'Option':
                return self::create([
                    'value_set_id' => $data['value_set_id'],
                    'value_option_id' => $data['value'],
                    'debug_value' => $data['debug_value'] ?? null,
                    'debug_description' => $data['debug_description'] ?? null,
                ]);
            case 'String':
                return self::create([
                    'value_set_id' => $data['value_set_id'],
                    'value_text_id' => ValueString::create([
                        'value' => $data['value'],
                        'value_set_id' => $data['value_set_id'],
                    ])->id,
                    'debug_value' => $data['debug_value'] ?? null,
                    'debug_description' => $data['debug_description'] ?? null,
                ]);
            case 'Integer':
                return self::create([
                    'value_set_id' => $data['value_set_id'],
                    'value_int_id' => ValueInt::create([
                        'value' => $data['value'],
                        'value_set_id' => $data['value_set_id'],
                    ])->id,
                    'debug_value' => $data['debug_value'] ?? null,
                    'debug_description' => $data['debug_description'] ?? null,
                ]);
        }
    }

    public function valueUpdate($data)
    {
        switch ($data['value_set_type']) {
            case 'Boolean':
                return $this->update(['value_boolean_id' => $data['value']]);
            case 'Option':
                return $this->update(['value_option_id' => $data['value']]);
            case 'Datetime':
                return ValueDatetime::find($this->value_datetime_id)->update(['value' => $data['value']]);
            case 'String':
                return ValueString::find($this->value_text_id)->update(['value' => $data['value']]);
            case 'Integer':
                return ValueInt::find($this->value_int_id)->update(['value' => $data['value']]);
        }
        return null;
    }
}
