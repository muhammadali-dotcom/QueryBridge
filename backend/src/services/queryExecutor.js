const db = require('../config/db');

/**
 * Execute a validated SQL query and return results
 * @param {string} sql - Validated SQL query
 * @returns {Promise<object>} - { success: boolean, data: array, error: string|null }
 */
const executeQuery = (sql) => {
  return new Promise((resolve) => {
    db.all(sql, (err, rows) => {
      if (err) {
        console.error('Query execution error:', err.message);
        resolve({
          success: false,
          data: null,
          error: `Database error: ${err.message}`,
        });
      } else {
        resolve({
          success: true,
          data: rows || [],
          error: null,
        });
      }
    });
  });
};

/**
 * Execute a query with row limit for safety
 * @param {string} sql - SQL query
 * @param {number} limit - Maximum rows to return (default: 1000)
 * @returns {Promise<object>} - Query results
 */
const executeQueryWithLimit = async (sql, limit = 1000) => {
  // Add LIMIT clause if not present
  let limitedSQL = sql.trim();
  const upperSQL = limitedSQL.toUpperCase();

  if (!upperSQL.includes('LIMIT')) {
    limitedSQL += ` LIMIT ${limit}`;
  }

  return executeQuery(limitedSQL);
};

/**
 * Get query execution statistics
 * @param {string} sql - SQL query
 * @returns {Promise<object>} - { executionTime: number, rowCount: number }
 */
const getQueryStats = async (sql) => {
  const startTime = Date.now();
  const result = await executeQuery(sql);
  const executionTime = Date.now() - startTime;

  return {
    executionTime,
    rowCount: result.success ? result.data.length : 0,
    hasError: !result.success,
  };
};

module.exports = {
  executeQuery,
  executeQueryWithLimit,
  getQueryStats,
};
