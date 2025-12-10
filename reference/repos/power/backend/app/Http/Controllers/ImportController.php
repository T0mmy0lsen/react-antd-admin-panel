<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\ValueSets;
use App\Models\Value;

class ImportController extends Controller
{
    /**
     * @group Value Set
     * APIs for managing value sets.
     */

    /**
     * @group Value Sets
     *
     * Fetch one
     *
     * @queryParam value_set_id integer required The ID of the value set. Example: 1
     *
     * @response {
     * "id": 1,
     * "name": "Test Value Set",
     * "description": "This is a test value set",
     * "config": [
     *  {
     *   "key": "label",
     *   "value": "Label"
     *  },
     *  {
     *   "key": "description",
     *   "value": "Description"
     *  }
     * ],
     * "system": false,
     * "created_at": "2021-01-01T00:00:00.000000Z",
     * "updated_at": "2021-01-01T00:00:00.000000Z",
     * "deleted_at": null
     * }
     */
    public function valueSet(Request $request)
    {
        $valueSet = ValueSets::where('id', $request->value_set_id)->first();

        return response()->json($valueSet);
    }

    /**
     * @group Value Sets
     *
     * Search
     *
     * @queryParam q string The search query. Example: Ja
     *
     * @response [{
     * "id": 1,
     * "name": "Test Value Set",
     * "description": "This is a test value set",
     * "config": [
     *  {
     *   "key": "label",
     *   "value": "Label"
     *  },
     *  {
     *   "key": "description",
     *   "value": "Description"
     *  }
     * ],
     * "system": false,
     * "created_at": "2021-01-01T00:00:00.000000Z",
     * "updated_at": "2021-01-01T00:00:00.000000Z",
     * "deleted_at": null
     * }]
     */
    public function valueSetSearch(Request $request)
    {
        $valueSets = ValueSets::without('values')
            ->where('name', 'LIKE', "%{$request->q}%")
            ->orWhere('description', 'LIKE', "%{$request->q}%")
            ->get();

        return response()->json($valueSets);
    }

    /**
     * @group Value Sets
     *
     * Fetch all
     *
     * @response [{
     * "id": 1,
     * "name": "Test Value Set",
     * "description": "This is a test value set",
     * "config": [
     *  {
     *   "key": "label",
     *   "value": "Label"
     *  },
     *  {
     *   "key": "description",
     *   "value": "Description"
     *  }
     * ],
     * "system": false,
     * "created_at": "2021-01-01T00:00:00.000000Z",
     * "updated_at": "2021-01-01T00:00:00.000000Z",
     * "deleted_at": null
     * }]
     */
    public function valueSets()
    {
        $valueSets = ValueSets::without('values')->get();

        return response()->json($valueSets);
    }

    /**
     * @group Value Sets
     *
     * Create one
     *
     * @bodyParam name string required The name of the value set. Example: Test Value Set
     * @bodyParam description string required The description of the value set. Example: This is a test value set
     * @bodyParam config.headers array required The configuration of the value set. Example: ["Label", "Description"]
     *
     * @response {
     * "id": 1,
     * "name": "Test Value Set",
     * "description": "This is a test value set",
     * "config": [{ "headers": ["Label", "Description"] }]}],
     * "system": false,
     * "created_at": "2021-01-01T00:00:00.000000Z",
     * "updated_at": "2021-01-01T00:00:00.000000Z",
     * "deleted_at": null
     * }
     */
    public function valueSetCreate(Request $request)
    {
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
        if (!in_array('Description', $headers)) $headers[] = 'Description';

        $result = array_map(function($value) {
            return ['key' => str_replace(" ", "-", strtolower($value)), 'value' => $value];
        }, $headers);

        $valueSet = ValueSets::create([
            'name' => $request->name,
            'description' => $request->description,
            'config' => $result,
            'system' => false,
        ]);

        return response()->json($valueSet);
    }

