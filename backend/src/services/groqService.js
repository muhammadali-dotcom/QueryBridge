const { GROQ_API_KEY } = require('../config/env');

/**
 * Guarded Groq service. This file dynamically requires `groq-sdk` only when
 * a `GROQ_API_KEY` is present. If the SDK is not installed or a key is missing,
 * the functions will throw helpful errors.
 */

const ensureClient = () => {
  if (!GROQ_API_KEY) {
    throw new Error('Groq API key not configured (GROQ_API_KEY)');
  }

  let Groq;
  try {
    Groq = require('groq-sdk');
  } catch (err) {
    throw new Error('groq-sdk is not installed. Run `npm install groq-sdk` in the backend folder');
  }

  return new Groq({ apiKey: GROQ_API_KEY });
};

const generateSQL = async (naturalLanguageQuery, schemaDescription) => {
  const groq = ensureClient();

  const systemPrompt = `You are an expert SQL query generator. ONLY produce safe SELECT queries using the schema below.\n\nDatabase Schema:\n${schemaDescription}`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    temperature: 0.3,
    max_tokens: 1024,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Convert to SQL: "${naturalLanguageQuery}"` },
    ],
  });

  const sql = response && response.choices && response.choices[0] && response.choices[0].message
    ? response.choices[0].message.content.trim()
    : '';

  if (!sql) throw new Error('Groq returned empty response');
  return sql;
};

const getQueryExplanation = async (sqlQuery) => {
  const groq = ensureClient();

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    temperature: 0.5,
    max_tokens: 256,
    messages: [{ role: 'user', content: `Explain briefly: ${sqlQuery}` }],
  });

  return response && response.choices && response.choices[0] && response.choices[0].message
    ? response.choices[0].message.content.trim()
    : '';
};

module.exports = {
  generateSQL,
  getQueryExplanation,
};
