<?php

namespace App\Http\Controllers;

use App\Models\ListTable;
use App\Models\TaskTable;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = TaskTable::with('list')
        ->whereHas('list', function ($query) {
            $query->where('user_id', Auth::id());
        })->orderBy('created_at', 'desc');

        if (request()->has('search') && request('search')) {
            $search = request('search');
            $query->where(function ($q) use ($search) {
                $q->where('judul', 'like', "%{$search}%")
                  ->orWhere('deskripsi', 'like', "%{$search}%");
            });
        }

        if (request()->has('filter') && request('filter') !== 'all') {
            $filter = request('filter');
            if ($filter === 'completed') {
                $query->where('sudah_selesai', true);
            } elseif ($filter === 'pending') {
                $query->where('sudah_selesai', false);
            }
        }

        $tasks = $query->paginate(10);
        $lists = ListTable::where('user_id', Auth::user()->id)->get();
        return Inertia::render('admin/Tasks/Index',[
            'tasks' =>$tasks,
            'lists' => $lists,
            'filters' => [
                'search' =>request('search',''),
                'filter' => request('filter','')
            ],
            'flash'=>[
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string|max:255',
            'deadline' => 'nullable|date',
            'list_id' => 'required|exists:list_tables,id',
            'sudah_selesai' => 'boolean',
        ]);

        $validated['user_id'] = Auth::id();

        TaskTable::create($validated);
        return redirect()->route('tasks.index')->with('success', 'Tugas berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TaskTable $task)
    {
         $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string|max:255',
            'deadline' => 'nullable|date',
            'list_id' => 'required|exists:list_tables,id',
            'sudah_selesai' => 'boolean',
        ]);

        $validated['user_id'] = Auth::id();
        $task->update($validated);

        return redirect()->route('tasks.index')->with('success', 'Tugas berhasil diupdate.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TaskTable $task)
    {
        $task->delete();
        return redirect()->route('tasks.index')->with('success','Tugas Berhasil dihapus.');
    }
}
