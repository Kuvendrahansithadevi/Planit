const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },  
    title: {
        type: String,
        required: [true, 'Task title is required'],
        trim: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    dueDate: {
        type: Date
    },
    reminderTime: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// FIX: Update 'updatedAt' without using 'next'
// Mongoose handles this automatically for synchronous hooks
taskSchema.pre('save', function() {
    this.updatedAt = Date.now();
});

module.exports = mongoose.model('Task', taskSchema);