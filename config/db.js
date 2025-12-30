// config/db.js
const mysql = require('mysql2');

// 'createConnection' ki jagah hum 'createPool' use karenge
// Ye automatically connections manage karega taaki "Closed State" error na aaye
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',      // Aapka MySQL username
  password: 'prashant123@',      // Aapka MySQL password
  database: 'ems_db',
  waitForConnections: true,
  connectionLimit: 10, // Ek baar me max 10 connections
  queueLimit: 0
});

// Pool check karne ke liye (Optional, bas tasalli ke liye)
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection fail ho gayi: ' + err.stack);
  } else {
    console.log('MySQL Database Connected Successfully (via Pool).');
    connection.release(); // Connection wapas pool me bhej do
  }
});

module.exports = pool;