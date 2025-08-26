# Employee and Attendance Management System (EMS)

## 📋 Project Overview

A comprehensive web-based Employee and Attendance Management System designed to automate HR operations, track employee attendance in real-time, and calculate salaries based on working hours. The system provides seamless integration between employee self-service portals and administrative management interfaces.

### 🎯 Key Objectives

- Automate attendance tracking with GPS verification
- Provide real-time analytics and reporting
- Calculate daily wages based on attendance and working hours
- Enable employee self-service with admin approval workflows
- Ensure data accuracy with comprehensive validation

### 👥 Target Users

- **HR Administrators**: Complete system management and oversight
- **Employees**: Self-service attendance marking and status checking
- **Managers**: Department-wise monitoring and reporting

## 🚀 Core Features

### 1. Dashboard Module

- Real-time attendance statistics and analytics
- Interactive charts showing trends and patterns
- Quick approval/rejection of pending requests
- Department-wise attendance breakdown

### 2. Employee Directory

- Complete CRUD operations for employee records
- Advanced search and filtering capabilities
- Bulk operations and data export
- Employee profile management with salary details

### 3. Attendance Tracking

- Daily attendance with check-in/check-out timestamps
- Automatic salary calculation
- GPS-based location verification
- Manual admin override capabilities
- Auto-mark absent for unmarked employees

### 4. Employee Portal

- Self-service check-in/check-out with GPS verification
- Real-time attendance status display
- Attendance correction request submission
- Personal attendance history

### 5. Leave Management

- Leave request submission and approval workflow

### 6. Salary Reports

- Detailed breakdowns
- Monthly and custom period reports
- Export functionality (PDF/Excel)

## 🛠️ Technology Stack

### Frontend

- **React.js** (v19.1.0) - UI framework
- **Vite** (v7.0.3) - Build tool
- **Recharts** (v3.1.0) - Data visualization
- **React Router DOM** (v7.7.0) - Routing

### Backend

- **Node.js** (v18+) - Server runtime
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication
- **Bcrypt** - Password security

## 💻 System Requirements

### Hardware

- **Server**: 4GB RAM, 2 CPU cores, 50GB storage
- **Client**: Any device with modern web browser

### Software

- **OS**: Windows 10+, macOS 10.15+, Linux
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+
- **Node.js**: v18.0+
- **MongoDB**: v6.0+

## � Installation

### Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Configure MongoDB URI and JWT secret
npm start  # Runs on http://localhost:5000
```

### Frontend Setup

```bash
cd client
npm install
npm run dev  # Runs on http://localhost:5173
```

## 📊 System Workflow

### Employee Attendance Process

1. Employee logs into portal
2. GPS verification for location
3. Submit check-in/check-out request
4. Admin approval in dashboard
5. Real-time update across all modules
6. Automatic salary calculation

### Admin Management Flow

1. View pending requests in dashboard
2. Quick approve/reject with Present/Absent buttons
3. Auto-mark absent employees at day end
4. Generate and export reports

## 🔐 Security Features

- **JWT-based Authentication** with role-based access control
- **GPS Verification** for attendance location validation
- **Input Validation** and sanitization on client/server
- **Audit Trail** for all attendance modifications
- **Data Encryption** for sensitive information

## 📈 Business Benefits

### For Organizations

- Eliminate manual attendance tracking costs
- Improve accuracy and reduce human errors
- Automate salary calculations
- Ensure labor law compliance

### For Employees

- Convenient self-service attendance
- Best for on site workers and feild related work
- Transparent real-time status access
- Accurate salary calculations
- Easy attendance correction requests

## 📋 Project Status

### Completed Features ✅

- Employee Directory with full CRUD operations
- Dashboard with real-time analytics
- GPS-based employee portal check-in/check-out
- Admin approval workflow for attendance
- Automatic salary calculations with overtime
- Real-time data synchronization across modules

### Planned Features 📅

- Mobile application
- Third-party integrations
- Advanced security enhancements
- Cloud deployment

## 🧪 Testing & Quality

- **Unit Testing**: Component and function level testing
- **Integration Testing**: API and database testing
- **End-to-End Testing**: Complete workflow testing
- **Security Testing**: Vulnerability assessment

## 📚 Technical Documentation

### Database Schema

- **Employee**: Personal info, position, salary, hourly rates
- **Attendance**: Daily records, timestamps, status, calculations
- **Department**: Organizational structure
- **Leave**: Leave requests and approvals
