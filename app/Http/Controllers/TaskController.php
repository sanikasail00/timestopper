<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Carbon\Carbon;

class TaskController extends Controller
{
    // Show task list
    public function index()
    {
        $tasks = Task::all();
        return view('tasks.index', compact('tasks'));
    }

    // Show create task form
    public function create()
    {
        return view('tasks.create');
    }

    // Store a new task
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'color' => 'required|string|max:7|regex:/^#[0-9A-Fa-f]{6}$/', // Hex color validation
            'priority' => 'required|in:Low,Medium,High', // Add validation for priority
            'summary' => 'required|string', // Add validation for summary
        ]);

        Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'color' => $request->color,
            'priority' => $request->priority, // Store the priority
            'summary' => $request->summary, // Store the summary
            'start_time' => null,
            'end_time' => null,
            'elapsed_time' => 0,
            'status' => 'Pending',
        ]);

        return redirect()->route('tasks.index')->with('success', 'Task created successfully!');
    }

    // Show edit task form
    public function edit($id)
    {
        // Retrieve the task by ID
        $task = Task::findOrFail($id);

        // Retrieve tasks for today
        $tasksToday = Task::whereDate('start_time', Carbon::today())->get();

        // Retrieve tasks for this week
        $tasksThisWeek = Task::whereBetween('start_time', [Carbon::now()->startOfWeek(), Carbon::now()])->get();

        return view('tasks.edit', compact('task', 'tasksToday', 'tasksThisWeek'));
    }

    // Update a task
    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'color' => 'required|string|max:7|regex:/^#[0-9A-Fa-f]{6}$/', // Hex color validation
            'priority' => 'required|in:Low,Medium,High', // Add validation for priority
            'summary' => 'required|string', // Add validation for summary
        ]);

        $task = Task::findOrFail($id);

        $task->title = $request->title;
        $task->description = $request->description;
        $task->color = $request->color;
        $task->priority = $request->priority; // Update the priority
        $task->summary = $request->summary; // Update the summary

        $task->save();

        return redirect()->route('tasks.index')->with('success', 'Task updated successfully!');
    }

    // Delete a task
    public function destroy($id)
    {
        $task = Task::findOrFail($id);
        $task->delete();

        return redirect()->route('tasks.index')->with('success', 'Task deleted successfully!');
    }

    // Start the timer
    public function startTimer($id)
    {
        $task = Task::findOrFail($id);

        // Start the timer if it's not already started
        if ($task->status !== 'In Progress') {
            $task->start_time = Carbon::now();
            $task->status = 'In Progress';
            $task->save();
        }

        return redirect()->route('tasks.index')->with('success', 'Timer started!');
    }

    // Stop the timer
    public function stopTimer($id)
    {
        $task = Task::findOrFail($id);

        // Stop the timer if it is in progress
        if ($task->status === 'In Progress') {
            $task->end_time = Carbon::now();

            if ($task->start_time) {
                $task->elapsed_time = $task->start_time->diffInSeconds($task->end_time);
            } else {
                $task->elapsed_time = 0;
            }

            $task->status = 'Completed'; // Mark task as completed
            $task->save();
        }

        return redirect()->route('tasks.index')->with('success', 'Timer stopped and task completed!');
    }

    // Daily Summary
    public function dailySummary()
    {
        $today = Carbon::today();
        $tasks = Task::whereDate('start_time', $today)->get();
        $totalTimeToday = $tasks->sum(function ($task) {
            return $task->start_time ? $task->start_time->diffInSeconds($task->end_time) : 0;
        });

        return view('tasks.daily_summary', compact('tasks', 'totalTimeToday'));
    }

    // Weekly Summary
    public function weeklySummary()
    {
        $weekStart = Carbon::now()->startOfWeek();
        $tasks = Task::whereBetween('start_time', [$weekStart, Carbon::now()])->get();
        $totalTimeThisWeek = $tasks->sum(function ($task) {
            return $task->start_time ? $task->start_time->diffInSeconds($task->end_time) : 0;
        });

        return view('tasks.weekly_summary', compact('tasks', 'totalTimeThisWeek'));
    }
}





