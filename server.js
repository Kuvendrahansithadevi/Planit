const dns = require('node:dns/promises');
dns.setServers(['8.8.8.8', '1.1.1.1']); 

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // ADDED: Required for sending HTML files
const authRoutes = require('./routes/auth');

const app = express();
const User = require('./models/User');
const Task = require('./models/Task');
const taskRoutes = require('./routes/tasks');


// --- Middlewares ---
app.use(cors());
app.use(express.json()); 
app.use(express.static('public')); 

// --- Routes ---
// This connects the logic from your routes/auth.js file
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// --- Home Route ---
// This ensures that when you go to http://localhost:5000, your login page shows up
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html')); 
});

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI, {
    family: 4 
})
.then(() => console.log("✅ FINALLY! Connected to MongoDB Atlas."))
.catch(err => {
    console.log("❌ Connection Error Detail:");
    console.error(err.message);
});

// --- Start Server ---
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});