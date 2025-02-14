import pkg from "pg"; // Import the entire 'pg' package
const { Pool } = pkg; // Destructure 'Pool' from the package
import { env } from "./env.config.js"; // Import your environment variables

// Create a new connection pool using the environment configuration
const pool = new Pool({
  user: env.db.username,       // Database username
  host: env.db.host,           // Database host
  database: env.db.database,   // Database name
  password: env.db.password,   // Database password
  port: env.db.port,           // Database port (default for PostgreSQL is 5432)
  ssl: env.db.ssl || false,    // Enable SSL if required (optional)
});

// Test the connection to ensure the database is reachable
(async () => {
  try {
    await pool.query("SELECT 1"); // Simple query to test connection
    console.log("Connected to the PostgreSQL database successfully.");
  } catch (err) {
    console.error("Error connecting to the PostgreSQL database:", err.message);
    process.exit(1); // Exit the process if the connection fails
  }
})();

// Export the pool to be used for executing raw SQL queries in other parts of your app
export default pool;
