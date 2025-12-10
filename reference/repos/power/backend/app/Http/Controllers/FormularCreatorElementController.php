<?php

namespace App\Http\Controllers;

use App\Models\Actions;
use App\Models\ElementClass;
use App\Models\FormularCreator;
use App\Models\ElementAccess;
use App\Models\ElementActions;
use App\Models\FormularCreatorElementClass;
use App\Models\ElementConditionValue;
use App\Models\FormularCreatorElements;
use App\Models\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class FormularCreatorElementController extends Controller
{
    public function formularCreatorElementAccess(Request $request): JsonResponse
    {
        $formularCreatorElement = FormularCreatorElements::where('id', $request->formular_creator_element_id)
            ->with('access')
            ->first();

        return response()->json($formularCreatorElement->access);
    }

    public function formularCreatorElementAccessCreate(Request $request): JsonResponse
    {
        $formularCreatorElement = FormularCreatorElements::where('id', $request->formular_creator_element_id)
            ->with('access')
            ->first();

        ElementAccess::create([
            'formular_creator_element_id' => $formularCreatorElement->id,
            'formular_creator_id' => $formularCreatorElement->formular_creator_id,
            'role_id' => $request->role_id,
            'area_id' => $request->area_id,
        ]);

        return response()->json($formularCreatorElement->access);
    }

    public function formularCreatorElements(Request $request): JsonResponse
    {
        $request->validate([
            'id' => ['required', 'int'],
        ]);

        $moderator = Role::where('name', 'Moderator')->first();
        $formularCreator = FormularCreator::getOneWith($request->id, $moderator->id,
            ['elements', 'elements.valueSet', 'elements.valueSet.options']);

        return \response()->json($formularCreator->elements);
    }

    public function formularCreatorElementCreateValidation(Request $request, $class): void
    {
        $request->validate([
            'name' => ['required', 'string'],
            'description' => ['required', 'string'],
            'class' => ['required', 'int'],
            'formular_creator_id' => ['required', 'int'],
            'group' => ['required', 'int'],
            'order' => ['required', 'int'],
            'section' => ['required', 'int'],
        ]);

        switch ($class->class) {
            case 'Condition':
                $request->validate([
                    'list_of_formular_creator_element_ids' => ['required', 'array'],
                    'list_of_value_ids' => ['required', 'array'],
                ]);
                break;
            case 'Button':
                $request->validate([
                    'action' => ['required', 'int'],
                ]);
                if ($request->action == 'formularAddOther') {
                    $request->validate([
                        'formular_creator_id_add_formular_other' => ['required', 'int'],
                    ]);
                }
                break;
            default:
                break;
        }
    }

    public function formularCreatorElementCreate(Request $request): Response
    {
        // Validate the request
        $class = ElementClass::where('id', $request->class)->first();
        $this->formularCreatorElementCreateValidation($request, $class);

        // Check if the user has a 'Moderator' role in the specific area
        $moderator = Role::where('name', 'Moderator')->first();
        FormularCreator::getOneWith($request->formular_creator_id, $moderator->id, []);

        // Derive the ValueSet from the request
        switch ($class->class) {
            case 'Boolean':
                $valueSetId = ElementClass::where('class', 'Boolean')->first()->id;
                break;
            case 'Integer':
                $valueSetId = ElementClass::where('class', 'Integer')->first()->id;
                break;
            case 'String':
                $valueSetId = ElementClass::where('class', 'String')->first()->id;
                break;
            default:
                $valueSetId = $request->has('value_set_id') ? $request->value_set_id : null;
                break;
        }

        $create = [
            'name' => $request->name,
            'description' => $request->description,
            'class' => $class->class,
            'class_id' => $class->id,
            'section' => $request->section,
            'group' => $request->group,
            'order' => $request->order,
            'formular_creator_id' => $request->formular_creator_id,
            'parent_id' => $request->parent_formular_creator_element_id ?? null,
            'value_set_id' => $valueSetId,
        ];

        $formularCreatorElement = FormularCreatorElements::create($create);

        // Create Reader access for all Areas that has access to the FormularCreator
        // This is just a default setting and can be changed later
        $formularCreator = FormularCreator::where('id', $request->formular_creator_id)->first();
        $formularCreator->load('formularRoles');
        $onlyUniqueAreas = $formularCreator->formularRoles->unique('area_id');
        foreach ($onlyUniqueAreas as $area) {
            ElementAccess::create([
                'formular_creator_element_id' => $formularCreatorElement->id,
                'formular_creator_id' => $formularCreatorElement->formular_creator_id,
                'role_id' => Role::where('name', 'Reader')->first()->id,
                'area_id' => $area->area_id,
            ]);
        }

        // Set the value for the Condition Element
        if ($formularCreatorElement->class == 'Condition') {
            foreach ($request->list_of_value_ids as $value_id) {
                ElementConditionValue::create([
                    'element_id_condition' => $formularCreatorElement->id,
                    'element_id_target' => $request->list_of_formular_creator_element_ids,
                    'value_id' => $value_id
                ]);
            }
        }

        // Set the value for the Button Element
        if ($formularCreatorElement->class == 'Button') {
            $action = Actions::where('id', $request->action)->first();
            switch ($action->action) {
                case 'formularAddSame':
                    ElementActions::create([
                        'formular_creator_element_id' => $formularCreatorElement->id,
                        'formular_creator_id' => $request->formular_creator_id,
                        'action_id' => $action->id,
                        'action' => $action->action,
                        'label' => '?'
                    ]);
                    break;
                case 'formularAddOther':
                    ElementActions::create([
                        'formular_creator_element_id' => $formularCreatorElement->id,
                        'formular_creator_id' => $request->formular_creator_id_add_formular_other,
                        'action_id' => $action->id,
                        'action' => $action->action,
                        'label' => '?'
                    ]);
                    break;
                default:
                    break;
            }
        }

        return response()->noContent();
    }

    public function formularCreatorElementUpdateMeta(Request $request): Response
    {
        $request->validate([
            'name' => ['required', 'string'],
            'description' => ['required', 'string'],
            'formular_creator_element_id' => ['required', 'int'],
        ]);

        $moderator = Role::where('name', 'Moderator')->first();
        $element = FormularCreatorElements::where('id', $request->formular_creator_element_id)->firstOrFail();
        FormularCreator::getOneWith($element->formular_creator_id, $moderator->id, []);

        $update = [
            'name' => $request->name,
            'description' => $request->description,
            'section' => $request->section ?? 0,
            'group' => $request->group ?? 0,
            'order' => $request->order ?? 0,
        ];

        FormularCreatorElements::where('id', $element->id)->update($update);

        return response()->noContent();
    }

    public function formularCreatorElementDelete(Request $request): Response
    {
        $request->validate([
            'formular_creator_element_id' => ['required', 'int'],
        ]);

        $moderator = Role::where('name', 'Moderator')->first();
        $element = FormularCreatorElements::where('id', $request->formular_creator_element_id)->firstOrFail();
        FormularCreator::getOneWith($element->formular_creator_id, $moderator->id, []);

        FormularCreatorElements::where('id', $element->id)->delete();

        return response()->noContent();
    }
}
