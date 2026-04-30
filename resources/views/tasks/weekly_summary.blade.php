@extends('layouts.app')

@section('content')
    <h1>Weekly Summary</h1>
    <p>Total time spent this week: {{ $totalTimeThisWeek }} seconds</p>

    <h2>This Week's Tasks:</h2>
    <ul>
        @foreach($tasks as $task)
            <li>{{ $task->title }} | Priority: {{ $task->priority }} | Duration: {{ $task->elapsed_time }} seconds</li>
        @endforeach
    </ul>
@endsection
