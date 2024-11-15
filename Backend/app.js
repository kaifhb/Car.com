// app.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: "./config/config.env" });

// Import Routes
const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');

// Initialize Express App
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', authRoutes);
app.use('/api/cars', carRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the Car Management API');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1); // Exit process with failure
});

// Define Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
