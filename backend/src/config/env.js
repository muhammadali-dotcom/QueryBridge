require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  DB_PATH: process.env.DB_PATH || './database/querybridge.sqlite',
};
