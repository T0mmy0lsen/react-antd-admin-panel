<?php

namespace App\Http\Controllers;

use App\Models\Configs;
use App\Models\FormularCreator;
use App\Models\FormularCreatorConfigs;
use App\Models\FormularCreatorConfigsInput;
use App\Models\Value;
use Illuminate\Http\Request;

class FormularCreatorConfigsController extends Controller
{
    public function configs()
    {
        return response()->json(Configs::where('class', 'FormularCreator')->get());
    }

    public function configsForFormularCreatorSave(Request $request)
    {
        $request->validate([
            '*.value' => 'required',
            // '*.value_id' => 'optional',
            '*.value_set_type' => 'required',
            '*.value_set_id' => 'required',
            '*.config_id' => 'required',
            '*.formular_creator_id' => 'required',
        ]);

        foreach ($request->all() as $config) {
            if (isset($config['value_id'])) {
                $configValue = Value::where('id', $config['value_id'])->first();
                $configValue->valueUpdate($config);
            } else {
                $configValue = Value::valueCreate([
                    'value' => $config['value'],
                    'value_set_type' => $config['value_set_type'],
                    'value_set_id' => $config['value_set_id'],
                ]);
                $formularCreatorConfig = FormularCreatorConfigs::firstOrCreate([
                    'formular_creator_id' => $config['formular_creator_id'],
                    'config_id' => $config['config_id'],
                ]);
                FormularCreatorConfigsInput::updateOrCreate([
                    'formular_creator_config_id' => $formularCreatorConfig->id,
                    'configs_input_id' => $config['config_input_id'],
                ], [
                    'value_id' => $configValue->id,
                ]);
            }
        }
    }

    public function configsForFormularCreator(Request $request)
    {
        // Fetch the FormularElement and its Config
        $formularElements = FormularCreator::with(['configs', 'configs.inputs'])->where('id', $request->id)->first();

        // Ensure configs is a collection
        $configsCollection = collect($formularElements->configs);

        // Keying formularConfigs by config_id
        $formularConfigs = $configsCollection->keyBy('config_id')->toArray();

        // Fetch the FormularClass with its Configs and ConfigsInput
        $classConfigs = Configs::with('inputs')->where('class', 'FormularCreator')->get();

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
}
