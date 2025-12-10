<?php

namespace App\Http\Controllers;

use App\Models\FormularCreator;
use App\Models\FormularCreatorRoles;
use App\Models\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FormularCreatorRolesController extends Controller
{
    public function formularCreatorsByModerator(): JsonResponse
    {
        $moderator = Role::where('name', 'Moderator')->first();
        $formularCreators = FormularCreator::getAllWith($moderator->id, []);

        return response()->json($formularCreators);
    }

    public function formularCreatorsByModeratorSearch(Request $request): JsonResponse
    {
        $reader = Role::where('name', 'Moderator')->first();
        $formularCreators = FormularCreator::getAllWithSearch($reader->id, [], $request->q);

        return response()->json($formularCreators);
    }

    public function formularCreatorsByDataist(): JsonResponse
    {
        $dataist = Role::where('name', 'Dataist')->first();
        $formularCreators = FormularCreator::getAllWith($dataist->id, []);

        return response()->json($formularCreators);
    }

    public function formularCreatorsByReader(): JsonResponse
    {
        $reader = Role::where('name', 'Reader')->first();
        $formularCreators = FormularCreator::getAllWith($reader->id, []);

        return response()->json($formularCreators);
    }

    public function formularCreatorsByReaderSearch(Request $request): JsonResponse
    {
        $reader = Role::where('name', 'Reader')->first();
        $formularCreators = FormularCreator::getAllWithSearch($reader->id, [], $request->q);

        return response()->json($formularCreators);
    }

    public function formularCreatorRolesCreate(Request $request): JsonResponse
    {
        $request->validate([
            'formular_creator_id' => ['required', 'int'],
            'area_id' => ['required', 'int'],
            'role_id' => ['required', 'int'],
        ]);

        $moderator = Role::where('name', 'Moderator')->first();
        FormularCreator::getOneWith($request->formular_creator_id, $moderator->id, []);

        FormularCreatorRoles::create([
            'formular_creator_id' => $request->formular_creator_id,
            'area_id' => $request->area_id,
            'role_id' => Role::where('id', $request->role_id)->first()->id,
        ]);

        return response()->json(true);
    }

    public function formularCreatorRoles(Request $request): JsonResponse
    {
        $request->validate(['id' => ['required', 'int']]);

        $moderator = Role::where('name', 'Moderator')->first();
        $formularCreator = FormularCreator::getOneWith($request->id, $moderator->id, ['formularRoles']);

        return response()->json($formularCreator->formularRoles);
    }
}
