const db = require('../config/db');

const initializeSchema = () => {
  db.serialize(() => {
    // Create customers table
    db.run(`
      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        age INTEGER,
        city TEXT,
        phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create drivers table
    db.run(`
      CREATE TABLE IF NOT EXISTS drivers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        total_jobs INTEGER DEFAULT 0,
        rating REAL DEFAULT 0,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create jobs table
    db.run(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER NOT NULL,
        driver_id INTEGER,
        pickup_location TEXT NOT NULL,
        dropoff_location TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        distance_km REAL,
        estimated_fare REAL,
        completed_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id),
        FOREIGN KEY (driver_id) REFERENCES drivers(id)
      )
    `);

    // Create bookings table
    db.run(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER NOT NULL,
        driver_id INTEGER,
        booking_date DATE NOT NULL,
        status TEXT DEFAULT 'confirmed',
        cancelled_at DATETIME,
        completed_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id),
        FOREIGN KEY (driver_id) REFERENCES drivers(id)
      )
    `);

    console.log('Database schema initialized successfully');
  });
};

module.exports = { initializeSchema };
