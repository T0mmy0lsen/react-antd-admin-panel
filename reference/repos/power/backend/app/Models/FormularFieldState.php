<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;

class FormularFieldState extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'formular_id',
        'formular_creator_id',
        'formular_creator_element_id',
        'element_config_id' // formular_creator_element_config_id
    ];

    protected $with = ['stateValue'];

    protected $appends = ['backendClass'];

    public function getBackendClassAttribute(): string
    {
        return 'FormularFieldState';
    }

    private static function updateValue(Formular $formular, FormularCreatorElements $element, string|null $relatedConfig, string $valueConfig, int $valueId)
    {
        $elementConfig = $element->config?->filter(function ($config) use ($relatedConfig) {
            return $config->config->config == $relatedConfig;
        })->first();

        $formularFieldState = FormularFieldState::updateOrCreate([
            'formular_id' => $formular->id,
            'formular_creator_id' => $formular->formular_creator_id,
            'formular_creator_element_id' => $element->id,
            'element_config_id' => $elementConfig?->id,
        ]);

        $formularFieldState->updated_at = now();
        $formularFieldState->save();

        $configId = Configs::where('class', 'FormularFieldState')->where('config', $valueConfig)->first()->id;

        Value::where('id', function ($query) use ($formularFieldState, $configId) {
            $query->select('value_id')
                ->from('formular_field_state_values')
                ->where('formular_field_state_id', $formularFieldState->id)
                ->where('config_id', $configId);
        })->delete();

        FormularFieldStateValue::updateOrCreate([
            'formular_field_state_id' => $formularFieldState->id,
            'config_id' => $configId,
        ], [
            'value_id' => $valueId,
        ]);
    }

    public static function updateValueString(Formular $formular, $element, string|null $relatedConfig, string $valueConfig, string $value)
    {
        $id = Value::valueCreate([
            'value' => $value,
            'value_set_id' => ValueSets::where('type', 'String')->first()->id,
            'value_set_type' => 'String',
            'debug_value' => json_encode($value),
            'debug_description' => "FormularFieldState::{$valueConfig}",
        ])->id;

        Log::channel('debug')->debug('FormularFieldState::updateValueString', [
            'value' => $value,
            'valueConfig' => $valueConfig,
            'relatedConfig' => $relatedConfig,
        ]);

        self::updateValue($formular, $element, $relatedConfig, $valueConfig, $id);
    }

    public static function updateValueBoolean($formular, $element, string|null $relatedConfig, string $valueConfig, bool $value)
    {
        $id = Value::valueCreate([
            'value' => ValueBoolean::where('value', $value ? 1 : 0)->first()->id,
            'value_set_id' => ValueSets::where('type', 'Boolean')->first()->id,
            'value_set_type' => 'Boolean',
            'debug_value' => json_encode($value),
            'debug_description' => "FormularFieldState::{$relatedConfig}",
        ])->id;

        Log::channel('debug')->debug('FormularFieldState::updateValueBoolean', [
            'value' => $value,
            'valueConfig' => $valueConfig,
            'relatedConfig' => $relatedConfig,
        ]);

        self::updateValue($formular, $element, $relatedConfig, $valueConfig, $id);
    }

    public function stateValue()
    {
        return $this->hasMany(FormularFieldStateValue::class, 'formular_field_state_id', 'id');
    }
}
