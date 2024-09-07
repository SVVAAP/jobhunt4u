// backend/server.js or app.js
const express = require('express');
const cors = require('cors');
const admin = require('./config/firebaseAdmin'); // Path to your Firebase Admin setup
const userRoutes = require('./routes/userRoutes'); // Ensure you have the correct path

const app = express();

// Middleware
app.use(cors()); // Allow CORS for all routes
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
