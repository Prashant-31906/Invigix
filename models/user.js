// models/User.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {};

// Naya User banana (Registration)
User.create = async (username, password, role) => {
  // Password hash karo
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    // Pool query callback style use karta hai
    db.query(query, [username, hashedPassword, role], (err, results) => {
      if (err) return reject(err);
      resolve(results.insertId);
    });
  });
};

// User ko find karna (Login)
User.findByUsername = (username) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
      if (err) return reject(err);
      
      // Check karo ki results array hai aur khali nahi hai
      if (!results || results.length === 0) {
        return resolve(null);
      }
      
      resolve(results[0]); // Pehla user return karo
    });
  });
};

// Module 3 ke liye: Saari Faculty fetch karna
User.getAllFaculty = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT id, username, name, email, department, availability_status FROM users WHERE role = 'faculty' ORDER BY name ASC";
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Module 3 ke liye: Available Faculty fetch karna
User.getAvailableFaculty = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT id FROM users WHERE role = 'faculty' AND availability_status = true";
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Module 3 ke liye: Availability toggle karna
User.toggleAvailability = (userId, status) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE users SET availability_status = ? WHERE id = ?';
    db.query(query, [status, userId], (err, results) => {
      if (err) return reject(err);
      resolve(results.affectedRows);
    });
  });
};

module.exports = User;