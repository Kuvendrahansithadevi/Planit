const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// 1. ADD TASK
router.post('/add', async (req, res) => {
    try {
        const { userId, title, dueDate, priority } = req.body;
        if (!userId || userId === "undefined") {
            return res.status(400).json({ error: "User ID is missing." });
        }

        const newTask = new Task({
            userId,
            title,
            dueDate,
            priority: priority || 'medium',
            status: 'pending'
        });

        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. GET TASKS
router.get('/:userId', async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.params.userId });
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. TOGGLE STATUS (✔ / ↩)
router.patch('/:taskId/toggle', async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        if (!task) return res.status(404).json({ error: "Task not found" });

        task.status = task.status === 'pending' ? 'completed' : 'pending';
        await task.save();
        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. EDIT TASK (Title, Priority, and DueDate update kosam)
router.put('/:taskId', async (req, res) => {
    try {
        // Ikkada anni fields collect cheyali req.body nundi
        const { title, priority, dueDate } = req.body; 

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.taskId, 
            { 
                title, 
                priority, 
                dueDate 
            }, // Ee fields anni database lo update avthayi
            { new: true }
        );

        if (!updatedTask) return res.status(404).json({ error: "Task not found" });
        
        res.status(200).json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. DELETE TASK (🗑️)
router.delete('/:taskId', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.taskId);
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;