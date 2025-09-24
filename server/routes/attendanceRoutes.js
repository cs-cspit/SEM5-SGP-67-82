import express from 'express';
import {
  markAttendance,
  getAttendance,
  getTodayAttendance,
  getAttendanceStats,
  updateAttendance,
  getPendingAttendance,
  approveAttendance,
  checkIn,
  checkOut,
  getEmployeeAttendance,
  markAbsentEmployees,
  getEnhancedAttendance,
  getSalaryReport
} from '../controllers/attendanceController.js';

const router = express.Router();

// POST /api/attendance - Mark attendance
router.post('/', markAttendance);

// POST /api/attendance/checkin - Check-in
router.post('/checkin', checkIn);

// POST /api/attendance/checkout - Check-out
router.post('/checkout', checkOut);

// GET /api/attendance - Get attendance records
router.get('/', getAttendance);

// GET /api/attendance/stats - Get attendance statistics
router.get('/stats', getAttendanceStats);

// GET /api/attendance/pending - Get pending attendance requests
router.get('/pending', getPendingAttendance);

// GET /api/attendance/today/:employeeId - Check today's attendance
router.get('/today/:employeeId', getTodayAttendance);

// GET /api/attendance/employee/:employeeId - Get employee attendance
router.get('/employee/:employeeId', getEmployeeAttendance);

// PUT /api/attendance/:id/approve - Approve or reject attendance
router.put('/:id/approve', approveAttendance);

// PUT /api/attendance/:id - Update attendance record
router.put('/:id', updateAttendance);

// POST /api/attendance/mark-absent - Mark all unmarked employees as absent
router.post('/mark-absent', markAbsentEmployees);

// GET /api/attendance/enhanced - Get enhanced attendance records
router.get('/enhanced', getEnhancedAttendance);

// GET /api/attendance/salary-report - Get salary report for a month
router.get('/salary-report', getSalaryReport);

export default router;
