// models/InvigilationDuty.js
const db = require('../config/db');

const InvigilationDuty = {};

// Bulk me duties insert karna
InvigilationDuty.createBulk = (dutyData) => {
  // dutyData = [[faculty_id, exam_id, classroom_id, duty_date], ...]
  return new Promise((resolve, reject) => {
    if (dutyData.length === 0) {
      return resolve();
    }
    const query = 'INSERT INTO invigilation_duties (faculty_id, exam_id, classroom_id, duty_date) VALUES ?';
    db.query(query, [dutyData], (err, results) => {
      if (err) return reject(err);
      resolve(results.affectedRows);
    });
  });
};

// Admin ke liye: Date/Time se saari duties fetch karna
InvigilationDuty.getByDateTime = (date, time) => {
  return new Promise((resolve, reject) => {
    // Query ko update kiya hai (IFNULL function add kiya hai)
    const query = `
      SELECT 
        IFNULL(u.name, u.username) AS faculty_name, 
        u.department,
        c.room_number,
        e.subject_code,
        e.exam_date
      FROM invigilation_duties id
      JOIN users u ON id.faculty_id = u.id
      JOIN classrooms c ON id.classroom_id = c.id
      JOIN exams e ON id.exam_id = e.id
      WHERE e.exam_date = ? AND e.start_time = ?
      ORDER BY c.room_number, u.name;
    `;
    db.query(query, [date, time], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Faculty ke liye: Sirf apni duties fetch karna
InvigilationDuty.getByFacultyId = (facultyId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        c.room_number,
        id.duty_date,
        e.start_time
      FROM invigilation_duties id
      JOIN classrooms c ON id.classroom_id = c.id
      JOIN exams e ON id.exam_id = e.id
      WHERE id.faculty_id = ?
      ORDER BY id.duty_date DESC, e.start_time;
    `;
    db.query(query, [facultyId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Purani duties delete karna (Date/Time ke basis par)
InvigilationDuty.deleteByDateTime = async (date, time) => {
  // Pehle exam IDs find karo
  const examIds = await new Promise((resolve, reject) => {
    const examQuery = 'SELECT id FROM exams WHERE exam_date = ? AND start_time = ?';
    db.query(examQuery, [date, time], (err, exams) => {
      if (err) return reject(err);
      resolve(exams.map(e => e.id));
    });
  });

  if (examIds.length === 0) {
    return 0; // Kuch delete nahi karna
  }

  // Ab un IDs se related duties delete karo
  return new Promise((resolve, reject) => {
    const deleteQuery = 'DELETE FROM invigilation_duties WHERE exam_id IN (?)';
    db.query(deleteQuery, [examIds], (err, results) => {
      if (err) return reject(err);
      resolve(results.affectedRows);
    });
  });
};

module.exports = InvigilationDuty;