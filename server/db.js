const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
});

const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database');
    
    try {
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          phone VARCHAR(20),
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Users table initialized');
    } catch (tableError) {
      if (tableError.code === 'ER_OPTION_PREVENTS_STATEMENT') {
        console.log('Note: Database is read-only replica. Table should already exist.');
      } else {
        console.log('Note: Table may already exist or other error:', tableError.message);
      }
    }
    
    connection.release();
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

module.exports = { pool, initializeDatabase };
