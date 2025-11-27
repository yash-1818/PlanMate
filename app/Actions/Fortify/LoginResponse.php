<?php

namespace App\Actions\Fortify;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Illuminate\Http\Request;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     */
    public function toResponse($request)
    {
        $user = $request->user();

        // Determine role name safely (relation or string)
        $roleName = null;
        if ($user) {
            if (is_object($user->role) && isset($user->role->nama_role)) {
                $roleName = $user->role->nama_role;
            } elseif (is_string($user->role)) {
                $roleName = $user->role;
            }
        }

        $target = $roleName === 'siswa' ? '/siswa/dashboard' : '/dashboard';

        return redirect()->intended($target);
    }
}
