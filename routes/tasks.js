const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET all tasks for a specific user
router.get('/:userId', async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.params.userId }).sort({ dueDate: 1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADD a new task
router.post('/add', async (req, res) => {
    try {
        const newTask = new Task(req.body); // Uses your exact schema fields
        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a task
router.delete('/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// TOGGLE status between pending and completed
router.patch('/:id/toggle', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        task.status = task.status === 'pending' ? 'completed' : 'pending';
        await task.save(); // This triggers your 'pre-save' updatedAt logic
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;