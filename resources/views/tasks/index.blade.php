<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task List</title>
    <style>
        body.light-mode {
            background-color: #f7f9fc;
            color: #121212;
        }

        body.dark-mode {
            background-color: #121212;
            color: #f1f1f1;
        }

        body {
            font-family: 'Segoe UI', sans-serif;
            margin: 0;
            padding: 20px;
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        h1 {
            text-align: center;
            margin-bottom: 30px;
        }

        .toggle-btn {
            float: right;
            margin-bottom: 20px;
            background-color: #ccc;
            color: #000;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
        }

        .task-container {
            max-width: 800px;
            margin: 0 auto;
        }

        .task-card {
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 20px;
            color: white;
            box-shadow: 0 4px 10px rgba(255, 255, 255, 0.1);
            transition: transform 0.3s ease;
        }

        body.light-mode .task-card {
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            color: #000;
        }

        .task-card:hover {
            transform: scale(1.02);
        }

        .task-meta {
            font-size: 14px;
            margin-top: 10px;
        }

        .actions {
            margin-top: 15px;
        }

        .actions a, .actions button {
            text-decoration: none;
            padding: 6px 12px;
            border-radius: 6px;
            margin-right: 10px;
            font-weight: bold;
            transition: background-color 0.3s ease;
            display: inline-block;
            color: black;
        }

        .actions a:hover, .actions button:hover {
            background-color: #e0e0e0;
        }

        .btn-create {
            display: inline-block;
            background-color: #28a745;
            color: white;
            padding: 10px 20px;
            margin-bottom: 20px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
        }

        .btn-create:hover {
            background-color: #218838;
        }

        .success {
            background-color: #d4edda;
            color: #155724;
            padding: 10px;
            border-radius: 6px;
            margin-bottom: 20px;
        }

        .badge {
            padding: 5px 10px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: bold;
            display: inline-block;
        }

        .badge-pending {
            background-color: #6c757d;
        }

        .badge-in-progress {
            background-color: #ffc107;
        }

        .badge-completed {
            background-color: #28a745;
        }

        .badge-deleted {
            background-color: #dc3545;
        }

        .btn-danger {
            background-color: red;
            color: white;
            padding: 6px 12px;
            border-radius: 6px;
            border: none;
        }

        .btn-danger:hover {
            background-color: #c82333;
        }

        .btn-info {
            background-color: #17a2b8;
            color: white;
            padding: 6px 12px;
            border-radius: 6px;
            text-decoration: none;
        }

        .btn-info:hover {
            background-color: #138496;
        }
    </style>
</head>
<body>
    <div class="task-container">
        <!-- Theme Toggle Button -->
        <button id="toggle-theme" class="toggle-btn">🌓 Toggle Theme</button>

        <h1>Task Tracker</h1>

        <!-- Create New Task Button -->
        <a href="{{ route('tasks.create') }}" class="btn-create">+ Create New Task</a>

        <!-- Success message -->
        @if(session('success'))
            <div class="success">
                {{ session('success') }}
            </div>
        @endif

        <!-- Loop through tasks -->
        @foreach ($tasks as $task)
            <div class="task-card" style="background-color: {{ $task->color ?? '#6c757d' }}">
                <h2>{{ $task->title }}</h2>
                <p>{{ $task->description }}</p>
                <div class="task-meta">
                    <strong>Status:</strong> 
                    @if ($task->status === 'Completed')
                        <span class="badge badge-completed">✅ Completed</span>
                    @elseif ($task->status === 'In Progress')
                        <span class="badge badge-in-progress">⏳ In Progress</span>
                    @else
                        <span class="badge badge-pending">📝 Pending</span>
                    @endif
                    <br>
                    <strong>Elapsed Time:</strong> {{ $task->elapsed_time }} seconds
                </div>

                <div class="actions">
                    @if ($task->status === 'Pending')
                        <a href="{{ route('tasks.start', $task->id) }}">Start</a>
                    @elseif ($task->status === 'In Progress')
                        <a href="{{ route('tasks.stop', $task->id) }}">Stop</a>
                    @endif

                    <a href="{{ route('tasks.edit', $task->id) }}" class="btn-info">Edit</a>

                    <form action="{{ route('tasks.destroy', $task->id) }}" method="POST" style="display: inline-block;">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="btn-danger">Delete</button>
                    </form>
                </div>
            </div>
        @endforeach
    </div>

    <!-- Theme Toggle Script -->
    <script>
        const toggleBtn = document.getElementById('toggle-theme');

        toggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
        });

        window.onload = () => {
            const savedTheme = localStorage.getItem('theme') || 'dark';
            document.body.classList.add(savedTheme + '-mode');
        };
    </script>
</body>
</html>












