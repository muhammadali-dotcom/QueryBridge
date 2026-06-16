const db = require("../config/db");

const seedDatabase = () => {
  db.serialize(() => {
    // Clear existing data
    db.run("DELETE FROM bookings");
    db.run("DELETE FROM jobs");
    db.run("DELETE FROM drivers");
    db.run("DELETE FROM customers");

    // Insert dummy customers
    const customers = [
      {
        name: "Alice Johnson",
        email: "alice@example.com",
        age: 28,
        city: "New York",
        phone: "555-0001",
      },
      {
        name: "Bob Smith",
        email: "bob@example.com",
        age: 35,
        city: "Los Angeles",
        phone: "555-0002",
      },
      {
        name: "Carol White",
        email: "carol@example.com",
        age: 42,
        city: "Chicago",
        phone: "555-0003",
      },
      {
        name: "David Brown",
        email: "david@example.com",
        age: 31,
        city: "Houston",
        phone: "555-0004",
      },
      {
        name: "Emma Davis",
        email: "emma@example.com",
        age: 25,
        city: "Phoenix",
        phone: "555-0005",
      },
      {
        name: "Frank Miller",
        email: "frank@example.com",
        age: 38,
        city: "Philadelphia",
        phone: "555-0006",
      },
      {
        name: "Grace Lee",
        email: "grace@example.com",
        age: 29,
        city: "San Antonio",
        phone: "555-0007",
      },
      {
        name: "Henry Wilson",
        email: "henry@example.com",
        age: 45,
        city: "San Diego",
        phone: "555-0008",
      },
      {
        name: "Isabella Martinez",
        email: "isabella@example.com",
        age: 33,
        city: "Dallas",
        phone: "555-0009",
      },
      {
        name: "Jack Anderson",
        email: "jack@example.com",
        age: 27,
        city: "San Jose",
        phone: "555-0010",
      },
    ];

    customers.forEach((customer) => {
      db.run(
        "INSERT INTO customers (name, email, age, city, phone) VALUES (?, ?, ?, ?, ?)",
        [
          customer.name,
          customer.email,
          customer.age,
          customer.city,
          customer.phone,
        ],
      );
    });

    // Insert dummy drivers
    const drivers = [
      {
        name: "Tom Harris",
        email: "tom@driver.com",
        phone: "555-1001",
        total_jobs: 125,
        rating: 4.8,
        status: "active",
      },
      {
        name: "Lisa Taylor",
        email: "lisa@driver.com",
        phone: "555-1002",
        total_jobs: 98,
        rating: 4.6,
        status: "active",
      },
      {
        name: "Mike Thompson",
        email: "mike@driver.com",
        phone: "555-1003",
        total_jobs: 156,
        rating: 4.9,
        status: "active",
      },
      {
        name: "Sarah Garcia",
        email: "sarah@driver.com",
        phone: "555-1004",
        total_jobs: 87,
        rating: 4.7,
        status: "active",
      },
      {
        name: "Chris Rodriguez",
        email: "chris@driver.com",
        phone: "555-1005",
        total_jobs: 201,
        rating: 4.5,
        status: "active",
      },
      {
        name: "Jessica Martinez",
        email: "jessica@driver.com",
        phone: "555-1006",
        total_jobs: 142,
        rating: 4.8,
        status: "inactive",
      },
      {
        name: "Ryan Lee",
        email: "ryan@driver.com",
        phone: "555-1007",
        total_jobs: 73,
        rating: 4.4,
        status: "active",
      },
      {
        name: "Angela White",
        email: "angela@driver.com",
        phone: "555-1008",
        total_jobs: 189,
        rating: 4.6,
        status: "active",
      },
    ];

    drivers.forEach((driver) => {
      db.run(
        "INSERT INTO drivers (name, email, phone, total_jobs, rating, status) VALUES (?, ?, ?, ?, ?, ?)",
        [
          driver.name,
          driver.email,
          driver.phone,
          driver.total_jobs,
          driver.rating,
          driver.status,
        ],
      );
    });

    // Insert dummy jobs
    const jobs = [
      {
        customer_id: 1,
        driver_id: 1,
        pickup: "Central Park, NYC",
        dropoff: "Times Square, NYC",
        status: "completed",
        distance: 2.5,
        fare: 18.5,
      },
      {
        customer_id: 2,
        driver_id: 2,
        pickup: "LAX Airport",
        dropoff: "Downtown LA",
        status: "completed",
        distance: 35.2,
        fare: 87.5,
      },
      {
        customer_id: 3,
        driver_id: 3,
        pickup: "Chicago Union Station",
        dropoff: "Navy Pier",
        status: "completed",
        distance: 8.4,
        fare: 32.0,
      },
      {
        customer_id: 4,
        driver_id: 1,
        pickup: "Houston Downtown",
        dropoff: "Houston Airport",
        status: "completed",
        distance: 22.5,
        fare: 65.0,
      },
      {
        customer_id: 5,
        driver_id: 4,
        pickup: "Phoenix City Center",
        dropoff: "Tempe",
        status: "in_progress",
        distance: 15.0,
        fare: 52.0,
      },
      {
        customer_id: 6,
        driver_id: 5,
        pickup: "Philadelphia Zoo",
        dropoff: "Center City",
        status: "completed",
        distance: 12.8,
        fare: 45.0,
      },
      {
        customer_id: 7,
        driver_id: 2,
        pickup: "San Antonio Riverwalk",
        dropoff: "Airport",
        status: "pending",
        distance: 18.0,
        fare: 58.0,
      },
      {
        customer_id: 8,
        driver_id: 3,
        pickup: "San Diego Zoo",
        dropoff: "Gaslamp Quarter",
        status: "completed",
        distance: 10.2,
        fare: 38.5,
      },
      {
        customer_id: 9,
        driver_id: 7,
        pickup: "Dallas Downtown",
        dropoff: "DFW Airport",
        status: "completed",
        distance: 28.0,
        fare: 72.0,
      },
      {
        customer_id: 10,
        driver_id: 8,
        pickup: "San Jose Downtown",
        dropoff: "Silicon Valley",
        status: "completed",
        distance: 20.5,
        fare: 61.5,
      },
      {
        customer_id: 1,
        driver_id: 4,
        pickup: "Central Park",
        dropoff: "Grand Central",
        status: "completed",
        distance: 1.2,
        fare: 12.0,
      },
      {
        customer_id: 2,
        driver_id: 3,
        pickup: "Santa Monica Beach",
        dropoff: "Beverly Hills",
        status: "completed",
        distance: 25.3,
        fare: 72.0,
      },
    ];

    jobs.forEach((job) => {
      db.run(
        "INSERT INTO jobs (customer_id, driver_id, pickup_location, dropoff_location, status, distance_km, estimated_fare) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          job.customer_id,
          job.driver_id,
          job.pickup,
          job.dropoff,
          job.status,
          job.distance,
          job.fare,
        ],
      );
    });

    // Insert dummy bookings
    const bookings = [
      {
        customer_id: 1,
        driver_id: 1,
        booking_date: "2024-06-10",
        status: "confirmed",
      },
      {
        customer_id: 2,
        driver_id: 2,
        booking_date: "2024-06-12",
        status: "confirmed",
      },
      {
        customer_id: 3,
        driver_id: 3,
        booking_date: "2024-06-13",
        status: "cancelled",
      },
      {
        customer_id: 4,
        driver_id: 1,
        booking_date: "2024-06-14",
        status: "confirmed",
      },
      {
        customer_id: 5,
        driver_id: 4,
        booking_date: "2024-06-15",
        status: "confirmed",
      },
      {
        customer_id: 6,
        driver_id: 5,
        booking_date: "2024-06-09",
        status: "confirmed",
      },
      {
        customer_id: 7,
        driver_id: 2,
        booking_date: "2024-06-11",
        status: "cancelled",
      },
      {
        customer_id: 8,
        driver_id: 3,
        booking_date: "2024-06-16",
        status: "confirmed",
      },
      {
        customer_id: 9,
        driver_id: 7,
        booking_date: "2024-06-08",
        status: "confirmed",
      },
      {
        customer_id: 10,
        driver_id: 8,
        booking_date: "2024-06-16",
        status: "confirmed",
      },
      {
        customer_id: 1,
        driver_id: 4,
        booking_date: "2024-06-16",
        status: "cancelled",
      },
      {
        customer_id: 3,
        driver_id: 1,
        booking_date: "2024-06-16",
        status: "confirmed",
      },
    ];

    bookings.forEach((booking) => {
      db.run(
        "INSERT INTO bookings (customer_id, driver_id, booking_date, status) VALUES (?, ?, ?, ?)",
        [
          booking.customer_id,
          booking.driver_id,
          booking.booking_date,
          booking.status,
        ],
      );
    });

    console.log("Database seeded successfully with dummy data");
  });
};

module.exports = { seedDatabase };
