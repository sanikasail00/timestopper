<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Task</title>
    <style>
        body {
            background-color: #f7f9fc;
            font-family: 'Segoe UI', sans-serif;
            margin: 0;
            padding: 20px;
        }

        h1 {
            text-align: center;
            margin-bottom: 30px;
            color: #4a148c; /* deep purple */
        }

        .task-container {
            max-width: 800px;
            margin: 0 auto;
        }

        .form-container {
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            background-color: white;
        }

        label {
            font-weight: bold;
            margin-bottom: 8px;
            color: #333;
        }

        input, textarea {
            width: 100%;
            padding: 12px;
            margin: 12px 0;
            border-radius: 8px;
            border: 1px solid #ddd;
            background-color: #f9f9f9;
            color: #333;
        }

        input[type="color"] {
            padding: 0;
            width: 50px;
        }

        select {
            width: 100%;
            padding: 12px;
            margin: 12px 0;
            border-radius: 8px;
            border: 1px solid #ddd;
            background-color: #f9f9f9;
            color: #333;
        }

        .btn-submit {
            background-color: #6a1b9a;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .btn-submit:hover {
            background-color: #4a148c;
        }

        .alert {
            padding: 12px;
            margin-bottom: 20px;
            border-radius: 6px;
        }

        .alert-success {
            background-color: #66bb6a;
            color: white;
        }

        .alert-danger {
            background-color: #ef5350;
            color: white;
        }
    </style>
</head>
<body>
    <div class="task-container">
        <h1>Edit Task</h1>

        <!-- Display success or error messages -->
        @if(session('success'))
            <div class="alert alert-success">
                {{ session('success') }}
            </div>
        @elseif(session('error'))
            <div class="alert alert-danger">
                {{ session('error') }}
            </div>
        @endif

        <div class="form-container">
            <form action="{{ route('tasks.update', $task->id) }}" method="POST">
                @csrf
                @method('PUT')  <!-- This tells Laravel it's an update request -->

                <div class="form-group">
                    <label for="title">Title:</label>
                    <input type="text" id="title" name="title" value="{{ old('title', $task->title) }}" required>
                </div>

                <div class="form-group">
                    <label for="description">Description:</label>
                    <textarea id="description" name="description" required>{{ old('description', $task->description) }}</textarea>
                </div>

                <div class="form-group">
                    <label for="color">Color:</label>
                    <input type="color" id="color" name="color" value="{{ old('color', $task->color) }}" required>
                </div>

                <div class="form-group">
                    <label for="priority">Priority:</label>
                    <select name="priority" id="priority" required>
                        <option value="Low" {{ old('priority', $task->priority) == 'Low' ? 'selected' : '' }}>Low</option>
                        <option value="Medium" {{ old('priority', $task->priority) == 'Medium' ? 'selected' : '' }}>Medium</option>
                        <option value="High" {{ old('priority', $task->priority) == 'High' ? 'selected' : '' }}>High</option>
                    </select>
                </div>

                <button type="submit" class="btn-submit">Update Task</button>
            </form>
        </div>

        <div class="form-container">
            <h2>Summary</h2>
            <h3>Daily Summary:</h3>
            <ul>
                @foreach ($tasksToday as $task)
                    <li>{{ $task->title }} - Priority: {{ $task->priority }} </li>
                @endforeach
            </ul>

            <h3>Weekly Summary:</h3>
            <ul>
                @foreach ($tasksThisWeek as $task)
                    <li>{{ $task->title }} - Priority: {{ $task->priority }} </li>
                @endforeach
            </ul>
        </div>
    </div>
</body>
</html>



