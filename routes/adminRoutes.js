// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/authMiddleware');

router.use(isAdmin);

// Admin Dashboard
router.get('/dashboard', adminController.getDashboard);

// --- Student Routes (CRUD) ---
// GET all students
router.get('/students', adminController.getStudents);
// GET add student form
router.get('/students/add', adminController.getAddStudentForm);
// POST new student
router.post('/students/add', adminController.postAddStudent);
// GET edit student form
router.get('/students/edit/:id', adminController.getEditStudentForm);
// POST update student
router.post('/students/edit/:id', adminController.postEditStudent);
// GET delete student
router.get('/students/delete/:id', adminController.deleteStudent);

// (Yahan Classroom aur Exam routes baadme add karenge)
router.get('/classrooms', adminController.getClassrooms);
router.get('/classrooms/add', adminController.getAddClassroomForm);
router.post('/classrooms/add', adminController.postAddClassroom);
router.get('/classrooms/edit/:id', adminController.getEditClassroomForm);
router.post('/classrooms/edit/:id', adminController.postEditClassroom);
router.get('/classrooms/delete/:id', adminController.deleteClassroom);
module.exports = router;

// --- Exam Routes (CRUD) ---
router.get('/exams', adminController.getExams);
router.get('/exams/add', adminController.getAddExamForm);
router.post('/exams/add', adminController.postAddExam);
router.get('/exams/edit/:id', adminController.getEditExamForm);
router.post('/exams/edit/:id', adminController.postEditExam);
router.get('/exams/delete/:id', adminController.deleteExam);

// --- Seating Plan Routes (NAYE ROUTES) ---
router.get('/seating-plan', adminController.getSeatingPlanPage);
router.post('/seating-plan/generate', adminController.generateSeatingPlan);
router.post('/seating-plan/clear', adminController.clearSeatingPlan);

// Faculty Management
router.get('/faculty', adminController.getFacultyList); // <-- Ye hai link ka target
router.post('/faculty/toggle/:id', adminController.toggleFacultyAvailability);

// Invigilation Duty
router.get('/invigilation', adminController.getInvigilationPage);
router.post('/invigilation/generate', adminController.generateInvigilationDuties);
router.post('/invigilation/clear', adminController.clearInvigilationDuties);