// models/SeatingPlan.js
const db = require('../config/db');

const SeatingPlan = {};

// Bulk me poora seating plan insert karna
SeatingPlan.createBulk = (planData) => {
  // planData ek array of arrays hoga: [[student_id, exam_id, classroom_id, seat_number], ...]
  return new Promise((resolve, reject) => {
    if (planData.length === 0) {
      return resolve(); // Kuch insert karne ke liye hai hi nahi
    }
    const query = 'INSERT INTO seating_plan (student_id, exam_id, classroom_id, seat_number) VALUES ?';
    db.query(query, [planData], (err, results) => {
      if (err) return reject(err);
      resolve(results.affectedRows);
    });
  });
};

// Date aur Time ke basis par existing plan fetch karna (display ke liye)
SeatingPlan.getPlanByDateTime = (date, time) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        s.name AS student_name,
        s.roll_no,
        e.subject_name,
        c.room_number,
        sp.seat_number
      FROM seating_plan sp
      JOIN students s ON sp.student_id = s.id
      JOIN classrooms c ON sp.classroom_id = c.id
      JOIN exams e ON sp.exam_id = e.id
      WHERE e.exam_date = ? AND e.start_time = ?
      ORDER BY c.room_number, sp.seat_number;
    `;
    db.query(query, [date, time], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Naya plan generate karne se pehle purana plan delete karna
SeatingPlan.deleteByDateTime = async (date, time) => {
  // Pehle us date/time ke exam IDs find karo
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

  // Ab un exam IDs se related seating plan delete karo
  return new Promise((resolve, reject) => {
    const deleteQuery = 'DELETE FROM seating_plan WHERE exam_id IN (?)';
    db.query(deleteQuery, [examIds], (err, results) => {
      if (err) return reject(err);
      resolve(results.affectedRows);
    });
  });
};


SeatingPlan.getUsedClassroomsByDateTime = (date, time) => {
  return new Promise((resolve, reject) => {
    // Uniqe classroom IDs fetch karo jo seating plan me use hui hain
    const query = `
      SELECT DISTINCT sp.classroom_id
      FROM seating_plan sp
      JOIN exams e ON sp.exam_id = e.id
      WHERE e.exam_date = ? AND e.start_time = ?;
    `;
    db.query(query, [date, time], (err, results) => {
      if (err) return reject(err);
      resolve(results.map(r => r.classroom_id)); // [1, 3, 5]
    });
  });
};

module.exports = SeatingPlan;