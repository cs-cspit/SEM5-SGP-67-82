import express from 'express';
import {
  getDashboardStats,
  getRecentActivities
} from '../controllers/dashboardController.js';

const router = express.Router();

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', getDashboardStats);

// GET /api/dashboard/activities - Get recent activities
router.get('/activities', getRecentActivities);

export default router;
