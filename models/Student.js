// models/Student.js
const db = require('../config/db');

const Student = {};

// Naya Student Add karna
Student.create = (roll_no, name, course, semester) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO students (roll_no, name, course, semester) VALUES (?, ?, ?, ?)';
    db.query(query, [roll_no, name, course, semester], (err, results) => {
      if (err) return reject(err);
      resolve(results.insertId);
    });
  });
};

// Saare Students ko fetch karna
Student.getAll = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM students ORDER BY roll_no ASC';
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Ek Student ko ID se fetch karna
Student.getById = (id) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM students WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

// Student ko Update karna
Student.updateById = (id, roll_no, name, course, semester) => {
   return new Promise((resolve, reject) => {
     const query = 'UPDATE students SET roll_no = ?, name = ?, course = ?, semester = ? WHERE id = ?';
     db.query(query, [roll_no, name, course, semester, id], (err, results) => {
       if (err) return reject(err);
       resolve(results.affectedRows);
     });
   });
};

// Student ko Delete karna
Student.deleteById = (id) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM students WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results.affectedRows);
    });
  });
};


// Course aur Semester se students fetch karna
Student.getByCourseAndSemester = (course, semester) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT id, roll_no, name FROM students WHERE course = ? AND semester = ?';
    db.query(query, [course, semester], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports = Student;