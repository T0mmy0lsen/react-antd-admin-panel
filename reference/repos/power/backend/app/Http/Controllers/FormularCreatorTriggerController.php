<?php

namespace App\Http\Controllers;

use App\Models\FormularCreator;
use App\Models\FormularCreatorTriggers;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FormularCreatorTriggerController extends Controller
{
    /**
     *  Triggers are added to formulars to automatically create chaining formulars on creation.
     *  This is to ensure that a chain of formulars are filled.
     *
     *  The formulars are created in the FormularController.
     */

    public function formularCreatorTriggerCreate(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string'],
            'description' => ['required', 'string'],
            'formular_creator_id_when' => ['required', 'int'],
            'formular_creator_id_then' => ['required', 'int']
        ]);

        $moderator = Role::where('name', 'Moderator')->first()->id;

        FormularCreator::getOneWith($request->formular_creator_id_when, $moderator, []);
        FormularCreator::getOneWith($request->formular_creator_id_then, $moderator, []);

        $formularCreatorTrigger = FormularCreatorTriggers::create([
            'name' => $request->name,
            'description' => $request->description,
            'formular_creator_id_when' => $request->formular_creator_id_when,
            'formular_creator_id_then' => $request->formular_creator_id_then,
        ]);

        return response()->noContent();
    }

    public function formularCreatorTriggers(Request $request)
    {
        $moderator = Role::where('name', 'Moderator')->first()->id;

        FormularCreator::getOneWith($request->id, $moderator, []);

        $formularCreaterTriggers =
            FormularCreatorTriggers::
                where('formular_creator_id_when', $request->id)
                ->with('formularThen')
                ->get();

        return response()->json($formularCreaterTriggers);
    }

    public function formularCreatorTriggerSearch(Request $request)
    {
        $user = Auth::user();

        // Define the relationships to eager load
        $relationships = ['formulars'];
        $moderator = Role::where('name', 'Moderator')->first()->id;

        // Fetch FormularCreators where the user's area matches the FormularReader's area
        $formularCreators = FormularCreator::with($relationships)
            ->where('name', 'LIKE', "%$request->q%")
            ->orWhere('description', 'LIKE', "%$request->q%")
            ->whereHas('userRoles', function ($subQuery) use ($user, $moderator) {
                $subQuery->where('user_id', $user->id)->where('role_id', $moderator);
            })
            ->distinct()
            ->get();

        return response()->json($formularCreators);
    }
}
