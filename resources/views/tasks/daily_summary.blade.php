@extends('layouts.app')

@section('content')
    <h1>Daily Summary</h1>
    <p>Total time spent today: {{ $totalTimeToday }} seconds</p>

    <h2>Today's Tasks:</h2>
    <ul>
        @foreach($tasks as $task)
            <li>{{ $task->title }} | Priority: {{ $task->priority }} | Duration: {{ $task->elapsed_time }} seconds</li>
        @endforeach
    </ul>
@endsection
