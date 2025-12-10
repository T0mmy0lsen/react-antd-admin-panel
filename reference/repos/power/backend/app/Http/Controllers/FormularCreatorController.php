<?php

namespace App\Http\Controllers;

use App\Models\FormularCreator;
use App\Models\ElementActions;
use App\Models\FormularCreatorElementCondition;
use App\Models\ElementConditionValue;
use App\Models\FormularCreatorElements;
use App\Models\FormularCreatorRoles;
use App\Models\FormularReader;
use App\Models\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class FormularCreatorController extends Controller
{
    public function formularCreator(Request $request): JsonResponse
    {
        $moderator = Role::where('name', 'Moderator')->first();
        $formularCreator = FormularCreator::getOneWith(
            $request->id,
            $moderator->id,
            ['elements', 'elements.valueSet', 'elements.valueSet.options']
        );

        return \response()->json($formularCreator);
    }

    public function formularCreatorCreate(Request $request): Response
    {
        $request->validate([
            'name' => ['required', 'string'],
            'description' => ['required', 'string']
        ]);

        // Check if the user has a 'Moderator' role in the specific area
        $moderator = Role::where('name', 'Moderator')->first();
        $hasModeratorRole = Auth::user()->roles()
            ->where('role_id', $moderator->id)
            ->exists();

        abort_if(!$hasModeratorRole, 403);

        $formularCreator = FormularCreator::create([
            'name' => $request->name,
            'description' => $request->description
        ]);

        $formularCreatorRole = FormularCreatorRoles::create([
            'formular_creator_id' => $formularCreator->id,
            'area_id' => $request->area_id,
            'role_id' => $moderator->id,
        ]);

        return response()->noContent();
    }

    public function formularCreatorConfig(Request $request)
    {
        $moderator = Role::where('name', 'Moderator')->first();
        $formularCreator = FormularCreator::getOneWith($request->formular_creator_id, $moderator->id, []);
        $keysToCheck = ['icon'];

        $config = $formularCreator->config;
        if (!$config) {
            $config = [];
        }

        foreach ($request->keys() as $key) {
            if (in_array($key, $keysToCheck)) $config[$key] = $request->$key;
        }

        $formularCreator->config = $config;
        $formularCreator->save();
    }
}
