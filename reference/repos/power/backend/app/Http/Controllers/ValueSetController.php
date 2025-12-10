<?php

namespace App\Http\Controllers;

use App\Models\FormularCreatorElements;
use App\Models\User;
use App\Models\Value;
use App\Models\ValueOption;
use App\Models\ValueSets;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ValueSetController extends Controller
{
    public function valueSets(): JsonResponse
    {
        return \response()->json(ValueSets::all());
    }

    public function valueSetHeaders(Request $request): JsonResponse
    {
        return \response()->json(ValueSets::where('id', $request->value_set_id)->first()->headers);
    }

    public function valueSetHeaderCreate(Request $request): Response
    {
        $request->validate([
            'value_set_id' => ['required', 'int'],
            'key' => ['required', 'string'],
            'value' => ['required', 'string'],
        ]);

        $valueSet = ValueSets::where('id', $request->value_set_id)->firstOrFail();
        $valueSet->headers()->create([
            'key' => $request->key,
            'value' => $request->value,
        ]);

        return response()->noContent();
    }

    public function values(Request $request)
    {
        if ($request->has('formular_creator_element_id')) {
            return \response()->json(FormularCreatorElements::where('id', $request->formular_creator_element_id)->first()->valueSet->collection);
        }
        return \response()->json(Value::where('value_set_id', $request->value_set_id)->get());
    }

    public function valueOptions(Request $request)
    {
        return \response()->json(ValueOption::where('value_set_id', $request->value_set_id)->get());
    }

    public function valuesByQuery(Request $request)
    {
        $query = $request->q;
        $valueSetId = $request->value_set_id;

        return ValueOption::where('value_set_id', $valueSetId)
            ->where(function($q) use ($query) {
                $q->where('value', 'LIKE', "%{$query}%");
            })
            ->get();
    }

    public function valueSetCreate(Request $request): Response {

        $request->validate([
            'name' => ['required', 'string'],
            'description' => ['required', 'string'],
        ]);

        if ($request->has('config') && isset($request->config['headers'])) {
            $headers = $request->config['headers'];
        } else {
            $headers = [];
        }

        if (!in_array('Label', $headers)) $headers[] = 'Label';

        $result = array_map(function($value) {
            return ['key' => str_replace(" ", "-", strtolower($value)), 'value' => $value];
        }, $headers);

        $valueSet = ValueSets::create([
            'name' => $request->name,
            'config' => $result,
            'description' => $request->description,
            'system' => false,
        ]);

        return response()->noContent();
    }

    public function valueCreate(Request $request): Response {

        $request->validate([
            'value_set_id' => ['required', 'int'],
            'values' => ['required', 'array'],
        ]);

        $values = collect($request->values)->keyBy('key');
        $labelValue = $values->has('label') ? $values->get('label')['value'] : null;

        $valueOption = ValueOption::create([
            'value_set_id' => $request->value_set_id,
            'value' => $labelValue,
        ]);

        // Add all values as fields
        foreach ($values as $key => $value) {
            $valueOption->fields()->create([
                'key' => $key,
                'value' => $value['value'],
            ]);
        }

        return response()->noContent();
    }
}
