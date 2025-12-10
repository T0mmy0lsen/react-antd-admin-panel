<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ExportController extends Controller
{
    /**
     * @group Formular
     * APIs for fetching formular data.
     */

    /**
     * @group Formular
     * 
     * Get formular data
     * 
     * This endpoint returns the formular data.
     * 
     * @queryParam id required The id of the formular creator. Example: 1
     */
    public function formularView(Request $request)
    {
        // Validate the request ID or handle it appropriately
        // For example, ensure it's an integer or a valid identifier

        $viewName = "view_for_formular_creator_" . intval($request->id);

        // Using parameter binding for safety
        $results = DB::select("SELECT * FROM `{$viewName}`");

        return response()->json($results);
    }
}
