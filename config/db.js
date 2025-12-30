// config/db.js
const mysql = require('mysql2');
require('dotenv').config(); // Local testing ke liye

const pool = mysql.createPool({
  host: process.env.DB_HOST,       // Render se aayega
  user: process.env.DB_USERNAME,       // Render se aayega
  password: process.env.DB_PASSWORD, // Render se aayega
  database: process.env.DB_NAME,   // Render se aayega
  port: process.env.DB_PORT || 4000, // TiDB ka default port 4000 hota hai
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  }
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection fail ho gayi:', err);
  } else {
    console.log('TiDB Cloud Database Connected Successfully!');
    connection.release();
  }
});

module.exports = pool;