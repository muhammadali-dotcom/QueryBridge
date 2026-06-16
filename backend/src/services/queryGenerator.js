const { getSchemaDescription, getTableNames } = require('./schemaService');
const { validateSQL, sanitizeSQL } = require('./sqlValidator');
const { executeQueryWithLimit } = require('./queryExecutor');
const { GROQ_API_KEY } = require('../config/env');

/**
 * Convert natural language query to SQL and execute it
 * @param {string} naturalLanguageQuery - User's question in natural language
 * @returns {Promise<object>} - { success: boolean, sql: string, results: array, explanation: string, error: string|null }
 */
const processNaturalLanguageQuery = async (naturalLanguageQuery) => {
  try {
    // Step 1: Get database schema
    const schema = await getSchemaDescription();

    // Step 2: Generate SQL
    let generatedSQL = null;

    if (GROQ_API_KEY) {
      // Lazy-load Groq service only when API key is configured
      const { generateSQL: _generateSQL } = require('./groqService');
      generatedSQL = await _generateSQL(naturalLanguageQuery, schema);
    } else {
      // Fallback heuristic when no AI key is configured: pick first table and return a simple select
      const tables = await getTableNames();
      const table = tables && tables.length ? tables[0] : null;
      if (!table) {
        return {
          success: false,
          sql: null,
          results: null,
          explanation: null,
          error: 'No database tables available to generate a query',
        };
      }

      generatedSQL = `SELECT * FROM ${table} LIMIT 10`;
    }

    // Step 3: Clean common AI wrappers (code fences, leading 'sql' labels) then sanitize
    let cleanedGenerated = generatedSQL.replace(/```[a-zA-Z]*\n([\s\S]*?)```/gi, '$1');
    cleanedGenerated = cleanedGenerated.replace(/^\s*sql\s*[:\-]?\s*/i, '');
    const sanitizedSQL = sanitizeSQL(cleanedGenerated);

    // Step 4: Validate the sanitized SQL
    const validation = validateSQL(sanitizedSQL);
    if (!validation.valid) {
      // Log for debugging
      console.warn('Generated SQL failed validation:', validation.error);
      console.warn('Sanitized SQL:', sanitizedSQL);

      // Try to extract the first SELECT statement from the generated text
      const selectMatch = sanitizedSQL.match(/(SELECT[\s\S]*?)(;|$)/i);
      if (selectMatch && selectMatch[1]) {
        const extracted = selectMatch[1].trim();
        const revalidation = validateSQL(extracted);
        if (revalidation.valid) {
          // Use the extracted SELECT
          console.info('Using extracted SELECT statement from AI output.');
          // overwrite sanitizedSQL variable for execution
          // (note: keep a new variable to avoid const reassignment)
          var finalSQL = extracted;
        } else {
          return {
            success: false,
            sql: sanitizedSQL,
            results: null,
            explanation: null,
            error: validation.error,
          };
        }
      } else {
        return {
          success: false,
          sql: sanitizedSQL,
          results: null,
          explanation: null,
          error: validation.error,
        };
      }
    }


    // Step 5: Execute the query
    const sqlToRun = typeof finalSQL !== 'undefined' ? finalSQL : sanitizedSQL;
    const executionResult = await executeQueryWithLimit(sqlToRun);

    if (!executionResult.success) {
      return {
        success: false,
        sql: sanitizedSQL,
        results: null,
        explanation: null,
        error: executionResult.error,
      };
    }

    // Step 6: Get AI explanation if available
    let explanation = null;
    if (GROQ_API_KEY) {
      try {
        const { getQueryExplanation: _getQueryExplanation } = require('./groqService');
        explanation = await _getQueryExplanation(sanitizedSQL);
      } catch (err) {
        console.warn('Could not generate explanation:', err.message);
      }
    }

    return {
      success: true,
      sql: sqlToRun,
      results: executionResult.data,
      explanation,
      error: null,
    };
  } catch (error) {
    console.error('Query processing error:', error.message);
    return {
      success: false,
      sql: null,
      results: null,
      explanation: null,
      error: `Failed to process query: ${error.message}`,
    };
  }
};

module.exports = {
  processNaturalLanguageQuery,
};
