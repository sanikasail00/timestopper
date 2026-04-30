@extends('layouts.app')

@section('content')
<div class="container">
    <h1>Create Task</h1>
    <!-- Form to create a new task -->
    <form action="{{ route('task.store') }}" method="POST">
        @csrf
        <div class="form-group">
            <label for="title">Task Title</label>
            <input type="text" name="title" class="form-control" required>
        </div>
        <div class="form-group">
            <label for="description">Description</label>
            <textarea name="description" class="form-control"></textarea>
        </div>
        <div class="form-group">
            <label for="start_time">Start Time</label>
            <input type="datetime-local" name="start_time" class="form-control">
        </div>
        <div class="form-group">
            <label for="end_time">End Time</label>
            <input type="datetime-local" name="end_time" class="form-control">
        </div>
        <button type="submit" class="btn btn-primary">Create Task</button>
    </form>

    <h2>Task List</h2>
    <!-- Display the list of tasks -->
    <ul>
        @foreach($tasks as $task)
            <li>
                <strong>{{ $task->title }}</strong> <br>
                Description: {{ $task->description }} <br>
                Start Time: {{ $task->start_time }} <br>
                End Time: {{ $task->end_time }} <br>
                <a href="{{ route('task.start', $task->id) }}">Start Timer</a> |
                <a href="{{ route('task.stop', $task->id) }}">Stop Timer</a> |
                <a href="{{ route('task.update', $task->id) }}">Update Task</a>
            </li>
        @endforeach
    </ul>
</div>
@endsection



