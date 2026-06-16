const db = require('../config/db');

/**
 * Get all table names from the database
 * @returns {Promise<string[]>} - Array of table names
 */
const getTableNames = () => {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'",
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows.map((row) => row.name));
      }
    );
  });
};

/**
 * Get column information for a specific table
 * @param {string} tableName - Name of the table
 * @returns {Promise<object[]>} - Array of column objects with name and type
 */
const getTableColumns = (tableName) => {
  return new Promise((resolve, reject) => {
    db.all(`PRAGMA table_info(${tableName})`, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

/**
 * Get complete schema description for AI processing
 * @returns {Promise<string>} - Formatted schema description
 */
const getSchemaDescription = async () => {
  try {
    const tableNames = await getTableNames();
    let schemaDescription = 'Database Schema:\n\n';

    for (const tableName of tableNames) {
      const columns = await getTableColumns(tableName);
      schemaDescription += `Table: ${tableName}\n`;
      schemaDescription += 'Columns:\n';

      columns.forEach((col) => {
        schemaDescription += `  - ${col.name} (${col.type})${col.notnull ? ' NOT NULL' : ''}${col.pk ? ' PRIMARY KEY' : ''}\n`;
      });

      schemaDescription += '\n';
    }

    return schemaDescription;
  } catch (error) {
    console.error('Schema retrieval error:', error.message);
    throw new Error(`Failed to retrieve schema: ${error.message}`);
  }
};

/**
 * Get sample data from a table (for context)
 * @param {string} tableName - Name of the table
 * @param {number} limit - Number of rows to fetch
 * @returns {Promise<object[]>} - Array of sample records
 */
const getTableSample = (tableName, limit = 5) => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM ${tableName} LIMIT ?`, [limit], (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

module.exports = {
  getTableNames,
  getTableColumns,
  getSchemaDescription,
  getTableSample,
};

