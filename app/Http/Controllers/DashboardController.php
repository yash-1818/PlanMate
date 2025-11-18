<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TaskTable;
use App\Models\ListTable;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index() {
        $user = Auth::user();
        $lists = ListTable::where('user_id', $user->id)->get();
        $tasks = TaskTable::whereHas('list', function($query) use ($user){
            $query->where('user_id', $user->id);
        })->get();

        $stats = [
            'totalList' => $lists->count(),
            'totalTask' => $tasks->count(),
            'tugasSelesai' => $tasks->where('sudah_selesai',1)->count(),
            'tugasPending' => $tasks->where('sudah_selesai',0)->count()
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'tasks' => $tasks,
            'lists' => $lists,
            'flash' => [
                'success' =>session('success'),
                'error' =>session('error'),
            ]
        ]);
    }
}
