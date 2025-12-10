<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\Feature;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AreaController extends Controller
{
    public function areas(): JsonResponse
    {
        return \response()->json(Area::all());
    }

    public function areaSearch(Request $request)
    {
        return \response()->json(Area::where('name', 'LIKE', '%' . $request->q . '%')->get());
    }

    public function areaCreate(Request $request): Response
    {

        $request->validate([
            'name' => ['required', 'string'],
            'description' => ['required', 'string'],
            'identifier' => ['required', 'string'],
        ]);

        abort_if(!$request->area_is_root && !$request->parent, 500, "Either the Area has no Parent (and should root) or a Parent should be given.");

        // If the area_is_root checkbox is not touched, the field is not
        // in the Request. If it is, the value is in index = 0.
        $parent = $request->area_is_root && $request->area_is_root[0] ? 0 : $request->parent;

        $area = Area::create([
            'name' => $request->name,
            'description' => $request->description,
            'identifier' => $request->identifier,
            'parent' => $parent,
        ]);

        return response()->noContent();
    }
}
