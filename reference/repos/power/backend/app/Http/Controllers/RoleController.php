<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\JsonResponse;

class RoleController extends Controller
{
    public function roles(): JsonResponse
    {
        return \response()->json(Role::all());
    }
}
