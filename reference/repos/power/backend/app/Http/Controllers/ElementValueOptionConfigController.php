<?php

namespace App\Http\Controllers;

use App\Models\ElementValueOptionConfigs;
use Illuminate\Http\Request;

class ElementValueOptionConfigController extends Controller
{
    // Save the ElementValueOptionConfigs
    public function store(Request $request)
    {
        $this->validate($request, [
            'formular_creator_element_id' => 'required',
            'value_set_id' => 'required',
            'config_id' => 'required',
        ]);

        $elementValueOptionConfigs = new ElementValueOptionConfigs();
        $elementValueOptionConfigs->fill($request->all());
        $elementValueOptionConfigs->save();

        return response()->json($elementValueOptionConfigs);
    }
}
