<?php

namespace App\Http\Controllers;

use App\Models\Configs;
use App\Models\ElementClass;
use App\Models\ElementConfigs;
use App\Models\ElementConfigsInput;
use App\Models\ElementFilterValue;
use App\Models\FormularCreatorConfigs;
use App\Models\FormularCreatorElements;
use App\Models\Value;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ConfigsController extends Controller
{
    public function configs()
    {
        return response()->json(ElementClass::with('configs')->all());
    }

    public function configsForElementsSave(Request $request)
    {
        // First, validate common fields that are always required
        $request->validate([
            '*.config_id' => 'required|integer',
            '*.config_input_id' => 'required|integer',
            '*.formular_creator_element_id' => 'required|integer',
            // Add any other general validations here
        ]);

        foreach ($request->all() as $key => $config) {
            $configs = Configs::where('id', $config['config_id'])->firstOrFail();

            // Assuming $configs->config contains the type of config to determine the action
            switch ($configs->config) {
                case 'filterByOtherInput':
                    // Validate fields specific to 'filterByOtherInput'
                    Validator::make($config, [
                        'filter_by_header_id' => 'required|integer',
                        'filter_by_element_id' => 'required|integer',
                        'target_header_id' => 'required|integer',
                        'target_element_id' => 'required|integer',
                    ])->validate();
                    $value = ElementFilterValue::updateOrCreate([
                        'target_element_id' => $config['target_element_id'],
                    ], [
                        'target_header_id' => $config['target_header_id'],
                        'filter_by_element_id' => $config['filter_by_element_id'],
                        'filter_by_header_id' => $config['filter_by_header_id'],
                    ]);
                    $elementConfig = ElementConfigs::firstOrCreate([
                        'formular_creator_element_id' => $config['formular_creator_element_id'],
                        'config_id' => $config['config_id'],
                    ]);
                    ElementConfigsInput::updateOrCreate([
                        'element_config_id' => $elementConfig->id,
                        'configs_input_id' => $config['config_input_id'],
                    ], [
                        'filter_id' => $value->id,
                    ]);
                    break;
                default:
                    // For the default case, you might want to validate the entire array upfront,
                    // or ensure the validation rules are correctly applied for each item.
                    Validator::make($config, [
                        'value' => 'required',
                        'value_set_type' => 'required|string',
                        'value_set_id' => 'required|integer',
                        'formular_creator_element_id' => 'required|integer',
                    ])->validate();
                    $value = $this->saveConfig($config);
                    $elementConfig = ElementConfigs::firstOrCreate([
                        'formular_creator_element_id' => $config['formular_creator_element_id'],
                        'config_id' => $config['config_id'],
                    ]);
                    ElementConfigsInput::updateOrCreate([
                        'element_config_id' => $elementConfig->id,
                        'configs_input_id' => $config['config_input_id'],
                    ], [
                        'value_id' => $value->id,
                    ]);
                    break;
            }
        }
    }

    public function configsForElements(Request $request)
    {
        // Fetch the FormularElement and its Config
        $formularElements = FormularCreatorElements::with('configs')->where('id', $request->id)->first();

        // Ensure configs is a collection
        $configsCollection = collect($formularElements->configs);

        // Keying formularConfigs by config_id
        $formularConfigs = $configsCollection->keyBy('config_id')->toArray();

        // Fetch the FormularClass with its Configs
        $classConfigs = Configs::with('inputs')->where('class', $request->class)->get();

        // Update each class config with the value from the corresponding formular config
        foreach ($classConfigs as $classConfig) {
            if (isset($formularConfigs[$classConfig->id])) {
                $classConfig['related_config'] = $formularConfigs[$classConfig->id];
                // Append FormularCreatorConfigsInput to ConfigsInput based on config_input_id
                foreach ($classConfig['inputs'] as &$input) {
                    foreach ($formularConfigs[$classConfig->id]['inputs'] as $formularInput) {
                        if ($input['id'] == $formularInput['configs_input_id']) {
                            $input['related_input'] = $formularInput;
                        }
                    }
                }
            }
        }

        return response()->json($classConfigs);
    }

    private function saveConfig($config)
    {
        if (isset($config['value_id'])) {
            $configValue = Value::where('id', $config['value_id'])->first();
            $configValue->valueUpdate($config);
        } else {
            $configValue = Value::valueCreate([
                'value' => $config['value'],
                'value_set_type' => $config['value_set_type'],
                'value_set_id' => $config['value_set_id'],
            ]);
        }

        return $configValue;
    }
}
