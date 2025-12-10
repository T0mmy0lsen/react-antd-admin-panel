<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TokenController extends Controller
{
    public function tokensCreate(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string'],
        ]);

        $token = $request->user()->createToken($request->name);

        return response()->json([
            'token' => $token->plainTextToken
        ]);
    }

    public function tokensRevoke(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->noContent();
    }

    public function tokens(Request $request)
    {
        return response()->json($request->user()->tokens);
    }
}
