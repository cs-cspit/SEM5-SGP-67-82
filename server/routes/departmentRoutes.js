import express from 'express';
import {
  getAllDepartments,
  createDepartment
} from '../controllers/departmentController.js';

const router = express.Router();

// GET /api/departments - Get all departments
router.get('/', getAllDepartments);

// POST /api/departments - Create new department
router.post('/', createDepartment);

export default router;
