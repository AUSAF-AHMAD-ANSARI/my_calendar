const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Add this import
const eventRoutes = require("./routes/eventRoutes");
const goalRoutes = require("./routes/goalRoutes");
const taskRoutes = require("./routes/taskRoutes"); // Add this import

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Routes
app.use("/api/events", eventRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/tasks", taskRoutes); // Add tasks routes

// Connect to MongoDB
require("./config/db")();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});