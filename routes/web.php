<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;
Route::get('/', [TaskController::class, 'index'])->name('tasks.index');
Route::get('/tasks/create', [TaskController::class, 'create'])->name('tasks.create');
Route::post('/tasks', [TaskController::class, 'store'])->name('tasks.store');
Route::get('/tasks/{id}/edit', [TaskController::class, 'edit'])->name('tasks.edit');
Route::put('/tasks/{id}', [TaskController::class, 'update'])->name('tasks.update');
Route::delete('/tasks/{id}', [TaskController::class, 'destroy'])->name('tasks.destroy');
Route::get('/tasks/start/{id}', [TaskController::class, 'startTimer'])->name('tasks.start');
Route::get('/tasks/stop/{id}', [TaskController::class, 'stopTimer'])->name('tasks.stop');
Route::get('/tasks/daily-summary', [TaskController::class, 'dailySummary'])->name('tasks.daily_summary');
Route::get('/tasks/weekly-summary', [TaskController::class, 'weeklySummary'])->name('tasks.weekly_summary');
Route::get('/tasks/{id}/in-progress', [TaskController::class, 'markInProgress'])->name('tasks.in_progress');
Route::get('/tasks/{id}/completed', [TaskController::class, 'markCompleted'])->name('tasks.completed');
Route::get('/tasks/{id}/pending', [TaskController::class, 'markPending'])->name('tasks.pending');





