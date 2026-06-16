const { processNaturalLanguageQuery } = require('../services/queryGenerator');
const { getSchemaDescription, getTableNames, getTableColumns } = require('../services/schemaService');
const { sendSuccess, sendError, sendValidationError } = require('../utils/response');

/**
 * POST /api/query
 * Convert natural language to SQL and execute
 */
const executeQuery = async (req, res, next) => {
  try {
    const { query } = req.body;

    // Validate input
    if (!query || typeof query !== 'string') {
      return sendValidationError(res, [{ field: 'query', message: 'Query must be a non-empty string' }]);
    }

    if (query.trim().length === 0) {
      return sendValidationError(res, [{ field: 'query', message: 'Query cannot be empty' }]);
    }

    // Process the query
    const result = await processNaturalLanguageQuery(query);

    if (!result.success) {
      return sendError(res, result.error || 'Failed to process query', 400);
    }

    sendSuccess(res, {
      naturalLanguageQuery: query,
      sql: result.sql,
      results: result.results,
      explanation: result.explanation,
      rowCount: result.results.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/schema
 * Get database schema information
 */
const getSchema = async (req, res, next) => {
  try {
    // Build a structured schema object: { tableName: { colName: colType, ... }, ... }
    const tables = await getTableNames();
    const schemaObj = {};
    for (const t of tables) {
      const cols = await getTableColumns(t);
      schemaObj[t] = {};
      cols.forEach((c) => {
        schemaObj[t][c.name] = c.type;
      });
    }

    sendSuccess(res, { schema: schemaObj });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  executeQuery,
  getSchema,
};
