import express from 'express';
import {
  getDashboardStats,
  getRecentActivities,
  quickApproveAttendance,
  getTodayAttendanceSummary
} from '../controllers/dashboardController.js';

const router = express.Router();

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', getDashboardStats);

// GET /api/dashboard/activities - Get recent activities
router.get('/activities', getRecentActivities);

// POST /api/dashboard/quick-approve - Quick approve attendance from dashboard
router.post('/quick-approve', quickApproveAttendance);

// GET /api/dashboard/attendance-summary - Get today's attendance summary with auto-absent option
router.get('/attendance-summary', getTodayAttendanceSummary);

export default router;
