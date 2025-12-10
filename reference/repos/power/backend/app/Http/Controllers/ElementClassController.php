<?php

namespace App\Http\Controllers;

use App\Models\Actions;
use App\Models\ElementClass;
use Illuminate\Http\Request;

class ElementClassController extends Controller
{
    public function classes()
    {
        return response()->json(ElementClass::all());
    }
}
