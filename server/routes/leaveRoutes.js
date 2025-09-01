import express from 'express';
import {
  createLeaveRequest,
  getAllLeaves,
  getEmployeeLeaves,
  updateLeaveStatus,
  getLeaveStats,
  deleteLeaveRequest
} from '../controllers/leaveController.js';

const router = express.Router();

// POST /api/leaves - Create a new leave request
router.post('/', createLeaveRequest);

// GET /api/leaves - Get all leave requests with optional filters
router.get('/', getAllLeaves);

// GET /api/leaves/stats - Get leave statistics
router.get('/stats', getLeaveStats);

// GET /api/leaves/employee/:employeeId - Get leave requests for specific employee
router.get('/employee/:employeeId', getEmployeeLeaves);

// PUT /api/leaves/:id/status - Update leave request status (approve/reject)
router.put('/:id/status', updateLeaveStatus);

// DELETE /api/leaves/:id - Delete leave request
router.delete('/:id', deleteLeaveRequest);

export default router;
