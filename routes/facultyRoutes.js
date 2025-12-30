// routes/facultyRoutes.js
const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');
const { isFaculty } = require('../middleware/authMiddleware'); // Faculty middleware

// Saare faculty routes 'isFaculty' se protect honge
router.use(isFaculty);

// Faculty Dashboard
router.get('/dashboard', facultyController.getFacultyDashboard);

// Availability update
router.post('/availability/toggle', facultyController.toggleAvailability);

module.exports = router;