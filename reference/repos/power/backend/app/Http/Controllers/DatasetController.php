<?php

namespace App\Http\Controllers;

use App\Models\Formular;
use App\Models\FormularCreator;
use App\Models\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DatasetController extends Controller
{
    public function formularsByDataist(Request $request): JsonResponse
    {
        $request->validate([
            'id' => ['required', 'int']
        ]);

        $dataist = Role::where('name', 'Dataist')->first();
        $formularCreator = FormularCreator::getOneWith($request->id, $dataist->id, []);
        $formularCreatorView = DB::select("select * from view_for_formular_creator_{$formularCreator->id}");

        return response()->json($formularCreatorView);
    }
}
