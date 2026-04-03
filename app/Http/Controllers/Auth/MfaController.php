<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;

class MfaController extends Controller
{
    public function enable()  { return response()->json(['message' => 'Not implemented']); }
    public function verify()  { return response()->json(['message' => 'Not implemented']); }
    public function disable() { return response()->json(['message' => 'Not implemented']); }
    public function backupCodes() { return response()->json(['message' => 'Not implemented']); }
}
