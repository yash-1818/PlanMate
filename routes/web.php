<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DashboardSiswaController;
use App\Http\Controllers\ListController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TaskSiswaController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;


Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard',[DashboardController::class,'index'])->name('dashboard');
    Route::resource('lists', ListController::class);
    Route::resource('tasks', TaskController::class);
    Route::resource('users',UserController::class);
    // Route::get('dashboard', function () {return Inertia::render('dashboard');})->name('dashboard');
});

Route::middleware(['auth', 'verified'])->prefix('siswa')->name('siswa.')->group(function () {
    Route::get('/dashboard',[DashboardSiswaController::class,'index'])->name('dashboard');
    Route::resource('tasks', TaskSiswaController::class);
    // Route::get('dashboard', function () {return Inertia::render('dashboard');})->name('dashboard');
});

require __DIR__.'/settings.php';
