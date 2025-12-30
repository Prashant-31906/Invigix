// models/Exam.js
const db = require('../config/db');

const Exam = {};

Exam.create = (subject_name, subject_code, course, semester, exam_date, start_time) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO exams (subject_name, subject_code, course, semester, exam_date, start_time) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [subject_name, subject_code, course, semester, exam_date, start_time], (err, results) => {
      if (err) return reject(err);
      resolve(results.insertId);
    });
  });
};

Exam.getAll = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM exams ORDER BY exam_date DESC';
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

Exam.getById = (id) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM exams WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

Exam.updateById = (id, subject_name, subject_code, course, semester, exam_date, start_time) => {
   return new Promise((resolve, reject) => {
     const query = 'UPDATE exams SET subject_name = ?, subject_code = ?, course = ?, semester = ?, exam_date = ?, start_time = ? WHERE id = ?';
     db.query(query, [subject_name, subject_code, course, semester, exam_date, start_time, id], (err, results) => {
       if (err) return reject(err);
       resolve(results.affectedRows);
     });
   });
};

Exam.deleteById = (id) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM exams WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results.affectedRows);
    });
  });
};

Exam.getByDateTime = (date, time) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM exams WHERE exam_date = ? AND start_time = ?';
    db.query(query, [date, time], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports = Exam;