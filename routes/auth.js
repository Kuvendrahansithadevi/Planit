const express = require('express');
const router = express.Router();
const User = require('../models/User');

// SIGNUP: Handles saving new users to MongoDB Atlas
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json({ message: "Account created successfully!" });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: "Email already exists!" });
        }
        res.status(500).json({ error: err.message });
    }
});

// LOGIN: Verifies user credentials against the database
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        res.status(200).json({ message: "Login successful!", userName: user.name });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;