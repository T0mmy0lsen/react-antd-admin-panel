<?php

namespace App\Http\Controllers;

use App\Models\Actions;
use Illuminate\Http\Request;

class ActionsController extends Controller
{
    public function actions()
    {
        return response()->json(Actions::all());
    }
}
