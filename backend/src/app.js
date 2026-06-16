const express = require('express');
const cors = require('cors');
const queryRoutes = require('./routes/queryRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', queryRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'QueryBridge backend is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
