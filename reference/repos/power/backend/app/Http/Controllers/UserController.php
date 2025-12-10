<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserRoles;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class UserController extends Controller
{
    public function users(): JsonResponse
    {
        return \response()->json(User::all());
    }

    public function userCreate(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
        ]);

        $user = new User;
        $user->name = $request->name;
        $user->email = $request->email;

        // Hash the password
        $user->password = bcrypt($request->password);
        $user->save();

        return response()->json('User created successfully.', 201);
    }

    public function userRoles(Request $request)
    {
        return \response()->json(UserRoles::where('user_id', $request->user_id)->get());
    }

    public function userRoleCreate(Request $request)
    {
        $request->validate([
            'user_id' => ['required', 'int'],
            'area_id' => ['required', 'int'],
            'role_id' => ['required', 'int'],
        ]);

        UserRoles::create([
            'user_id' => $request->user_id,
            'area_id' => $request->area_id,
            'role_id' => $request->role_id,
        ]);

        return response()->noContent();
    }
}
