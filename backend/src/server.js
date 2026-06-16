const app = require('./app');
const { PORT } = require('./config/env');
const { initializeSchema } = require('./database/schema');
const { seedDatabase } = require('./database/seed');

const startServer = () => {
  // Initialize database on startup
  console.log('Initializing database...');
  initializeSchema();

  setTimeout(() => {
    console.log('Seeding database...');
    seedDatabase();

    // Start server after DB is ready
    setTimeout(() => {
      app.listen(PORT, () => {
        console.log(`\n✅ QueryBridge Backend running on port ${PORT}`);
        console.log(`📡 API available at http://localhost:${PORT}/api`);
        console.log(`🏥 Health check: http://localhost:${PORT}/health\n`);
      });
    }, 1000);
  }, 1000);
};

startServer();
