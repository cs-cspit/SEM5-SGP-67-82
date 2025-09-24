import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';
import employeeRoutes from './routes/employeeRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
connectDB();

const app = express();

// Configure CORS to allow employee portal (5000), HR/Admin portal (5173), and owner portal (3000)
app.use(cors({
  origin: [
    'http://localhost:5173', // HR/Admin Portal (default Vite port)
    'http://localhost:3000', // Owner Portal (separate)
    'http://localhost:5000'  // Employee Portal
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); // Increased limit for face images

// Serve static files from employee-portal directory
app.use('/employee-portal', express.static(path.join(__dirname, '../employee-portal')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);

// Root route
app.get('/', (req, res) => {

  if(req.path === '/' || req.path === '/http://localhost:5000')
  {
  res.redirect('/employee-portal');
  }

});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Employee Portal available at: http://localhost:${PORT}/employee-portal`);
});
