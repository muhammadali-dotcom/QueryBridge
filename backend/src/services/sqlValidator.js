/**
 * SQL Validator - Ensures only safe SELECT queries are executed
 */

const DANGEROUS_KEYWORDS = ['DELETE', 'DROP', 'ALTER', 'INSERT', 'UPDATE', 'TRUNCATE', 'REPLACE', 'PRAGMA'];
const REQUIRED_KEYWORDS = ['SELECT'];

/**
 * Validate SQL query for safety
 * @param {string} sql - SQL query to validate
 * @returns {object} - { valid: boolean, error: string|null }
 */
const validateSQL = (sql) => {
  const trimmedSQL = sql.trim();

  // Check if SQL is empty
  if (!trimmedSQL) {
    return { valid: false, error: 'SQL query cannot be empty' };
  }

  // Convert to uppercase for checking (but preserve original for execution)
  const upperSQL = trimmedSQL.toUpperCase();

  // Check for dangerous keywords
  for (const keyword of DANGEROUS_KEYWORDS) {
    if (upperSQL.includes(keyword)) {
      return { valid: false, error: `${keyword} operations are not allowed` };
    }
  }

  // Check if it's a SELECT query
  if (!upperSQL.startsWith('SELECT')) {
    return { valid: false, error: 'Only SELECT queries are allowed' };
  }

  // Check for SQL comments that might hide malicious code
  if (upperSQL.includes('--') && upperSQL.includes(';')) {
    const beforeComment = upperSQL.substring(0, upperSQL.indexOf('--'));
    if (!beforeComment.toUpperCase().trim().startsWith('SELECT')) {
      return { valid: false, error: 'Suspicious SQL pattern detected' };
    }
  }

  // Basic check for multiple statements (semicolon separation)
  const statements = upperSQL.split(';').filter((s) => s.trim());
  if (statements.length > 1) {
    return { valid: false, error: 'Multiple SQL statements are not allowed' };
  }

  return { valid: true, error: null };
};

/**
 * Sanitize SQL query by removing dangerous patterns
 * @param {string} sql - SQL query to sanitize
 * @returns {string} - Sanitized SQL
 */
const sanitizeSQL = (sql) => {
  let sanitized = sql.trim();

  // Remove leading/trailing whitespace and comments
  sanitized = sanitized.replace(/^\s*--.*?\n/, ''); // Remove line comments at start
  sanitized = sanitized.replace(/;\s*$/, ''); // Remove trailing semicolon

  return sanitized;
};

/**
 * Extract table names from a SELECT query
 * @param {string} sql - SQL query
 * @returns {string[]} - Array of table names
 */
const extractTableNames = (sql) => {
  const upperSQL = sql.toUpperCase();
  const tables = [];

  // Match table names after FROM and JOIN keywords
  const patterns = [/FROM\s+(\w+)/g, /JOIN\s+(\w+)/g, /INNER\s+JOIN\s+(\w+)/g, /LEFT\s+JOIN\s+(\w+)/g];

  patterns.forEach((pattern) => {
    let match;
    // eslint-disable-next-line no-cond-assign
    while ((match = pattern.exec(upperSQL)) !== null) {
      tables.push(match[1].toLowerCase());
    }
  });

  return [...new Set(tables)]; // Remove duplicates
};

module.exports = {
  validateSQL,
  sanitizeSQL,
  extractTableNames,
};
