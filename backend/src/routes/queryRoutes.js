const express = require('express');
const { executeQuery, getSchema } = require('../controllers/queryController');

const router = express.Router();

/**
 * POST /api/query
 * Convert natural language to SQL and execute
 */
router.post('/query', executeQuery);

/**
 * GET /api/schema
 * Get database schema
 */
router.get('/schema', getSchema);

module.exports = router;
