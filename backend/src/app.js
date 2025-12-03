// src/app.js
const express = require('express');
const cors = require('cors');

// --- Route Imports ---
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const feedbackRoutes = require('./routes/feedback.routes');
const mediaRoutes = require('./routes/media.routes');
const settingsRoutes = require("./routes/settings.routes");
const subscriberRoutes = require("./routes/subscriber.routes"); // ✅ Correct path

const app = express();

// --- Middleware ---
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
app.use('/admin', authRoutes);      
app.use('/api/posts', postRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/settings', settingsRoutes);
app.use("/api/subscribers", subscriberRoutes); // ✅ Route enabled

// --- Health Check ---
app.get('/health', (req, res) => res.json({ ok: true }));

// --- Error Handler ---
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err); // Improved logging
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

module.exports = app;