    /**
     * @group Value Sets
     *
     * Update one
     *
     * @bodyParam id integer required The ID of the value set. Example: 1
     * @bodyParam name string required The name of the value set. Example: Test Value Set
     * @bodyParam description string required The description of the value set. Example: This is a test value set
     * @bodyParam config.headers array required The configuration of the value set. Example: ["Label", "Description"]
     *
     * @response {
     * "id": 1,
     * "name": "Test Value Set",
     * "description": "This is a test value set",
     * "config": { "headers": ["Label", "Description"] }]}],
     * "system": false,
     * "created_at": "2021-01-01T00:00:00.000000Z",
     * "updated_at": "2021-01-01T00:00:00.000000Z",
     * "deleted_at": null
     * }
     */
    public function valueSetUpdate(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string'],
            'description' => ['required', 'string'],
        ]);

        $valueSet = ValueSets::findOrFail($request->id);

        if ($valueSet) {

            if ($request->has('config') && isset($request->config['headers'])) {
                $headers = $request->config['headers'];
            } else {
                $headers = [];
            }

            if (!in_array('Label', $headers)) $headers[] = 'Label';
            if (!in_array('Description', $headers)) $headers[] = 'Description';

            $result = array_map(function($value) {
                return ['key' => str_replace(" ", "-", strtolower($value)), 'value' => $value];
            }, $headers);

            $valueSet->update([
                'name' => $request->name,
                'description' => $request->description,
                'config' => $result,
            ]);
        }

        return response()->json($valueSet);
    }

    /**
     * @group Value Sets
     *
     * Delete one
     *
     * @bodyParam id integer required The ID of the value set. Example: 1
     *
     * @response 204
     */
    public function valueSetDelete(Request $request)
    {
        $valueSet = ValueSets::findOrFail($request->id);

        if ($valueSet) {
            $valueSet->delete();
        }

        return response()->noContent();
    }

    // -----------------------------------------------------------------------------------------------------------------
    // VALUES
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * @group Value
     *
     * APIs for managing values.
     */

    /**
     * @group Value
     *
     * Fetch one
     *
     * @queryParam value_id integer required The ID of the value. Example: 10
     *
     * @response {
     * "id": 1,
     * "value_set_id": 1,
     * "value": "En dejlig dag",
     * "description": "Hvis din dag nu har været ekstra god, så kan du vælge denne værdi."
     * "data": [
     *  {
     *   "key": "label",
     *   "value": "En dejlig dag"
     *  },
     * ],
     * created_at: "2021-01-01T00:00:00.000000Z",
     * updated_at: "2021-01-01T00:00:00.000000Z",
     * deleted_at: null
     * }
     */
    public function value(Request $request)
    {
        $value = Value::where('id', $request->value_id)->first();

        return response()->json($value);
    }

    /**
     * @group Value
     *
     * Search
     *
     * @queryParam q string The search query. Example: Ja
     *
     * @response [{
     * "id": 1,
     * "value_set_id": 1,
     * "value": "Ja",
     * "description": "Angiver at noget er sandt."
     * "data": [
     *  {
     *   "key": "label",
     *   "value": "Ja"
     *  },
     * ],
     * created_at: "2021-01-01T00:00:00.000000Z",
     * updated_at: "2021-01-01T00:00:00.000000Z",
     * deleted_at: null
     * }]
     */
    public function valueSearch(Request $request)
    {
        if (empty($request->q)) {
            return response()->json([]);
        }

        $values = Value::where('description', 'LIKE', "%{$request->q}%")
            ->orWhere('value', 'LIKE', "%{$request->q}%")
            ->get();

        return response()->json($values);
    }

    /**
     * @group Value
     *
     * Fetch all
     *
     * @queryParam value_set_id integer required The ID of the value set. Example: 1
     *
     * @response [{
     * "id": 1,
     * "value_set_id": 1,
     * "value": "Ja",
     * "description": "Angiver at noget er sandt."
     * "data": [
     *  {
     *   "key": "label",
     *   "value": "Ja"
     *  },
     * ],
     * created_at: "2021-01-01T00:00:00.000000Z",
     * updated_at: "2021-01-01T00:00:00.000000Z",
     * deleted_at: null
     * }]
     */

    public function values(Request $request)
    {
        $valueSet = ValueSets::where('id', $request->value_set_id)->first();

        return response()->json($valueSet->values);
    }

    /**
     * @group Value
     *
     * Create many
     *
     * @bodyParam value_set_id integer required The ID of the value set. Example: 1
     * @bodyParam values array required The values of the value set. Example: [{ "label": "Test Value", "description": "This is a test value" }]
     *
     * @response {
     * "id": 1,
     * "value_set_id": 1,
     * "value": "En dejlig dag",
     * "description": "Hvis din dag nu har været ekstra god, så kan du vælge denne værdi."
     * "data": [{ "label": "En dejlig dag" }],
     * created_at: "2021-01-01T00:00:00.000000Z",
     * updated_at: "2021-01-01T00:00:00.000000Z",
     * deleted_at: null
     * }
     */
    public function valuesCreate(Request $request)
    {
        $request->validate([
            'values' => ['required', 'array'],
            'values.*.label' => ['required', 'string'],
            'values.*.description' => ['required', 'string'],
            'value_set_id' => ['required', 'integer'],
        ]);

        $valueSetId = $request->value_set_id;
        $valueSet = ValueSets::find($valueSetId);

        if ($request->has('values'))
        {
            foreach ($request->values as $valueData)
            {
                $data = array_map(function ($key, $value) {
                    return ['key' => $key, 'value' => $value];
                }, array_keys($valueData), array_values($valueData));

                $value = Value::create([
                    'value_set_id' => $valueSet->id,
                    'value' => $valueData['label'],
                    'data' => $data,
                ]);
            }
        }

        $valueSet = ValueSets::find($valueSetId);

        return response()->json($valueSet->values);
    }

    /**
     * @group Value
     *
     * Update many
     *
     * @queryParam value_set_id integer required The ID of the value set. Example: 1
     *
     * @bodyParam values array required The values to update. Each object in the array should have an `id` (the ID of the value to update), `label` (the new label), and `description` (the new description). Example: [{ "id": 1, "label": "Updated Value", "description": "This is an updated test value" }]
     *
     * @response 204
     */
    public function valuesUpdate(Request $request)
    {
        $request->validate([
            'values' => ['required', 'array'],
            'values.*.id' => ['required', 'integer'],
            'values.*.label' => ['required', 'string'],
            'values.*.description' => ['required', 'string'],
        ]);

        if ($request->has('values'))
        {
            foreach ($request->values as $valueData)
            {
                $filteredData = array_filter($valueData, function ($key) {
                    return $key !== 'id';
                }, ARRAY_FILTER_USE_KEY);

                // Now, use array_map to transform the array
                $data = array_map(function ($key, $value) {
                    return ['key' => $key, 'value' => $value];
                }, array_keys($filteredData), $filteredData);

                $value = Value::where('id', $valueData['id'])->update([
                    'value' => $valueData['label'],
                    'data' => $data,
                ]);
            }
        }

        return response()->noContent();
    }

    /**
     * @group Value
     *
     * Delete many
     *
     * @bodyParam ids array required The IDs of the values to delete. Example: [1, 2, 3]
     *
     * @response 204
     */
    public function valuesDelete(Request $request)
    {
        foreach ($request->ids as $id) {
            $value = Value::findOrFail($id);
            $value->delete();
        }

        return response()->noContent();
    }

    /**
     * @group Users
     *
     * Create many
     *
     * @bodyParam users array required The users to create. Example: [{ "email": " [email protected]", "name": "John Doe", "roles": [{ "area": "Aalborg", "role": "Reader" }] }]
     *
     * @response 204
     */
    public function users(Request $request)
    {
        $request->validate([
            'users' => ['required', 'array'],
            'users.*.email' => ['required', 'string'],
            'users.*.name' => ['required', 'string'],
            'users.*.roles' => ['required', 'array'],
            'users.*.roles.*.area' => ['required', 'string'],
            'users.*.roles.*.role' => ['required', 'string'],
        ]);

        foreach ($request->users as $userData)
        {
            // Create or update given email as the identifier.
            $user = User::updateOrCreate([
                'email' => $userData['email'],
            ], [
                'name' => $userData['name'],
            ]);

            // Get all existing roles of the user
            $existingRoles = $user->roles()->get()->keyBy(function ($userRole) {
                return $userRole->role->name . '-' . $userRole->area->name;
            });

            foreach ($userData['roles'] as $roleData)
            {
                $role = Role::where('name', $roleData['role'])->first();
                $area = Area::where('name', $roleData['area'])->first();

                if ($role && $area)
                {
                    $key = $role->name . '-' . $area->name;

                    // If the user already has this role, remove it from the existingRoles array
                    if ($existingRoles->has($key)) {
                        $existingRoles->forget($key);
                    } else {
                        // If the user doesn't have this role, add it
                        $user->roles()->create([
                            'role_id' => $role->id,
                            'area_id' => $area->id,
                        ]);
                    }
                }
            }

            // Any roles left in the existingRoles array are not in the new roles list, so remove them
            foreach ($existingRoles as $userRole) {
                $userRole->delete();
            }
        }
    }
}
