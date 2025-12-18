const express = require('express');
const { markAttendance, getTodayAttendance, getSummary } = require('../controllers/attendance.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/mark', markAttendance); // Public or device-authenticated
router.get('/today', protect, getTodayAttendance);
router.get('/summary', getSummary);

module.exports = router;
