const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find().populate('project').sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single task
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('project');
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new task
router.post('/', async (req, res) => {
    const task = new Task({
        title: req.body.title,
        description: req.body.description,
        color: req.body.color,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
        elapsed_time: req.body.elapsed_time,
        status: req.body.status,
        project: req.body.projectId || null
    });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a task
router.put('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (req.body.title != null) task.title = req.body.title;
        if (req.body.description != null) task.description = req.body.description;
        if (req.body.color != null) task.color = req.body.color;
        if (req.body.start_time != null) task.start_time = req.body.start_time;
        if (req.body.end_time != null) task.end_time = req.body.end_time;
        if (req.body.elapsed_time != null) task.elapsed_time = req.body.elapsed_time;
        if (req.body.status != null) task.status = req.body.status;
        if (req.body.projectId !== undefined) task.project = req.body.projectId || null;

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a task
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        await task.deleteOne();
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
