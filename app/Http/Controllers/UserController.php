<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class UserController extends Controller
{
   public function index(Request $request)
   {
        $query = User::with('role'); // Load relasi role

        // Search
        if ($request->has('search') && $request->search != '') {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        // Filter by role
        if ($request->has('role') && $request->role != '' && $request->role != 'all') {
            $query->whereHas('role', function($q) use ($request) {
                $q->where('nama_role', $request->role);
            });
        }

        $users = $query->orderBy('created_at', 'desc')
                    ->paginate(10)
                    ->withQueryString();

        $roles = Role::all();

        // Normalize validation errors to first message per field for easier frontend consumption
        $errorMessages = [];
        if (session('errors')) {
            $messages = session('errors')->getMessages();
            foreach ($messages as $field => $msgs) {
                $errorMessages[$field] = is_array($msgs) && count($msgs) ? $msgs[0] : (string) $msgs;
            }
        }

        return Inertia::render('admin/User/Index', [
            'users' => $users,
            'roles' => $roles,
            'filters' => [
                'search' => $request->search ?? '',
                'role' => $request->role ?? 'all',
            ],
            // Forward session flash explicitly so the page always receives it
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
            // Forward validation errors (if any) as an array of messages keyed by field
            'errors' => session('errors') ? session('errors')->getMessages() : [],
        ]);
    }

    

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => ['required', 'string'], // Ubah validasi
        ]);

        // Cari ID role berdasarkan nama
        $role = Role::where('nama_role', $validated['role'])->first();

        if (!$role) {
            return back()->withErrors(['role' => 'Role tidak valid']);
        }

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'id_role' => $role->id, // Simpan ID role
        ]);

        return redirect('/users')->with('success', 'User berhasil ditambahkan!');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'password' => ['nullable', 'confirmed', Password::defaults()],
            'role' => ['required', 'string'],
        ]);

        // Cari ID role berdasarkan nama
        $role = Role::where('nama_role', $validated['role'])->first();

        if (!$role) {
            return back()->withErrors(['role' => 'Role tidak valid']);
        }

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->id_role = $role->id; // Update ID role

        // Only update password if provided
        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return redirect('/users')->with('success', 'User berhasil diupdate!');
    }

    public function destroy(User $user)
    {
        // Prevent deleting yourself
        if ($user->id === Auth::id()) {
            return redirect('/users')
                ->with('error', 'Anda tidak dapat menghapus akun Anda sendiri!'); // Notifikasi error
        }

        $user->delete();

        return redirect('/users')
            ->with('success', 'User berhasil dihapus!'); // Notifikasi success
    }
}
