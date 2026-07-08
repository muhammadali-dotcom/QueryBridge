const app = require('./app');
const { PORT } = require('./config/env');
const { initializeSchema } = require('./database/schema');
const { seedDatabase } = require('./database/seed');

const startServer = async () => {
  try {
    console.log('Initializing database schema...');
    await new Promise((resolve, reject) => {
      initializeSchema();
      // Give schema a tick to complete serialize queue
      setImmediate(resolve);
    });

    console.log('Seeding database...');
    await new Promise((resolve, reject) => {
      seedDatabase();
      setImmediate(resolve);
    });

    app.listen(PORT, () => {
      console.log(`\n✅ QueryBridge Backend running on port ${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health\n`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
