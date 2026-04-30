@extends('layouts.app')

@section('content')
<style>
    body {
        background-color: #f3f0ff; /* soft lavender */
        color: #333;
        font-family: 'Segoe UI', sans-serif;
    }

    .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff; /* clean white card */
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    h1 {
        text-align: center;
        margin-bottom: 30px;
        color: #4a148c; /* deep purple */
    }

    label {
        font-weight: bold;
        margin-bottom: 6px;
    }

    .form-control {
        width: 100%;
        padding: 10px;
        margin-bottom: 20px;
        border: 1px solid #ccc;
        border-radius: 8px;
        background-color: #f9f9f9;
        color: #333;
    }

    .btn-primary {
        background-color: #6a1b9a;
        border: none;
        padding: 10px 20px;
        font-weight: bold;
        border-radius: 8px;
        color: white;
        transition: background-color 0.3s ease;
    }

    .btn-primary:hover {
        background-color: #4a148c;
    }

    .alert {
        padding: 12px;
        margin-bottom: 20px;
        border-radius: 6px;
    }

    .alert-danger {
        background-color: #ef5350;
        color: white;
    }

    .alert-success {
        background-color: #66bb6a;
        color: white;
    }

    select.form-control {
        width: 100%;
        padding: 10px;
        margin-bottom: 20px;
        border-radius: 8px;
    }
</style>

<div class="container">
    <h1>Create Task</h1>

    @if ($errors->any())
        <div class="alert alert-danger">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    @if (session('success'))
        <div class="alert alert-success">
            {{ session('success') }}
        </div>
    @endif

    <form action="{{ route('tasks.store') }}" method="POST">
        @csrf
        <div class="form-group">
            <label for="title">Task Title</label>
            <input type="text" name="title" class="form-control" required>
        </div>

        <div class="form-group">
            <label for="description">Description</label>
            <textarea name="description" class="form-control" required></textarea>
        </div>

        <div class="form-group">
            <label for="color">Color</label>
            <input type="color" name="color" class="form-control" required>
        </div>

        <!-- New Priority Field -->
        <div class="form-group">
            <label for="priority">Priority</label>
            <select name="priority" class="form-control" required>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>
        </div>

        <!-- New Summary Field -->
        <div class="form-group">
            <label for="summary">Summary</label>
            <textarea name="summary" class="form-control" required></textarea>
        </div>

        <button type="submit" class="btn btn-primary">Create Task</button>
    </form>
</div>
@endsection








