const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // '_id' is automatically created by MongoDB as an ObjectId
    name: {
        type: String,
        required: [true, 'User name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'User email is required'],
        unique: true, // Unique constraint
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    createdAt: {
        type: Date,
        default: Date.now // Account creation date
    }
});

module.exports = mongoose.model('User', userSchema);