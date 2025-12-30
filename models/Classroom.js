// models/Classroom.js
const db = require('../config/db');

const Classroom = {};

Classroom.create = (room_number, capacity) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO classrooms (room_number, capacity) VALUES (?, ?)';
    db.query(query, [room_number, capacity], (err, results) => {
      if (err) return reject(err);
      resolve(results.insertId);
    });
  });
};

Classroom.getAll = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM classrooms ORDER BY room_number ASC';
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

Classroom.getById = (id) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM classrooms WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

Classroom.updateById = (id, room_number, capacity) => {
   return new Promise((resolve, reject) => {
     const query = 'UPDATE classrooms SET room_number = ?, capacity = ? WHERE id = ?';
     db.query(query, [room_number, capacity, id], (err, results) => {
       if (err) return reject(err);
       resolve(results.affectedRows);
     });
   });
};

Classroom.deleteById = (id) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM classrooms WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results.affectedRows);
    });
  });
};

module.exports = Classroom;