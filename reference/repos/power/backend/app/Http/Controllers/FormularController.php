<?php

namespace App\Http\Controllers;

use App\Models\Configs;
use App\Models\Formular;
use App\Models\FormularCreator;
use App\Models\FormularCreatorConfigs;
use App\Models\FormularCreatorElements;
use App\Models\FormularCreatorTriggers;
use App\Models\FormularFieldState;
use App\Models\FormularFieldStateValue;
use App\Models\FormularState;
use App\Models\FormularStateValue;
use App\Models\FormularTrigger;
use App\Models\FormularValue;
use App\Models\Value;
use App\Models\ValueBoolean;
use App\Models\ValueSets;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class FormularController extends Controller
{
    private function processFields(Request $request): array
    {
        // Fetch elements associated with the form that may need to be updated with new values.
        // The request will have an "id" key, but that will have no effect here.
        $formElements = FormularCreatorElements::whereIn('id', $request->keys())
            ->with(['valueSet', 'valueSet.options'])
            ->get();

        $formularValues = [];

        // Iterate over each form element to check if the corresponding value from the request is null or empty.
        foreach ($formElements as $element)
        {
            $valueFromRequest = $request->input($element->id);

            // If the value from the request is null or empty, add the element's id to the unfilled fields array.
            if (is_null($valueFromRequest) || $valueFromRequest === 0 || $valueFromRequest === '') {
                // Don't save an empty value
                // TODO: Check if this is the correct behavior. Maybe we should save an empty value?
                continue;
            }

            // Handle multiple values for array inputs and single values otherwise.
            if (is_array($valueFromRequest)) {
                foreach ($valueFromRequest as $value) {
                    $formularValues[] = $this->processValue(
                        $element,
                        $value,
                        $request
                    );
                }
            } else {
                $formularValues[] = $this->processValue(
                    $element,
                    $valueFromRequest,
                    $request
                );
            }
        }

        return $formularValues;
    }

    private function processFieldStates(Request $request, Formular $formular, Collection $formularValues): void
    {
        // Process field states.

        // (1) Make a field state for all fields that are not filled and required.
        //     A field is required if its ElementConfig has a Config with config = 'required' and a ElementConfig->value->valueOption->value = 'Ja'.

        $formElements = FormularCreatorElements::where('formular_creator_id', $formular->formular_creator_id)
            ->with(['configs', 'valueSet'])
            ->get();

        foreach ($formElements as $element)
        {
            // Check if the element is required.
            $isRequired = $element->configs->contains(function ($config) {
                return (
                    $config->config->config == 'required' &&
                    $config->inputs[0] &&
                    $config->inputs[0]->value->valueBoolean &&
                    $config->inputs[0]->value->valueBoolean->value == 1
                );
            });

            // Find the value in the formular values
            $isFilledValue = $formularValues->firstWhere('formular_creator_element_id', $element->id);

            if ($isRequired)
            {
                FormularFieldState::updateValueBoolean($formular, $element,'required', 'requiredNeedsAction', is_null($isFilledValue));
            }
        }
    }

    private function processFormularStates(Request $request, Formular $formular, Collection $formularValues)
    {
        // Process formular states.

        // (1) Make a formular state that tells if the formular some field states where required is true.
        //     A formular state is required if any of Formular->FormularFieldState has a Config with config = 'requiredNeedsAction' and a FormularFieldStateValue->value->valueBoolean->value = 1.

        $formularFieldStates = FormularFieldState::where('formular_id', $formular->id)->with(['stateValue'])->get();

        $requiredFieldStates = $formularFieldStates->filter(function ($formularFieldState) {
            return $formularFieldState->stateValue->contains(function ($config) {
                return $config->config->config == 'requiredNeedsAction' && $config->value->valueBoolean->value == 1;
            });
        });

        $hasRequiredFieldStates = $requiredFieldStates->count() > 0;

        FormularState::updateValueBoolean($formular, 'derivedFromFields', 'requiredNeedsActionDisplay', $hasRequiredFieldStates);

        // (2) Figure out if it should be deleted at some point and when.
        //     A formular should be deleted at some time after creation if updated_at = created_at.
        //     A formular should be deleted at some time after creation if now() = updated_at + time.

        // The actual deletion is done as a command that runs every minute. This is merely for the state.

        // (2.1) Do it for deleteEmpty

        $configDeleteEmpty = Configs::where('config', 'deleteEmpty')->first();

        $configDeleteEmptyValue = FormularCreatorConfigs::where('formular_creator_id', $formular->formular_creator_id)
            ->where('config_id', $configDeleteEmpty->id)
            ->first();

        // Figure out if the config for deleteEmpty is set
        $shouldDeleteEmpty = $configDeleteEmptyValue?->inputs[0]->value->valueInt->value;

        if ($shouldDeleteEmpty) {

            // Figure out it the formular is empty. We should filter out those value created by the copy field from latest formular or element.
            $formularValuesWithoutCopyField = $formularValues->filter(function ($formularValue) {
                return $formularValue->element->configs->filter(function ($config) {
                        return (
                            $config->config->config == 'copyFieldFromLatestFormular' && $config->inputs[0]->value->valueBoolean->value == 1 ||
                            $config->config->config == 'copyFieldFromLatestElement' && $config->inputs[0]->value->valueBoolean->value == 1
                        );
                    })->count() == 0;
            });

            if ($formularValuesWithoutCopyField->count() > 0) {
                // The formular has values filled by the user
                FormularState::updateValueString($formular, 'deleteEmpty', 'deleteEmptyDisplay', '?');
            }

            if ($formularValuesWithoutCopyField->count() == 0) {
                // Calculate the time until deletion
                $timeUntilDeletion = $formular->created_at->addMinutes($shouldDeleteEmpty)->diffForHumans();
                // Get the time as a datetime that it should be deleted
                $timeUntilDeletionDateTime = $formular->created_at->addMinutes($shouldDeleteEmpty);
                // Save the time until deletion
                FormularState::updateValueString($formular, 'deleteEmpty', 'deleteEmptyDisplay', $timeUntilDeletionDateTime);
            }
        }

        // (2.2) Do it for deleteIdle

        $configDeleteIdle = Configs::where('config', 'deleteIdle')->first();

        $configDeleteIdleValue = FormularCreatorConfigs::where('formular_creator_id', $formular->formular_creator_id)
            ->where('config_id', $configDeleteIdle->id)
            ->first();

        $shouldDeleteIdle = $configDeleteIdleValue?->inputs[0]->value->valueInt->value;

        if ($shouldDeleteIdle) {

            // If there are no values, we should use the date from the formular creation
            if ($formularValues->count() == 0) {
                $timeUntilDeletion = $formular->updated_at->addMinutes($shouldDeleteIdle)->diffForHumans();
                // Get the time as a datetime that it should be deleted
                $timeUntilDeletionDateTime = $formular->updated_at->addMinutes($shouldDeleteIdle);
            }

            // If there are values, we should use the date from the last value
            if ($formularValues->count() > 0) {
                $timeUntilDeletion = $formularValues->last()->updated_at->addMinutes($shouldDeleteIdle)->diffForHumans();
                // Get the time as a datetime that it should be deleted
                $timeUntilDeletionDateTime = $formularValues->last()->updated_at->addMinutes($shouldDeleteIdle);
            }

            // Save the time until deletion
            FormularState::updateValueString($formular, 'deleteIdle', 'deleteIdleDisplay', $timeUntilDeletionDateTime);
        }
    }

    private function hasDuplicates($array)
    {
        $valueCount = array_count_values($array);
        $duplicates = array_filter($valueCount, function($count) {
            return $count > 1;
        });

        return count($duplicates) > 0;
    }

    private function formularCreateRecursive($formular, $ids)
    {
        $formularCreatorTriggers = FormularCreatorTriggers::where('formular_creator_id_when', $formular->formular_creator_id)->get();

        foreach ($formularCreatorTriggers as $formularCreatorTrigger)
        {
            $formularThen = Formular::create([
                'user_id' => Auth::id(),
                'formular_creator_id' => $formularCreatorTrigger->formular_creator_id_then,
                'data' => []
            ]);

            FormularTrigger::create([
                'formular_creator_trigger_id' => $formularCreatorTrigger->id,
                'formular_id_when' => $formular->id,
                'formular_id_then' => $formularThen->id,
            ]);

            $ids[] = $formularThen->formular_creator_id;

            // Stop recursion if duplicates are found
            if ($this->hasDuplicates($ids)) {
                break;
            }

            $this->formularCreateRecursive($formularThen, $ids);
        }
    }

    private function handleTrigger($request, $formular)
    {
        if ($request->withTrigger) {
            FormularTrigger::create([
                'formular_creator_trigger_id' => 0,
                'formular_id_when' => $request->withTriggerFormularId,
                'formular_id_then' => $formular->id,
            ]);
        }
    }

    private function byFormularCopyFieldsToNewFormular(Request $request, $formular): void
    {
        // Figure out if we should copy some fields to the new formular
        // We take the ElementConfigs from the FormularCreator where config = onFormularAddSameCopyField.
        $elementConfigs = FormularCreator::find($request->id)->elements->map(function ($element) {
            return $element->configs->filter(function ($config) {
                return
                    $config->config->config == 'copyFieldFromLatestFormular' &&
                    $config->inputs &&
                    $config->inputs[0]->value->valueBoolean->value == 1;
            });
        })->flatten();

        // For each ElementConfig we find, we copy the value from the latest formular to the new formular.
        $elementConfigs->each(function ($elementConfig) use ($formular)
        {
            // Find the latest FormularValue that has a value for the current User.

            // Get the ID of the currently logged-in user
            $userId = Auth::id();

            // Query the FormularValue model
            $latestFormularValue = FormularValue::where('formular_creator_element_id', $elementConfig->formular_creator_element_id)->whereHas('formular', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->orderBy('created_at', 'desc')
            ->first();

            if ($latestFormularValue)
            {
                // Delete any values for that element in the new formular
                // This is actually not needed, as this is the first time we create a value for this element in the new formular.
                // However, we keep it here to prevent any errors in the future
                FormularValue::where('formular_id', $formular->id)
                    ->where('formular_creator_element_id', $elementConfig->formular_creator_element_id)
                    ->delete();

                // Make a new Value from the latest FormularValue
                $value = Value::find($latestFormularValue->value_id);

                FormularValue::create([
                    'formular_id' => $formular->id,
                    'formular_creator_id' => $formular->formular_creator_id,
                    'formular_creator_element_id' => $elementConfig->formular_creator_element_id,
                    'value_id' => Value::copy($value)->id,
                ]);
            }
        });
    }

    private function byElementsCopyFieldsToNewFormular(Request $request, $formular): void
    {
        // Figure out if we should copy some fields to the new formular
        // We take the ElementConfigs from the FormularCreator where config = onFormularAddSameCopyField.
        $elementConfigs = FormularCreator::find($request->id)->elements->map(function ($element) {
            return $element->configs->filter(function ($config) {
                return
                    $config->config->config == 'copyFieldFromLatestFormular' &&
                    $config->inputs &&
                    $config->inputs[0]->value->valueBoolean->value == 1;
            });
        })->flatten();

        // For each ElementConfig we find, we copy the value from the latest formular to the new formular.
        $elementConfigs->each(function ($elementConfig) use ($formular)
        {
            // This differs from the previous method in that we are looking for the latest FormularValue for the user using that particular value set.
            // We can find the value set of the element by looking at the value set of the element config.

            // Get the ID of the currently logged-in user
            $userId = Auth::id();

            // Get the value set ID from the element config
            $valueSetId = FormularCreatorElements::where('id', $elementConfig->formular_creator_element_id)->first()->valueSet->id;

            // Query the FormularValue model
            $latestFormularValue = FormularValue::whereHas('formular', function ($query) use ($userId) {
                    $query->where('user_id', $userId);
                })
                ->whereHas('value', function ($query) use ($valueSetId) {
                    $query->where('value_set_id', $valueSetId);
                })
                ->orderBy('created_at', 'desc')
                ->first();

            if ($latestFormularValue)
            {
                // Delete any values for that element in the new formular
                FormularValue::where('formular_id', $formular->id)
                    ->where('formular_creator_element_id', $elementConfig->formular_creator_element_id)
                    ->delete();

                // Make a new Value from the latest FormularValue
                $value = Value::find($latestFormularValue->value_id);

                FormularValue::create([
                    'formular_id' => $formular->id,
                    'formular_creator_id' => $formular->formular_creator_id,
                    'formular_creator_element_id' => $elementConfig->formular_creator_element_id,
                    'value_id' => Value::copy($value)->id,
                ]);
            }
        });
    }

    public function formularCreate(Request $request)
    {
        $request->validate([
            'id' => ['required', 'int'],
        ]);

        $formular = Formular::create([
            'user_id' => Auth::id(),
            'formular_creator_id' => $request->id,
            'data' => []
        ]);

        // If there is a addFormularSame or addFormularOther action.
        // $this->handleTrigger($request, $formular);

        // If there is a copyFieldFromLatestFormular config on elements from latest formular.
        $this->byFormularCopyFieldsToNewFormular($request, $formular);

        // If there is a copyFieldFromLatestElement config on the latest element (from any formular).
        $this->byElementsCopyFieldsToNewFormular($request, $formular);

        // If there is a Trigger added to the Formular.
        // $this->formularCreateRecursive($formular, []);

        $formularValues = FormularValue::where('formular_id', $formular->id)->get();

        $this->processFieldStates($request, $formular, $formularValues);

        $this->processFormularStates($request, $formular, $formularValues);

        return response()->json($formular);
    }

    /**
     * Save the form data for a specific form.
     *
     * Validates the request for a required form ID, fetches the corresponding form for the authenticated user,
     * and updates form values based on the request data.
     *
     * @param Request $request
     * @return JsonResponse|Response
     */
    public function formularSave(Request $request)
    {
        // Validate the incoming request to ensure an 'id' is provided and is an integer.
        $request->validate([
            'id' => ['required', 'integer'],
        ]);

        $authenticatedUser = Auth::user();

        // Attempt to fetch the form that matches the provided ID and belongs to the authenticated user.
        $formular = Formular::where('id', $request->id)
            ->where('user_id', $authenticatedUser->id)
            ->first();

        // If the form cannot be found, return an error response.
        if (!$formular) {
            return response()->json(['error' => 'Form not found or access denied'], 404);
        }

        // Delete existing values for the form to prevent duplicates before adding new values.
        // TODO: Figure out how we can roll this back if the new values fail to save.
        FormularValue::where('formular_id', $formular->id)->delete();

        // Extract unfilled fields to use.
        $this->processFields($request);

        $formularValues = FormularValue::where('formular_id', $formular->id)->get();

        // Process field states.
        $this->processFieldStates($request, $formular, $formularValues);

        // Process formular states.
        $this->processFormularStates($request, $formular, $formularValues);

        // Return a success response.
        return response()->json(['message' => 'Formular data saved successfully']);
    }

    /**
     * Creates or updates a form value for a specific form element based on the request data.
     *
     * This method handles the creation of form values, associating them with the correct form element
     * and form, and setting the appropriate value based on the request.
     *
     * @param mixed $element The form element associated with the value.
     * @param mixed $value The value from the request to be saved.
     * @param \Illuminate\Http\Request $request The current request instance.
     */
    protected function processValue($element, $value, $request): FormularValue
    {
        // Determine the value set ID and type, default to 'String' if not found.
        $valueSetId = $element->valueSet->id ?? null;
        $valueSetType = $element->valueSet->type ?? 'String';

        // Create a new value instance with the provided or default attributes.
        $value = Value::valueCreate([
            'value' => $value,
            'value_set_id' => $valueSetId,
            'value_set_type' => $valueSetType,
        ]);

        // Create or update the FormularValue record with the new value instance.
        return FormularValue::create([
            'formular_id' => $request->id,
            'formular_creator_id' => $element->formular_creator_id,
            'formular_creator_element_id' => $element->id,
            'value_id' => $value->id,
            // 'value_set_id' => $valueSetId,
            // 'value_set_type' => $valueSetType,
        ]);
    }

    public function formularOpen(Request $request)
    {
        $request->validate([
            'id' => ['required', 'int']
        ]);

        $user = Auth::user();

        // Fetch the Formular with the given id and where the user's roles match the FormularReader
        $formular = Formular::where('formulars.id', $request->id)
            ->where('user_id', $user->id)
            ->with([
                'formularValues',
                'triggers',
                'triggers.triggerCreator',
                'triggers.triggerCreator.formularThen',
                'formularCreator',
                'formularCreator.elements',
                'formularCreator.elements.access',
                'formularCreator.elements.action',
                'formularCreator.elements.valueSet',
                'formularCreator.elements.valueSet.options'
            ])
            ->first();

        if (!$formular) {
            return response()->json(['error' => 'Formular not found or access denied'], 404);
        }

        // Filter the formular
        $accessibleFormularValues = $formular->formularValues->filter(function ($formularValue) use ($user, $formular) {
            foreach ($formular->formularCreator->elements as $element) {
                if ($element->id == $formularValue->formular_creator_element_id) {
                    foreach ($element->access as $access) {
                        foreach ($user->roles as $userRole) {
                            if ($access->area_id == $userRole->area_id && $access->role_id == $userRole->role_id) {
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        });

        // Filter the formular elements
        $accessibleFormularElements = $formular->formularCreator->elements->filter(function ($element) use ($user) {
            foreach ($element->access as $access) {
                foreach ($user->roles as $userRole) {
                    if ($access->area_id == $userRole->area_id && $access->role_id == $userRole->role_id) {
                        return true;
                    }
                }
            }
            return false;
        });

        $accessibleFormularElementState = $accessibleFormularElements->map(function ($element) use ($formular) {
            return FormularFieldState::where('formular_id', $formular->id)
                ->where('formular_creator_element_id', $element->id)
                ->first();
        });

        // The states to its matching elements
        $formular->formularCreator->elements->map(function ($element) use ($accessibleFormularElementState) {
            $element->state = $accessibleFormularElementState->firstWhere('formular_creator_element_id', $element->id);
        });

        // Set the modified collections as the new relations
        $formular->setRelation('formularValues', $accessibleFormularValues ?? []);
        $formular->formularCreator->elements = $accessibleFormularElements->toArray();

        $formular->data = false;

        return response()->json($formular);
    }

    public function formularsByUser(Request $request): JsonResponse
    {
        $user = Auth::user();

        $formulars = Formular::where('user_id', $user->id)
            ->with(['formularCreator', 'formularStates', 'formularStates.stateValue'])
            ->get();

        return response()->json($formulars);
    }
}
