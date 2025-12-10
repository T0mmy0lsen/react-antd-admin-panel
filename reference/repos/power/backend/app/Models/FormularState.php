<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;

class FormularState extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'formular_id',
        'formular_creator_id',
        'formular_creator_config_id'
    ];

    protected $with = ['stateValue'];

    protected $appends = ['backendClass'];

    public function getBackendClassAttribute(): string
    {
        return 'FormularState';
    }

    private static function updateValue(Formular $formular , string|null $relatedConfig, string $valueConfig, int $valueId)
    {
        $formularState = FormularState::firstOrCreate([
            'formular_id' => $formular->id,
            'formular_creator_id' => $formular->formular_creator_id,
            'formular_creator_config_id' => FormularCreatorConfigs::whereHas('config', function ($query) use ($relatedConfig) {
                $query->where('config', $relatedConfig);
            })->first()?->id,
        ]);

        $formularState->updated_at = now();
        $formularState->save();

        $configId = Configs::where('class', 'FormularState')->where('config', $valueConfig)->first()->id;

        Value::where('id', function ($query) use ($formularState, $configId) {
            $query->select('value_id')
                ->from('formular_state_values')
                ->where('formular_state_id', $formularState->id)
                ->where('config_id', $configId);
        })->delete();

        FormularStateValue::updateOrCreate([
            'formular_state_id' => $formularState->id,
            'config_id' => $configId,
        ], [
            'value_id' => $valueId,
        ]);
    }

    public static function updateValueString(Formular $formular, string|null $relatedConfig, string $valueConfig, string $value)
    {
        $id = Value::valueCreate([
            'value' => $value,
            'value_set_id' => ValueSets::where('type', 'String')->first()->id,
            'value_set_type' => 'String',
            'debug_value' => json_encode($value),
            'debug_description' => "FormularState::{$relatedConfig}:{$valueConfig}",
        ])->id;

        Log::channel('debug')->debug('FormularState::updateValueString', [
            'value' => $value,
            'valueConfig' => $valueConfig,
            'relatedConfig' => $relatedConfig,
        ]);

        self::updateValue($formular, $relatedConfig, $valueConfig, $id);
    }

    public static function updateValueBoolean($formular, string|null $relatedConfig, string $valueConfig, bool $value)
    {
        $id = Value::valueCreate([
            'value' => ValueBoolean::where('value', $value ? 1 : 0)->first()->id,
            'value_set_id' => ValueSets::where('type', 'Boolean')->first()->id,
            'value_set_type' => 'Boolean',
            'debug_value' => json_encode($value),
            'debug_description' => "FormularState::{$relatedConfig}:{$valueConfig}",
        ])->id;

        Log::channel('debug')->debug('FormularState::updateValueBoolean', [
            'value' => $value,
            'valueConfig' => $valueConfig,
            'relatedConfig' => $relatedConfig,
        ]);

        self::updateValue($formular, $valueConfig, $relatedConfig, $id);
    }

    public function stateValue()
    {
        return $this->hasMany(FormularStateValue::class, 'formular_state_id', 'id');
    }
}
