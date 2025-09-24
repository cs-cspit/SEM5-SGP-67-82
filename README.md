# 🏢 Employee and Attendance Management System (EMS)

## 📋 Project Overview

A comprehensive full-stack web application designed to automate employee attendance tracking, HR operations, and salary management. The system features **three distinct portals** serving different user types with GPS-based attendance verification, real-time analytics, and automated salary calculations.

### 🎯 Key Objectives

- **Automated Attendance Tracking** with GPS verification and real-time validation
- **Multi-Portal Architecture** serving employees, HR admins, and business owners
- **Real-Time Analytics** with interactive dashboards and reporting
- **Automated Salary Calculations** based on daily attendance and working hours
- **Self-Service Employee Portal** with approval workflows and status tracking
- **Data Integrity** with comprehensive validation and audit trails

### 👥 Target Users & Access Levels

- **🔵 Employees**: Self-service attendance marking, status checking, leave requests
- **🟢 HR Administrators**: Complete employee management, attendance oversight, approvals
- **🟡 Business Owners**: Executive analytics, salary reports, high-level insights

---

## 🚀 Three-Portal Architecture

### 🔵 Employee Portal (Port 5000)

**Access**: `http://localhost:5000/employee-portal/`

**Features:**

- **GPS-Based Check-In/Out** with location verification
- **Real-Time Status Display** showing current attendance
- **Personal Attendance History** with monthly summaries
- **Attendance Correction Requests** with admin approval workflow
- **Leave Request Submission** with status tracking
- **Mobile-Friendly Interface** optimized for field workers

### 🟢 HR/Admin Portal (Port 5173)

**Access**: `http://localhost:5173`

**Features:**

- **Employee Directory Management** with full CRUD operations
- **Real-Time Attendance Dashboard** with analytics and charts
- **Quick Approval System** for attendance requests and corrections
- **Department-wise Reporting** with filtering and export
- **Leave Management** with approval workflows
- **Automated Absent Marking** for unmarked employees
- **Advanced Search & Filtering** across all employee data

### 🟡 Owner Portal (Port 3000)

**Access**: `http://localhost:3000` | **Password**: `09727`

**Features:**

- **Executive Salary Reports** with detailed breakdowns
- **High-Level Analytics** and business insights
- **Monthly Financial Summaries** with trend analysis
- **Department Cost Analysis** and budget tracking
- **Export Capabilities** (PDF/Excel) for financial reporting
- **Completely Isolated Access** from other portals

---

## 🛠️ Technology Stack

### Frontend Technologies

- **React.js** (v19.1.0) - Modern UI library with hooks
- **Vite** (v7.0.3) - Fast build tool and dev server
- **React Router DOM** (v7.7.0) - Client-side routing
- **Recharts** (v3.1.0) - Data visualization charts
- **Tailwind CSS** (v3.4.17) - Utility-first CSS framework
- **Framer Motion** (v12.23.6) - Animation library
- **Lucide React** - Modern icon library

### Backend Technologies

- **Node.js** (v18+) - JavaScript runtime environment
- **Express.js** (v5.1.0) - Web application framework
- **MongoDB** (v6.0+) - NoSQL database
- **Mongoose** (v8.17.0) - MongoDB object modeling
- **JWT** (v9.0.2) - JSON Web Token authentication
- **Bcrypt.js** (v3.0.2) - Password hashing
- **CORS** (v2.8.5) - Cross-origin resource sharing

### Development Tools

- **Nodemon** (v3.1.10) - Auto-restart development server
- **Concurrently** (v8.2.2) - Run multiple scripts simultaneously
- **ESLint** (v9.30.1) - Code linting and quality
- **Dotenv** (v17.2.1) - Environment variable management

---

## 💻 System Requirements

### Hardware Requirements

- **Server**: 4GB RAM minimum, 2 CPU cores, 50GB storage
- **Client**: Any device with modern web browser
- **Network**: Stable internet connection for GPS verification

### Software Requirements

- **Operating System**: Windows 10+, macOS 10.15+, Linux Ubuntu 20.04+
- **Web Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Node.js**: v18.0+ (LTS recommended)
- **MongoDB**: v6.0+ (Community or Atlas)
- **Git**: v2.0+ for version control

---

## 🚀 Quick Start Guide

### 📦 Prerequisites Installation

1. **Install Node.js**: Download from [nodejs.org](https://nodejs.org/)
2. **Install MongoDB**:
   - Local: [MongoDB Community](https://www.mongodb.com/try/download/community)
   - Cloud: [MongoDB Atlas](https://www.mongodb.com/atlas) (recommended)
3. **Clone Repository**:
   ```bash
   git clone <repository-url>
   cd SGP3-Employee-and-Attendance-management
   ```

### 🔧 One-Command Setup

```bash
# Install all dependencies for root, server, and client
npm run install-all
```

### ⚡ Start All Portals

```bash
# Option 1: Start all three portals simultaneously
npm run dev-all

# Option 2: Start Employee + HR/Admin portals only
npm run dev
```

### 🎯 Individual Portal Commands

```bash
# Backend Server + Employee Portal (Port 5000)
npm run server

# HR/Admin Portal (Port 5173)
npm run hr-admin

# Owner Portal (Port 3000)
npm run owner-portal
```

---

## 🔗 Portal Access URLs

| Portal                 | Port | URL                                      | Authentication       |
| ---------------------- | ---- | ---------------------------------------- | -------------------- |
| **🔵 Employee Portal** | 5000 | `http://localhost:5000/employee-portal/` | Employee Credentials |
| **🟢 HR/Admin Portal** | 5173 | `http://localhost:5173`                  | HR/Admin Credentials |
| **🟡 Owner Portal**    | 3000 | `http://localhost:3000`                  | Password: `09727`    |
| **🔌 API Endpoints**   | 5000 | `http://localhost:5000/api/`             | JWT Tokens           |

---

## 📂 Project Structure

```
📦 SGP3-Employee-and-Attendance-management
├── 📁 server/                    # Backend Express.js application
│   ├── 📁 config/               # Database and environment config
│   ├── 📁 controllers/          # Business logic controllers
│   ├── 📁 models/               # MongoDB data models
│   ├── 📁 routes/               # API route definitions
│   ├── 📁 middleware/           # Authentication & validation
│   ├── 📁 scripts/              # Data seeding scripts
│   └── server.js                # Main server entry point
├── 📁 client/                   # React.js frontend applications
│   ├── 📁 src/                  # React source code
│   │   ├── 📁 components/       # Reusable UI components
│   │   ├── 📁 pages/            # Page components
│   │   ├── 📁 utils/            # Helper functions
│   │   ├── App.jsx              # HR/Admin app (port 5173)
│   │   └── OwnerApp.jsx         # Owner app (port 3000)
│   └── package.json             # Frontend dependencies
├── 📁 employee-portal/          # Static employee portal
│   ├── index.html               # Employee portal interface
│   ├── script.js                # GPS & attendance logic
│   └── styles.css               # Portal styling
└── 📁 shared/                   # Shared utilities and constants
```

---

## 🔧 Environment Configuration

### 1. Server Environment Setup

Create `server/.env` file:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/employee_attendance_db
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/employee_attendance_db

# Server Configuration
PORT=5000
NODE_ENV=development

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_characters
JWT_EXPIRE=7d

# CORS Origins (for production)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:5000
```

### 2. Database Setup Options

**Option A: Local MongoDB**

```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod

# Create database (auto-created on first connection)
```

**Option B: MongoDB Atlas (Recommended)**

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create new cluster
3. Get connection string
4. Add to `MONGODB_URI` in `.env`

---

## 📊 Core Features & Functionality

### 🎯 Attendance Management

- **GPS-Based Verification**: Ensures employees check-in from correct locations
- **Real-Time Tracking**: Live updates across all portals
- **Automatic Calculations**: Daily salary = present days × hourly rate × 10
- **Correction Workflow**: Employee requests → Admin approval
- **Auto-Absent Marking**: Unmarked employees automatically marked absent

### 👥 Employee Directory

- **Complete CRUD Operations**: Create, Read, Update, Delete employees
- **Advanced Search**: Filter by name, department, position, status
- **Bulk Operations**: Mass updates and data export
- **Profile Management**: Comprehensive employee information
- **Salary Management**: Hourly rates and payment calculations

### 📈 Dashboard Analytics

- **Real-Time Statistics**: Live attendance counts and percentages
- **Interactive Charts**: Visual trends and patterns
- **Department Breakdown**: Team-wise attendance analysis
- **Quick Actions**: One-click approve/reject buttons
- **Performance Metrics**: Monthly and daily summaries

### 📱 Self-Service Portal

- **Mobile Optimized**: Perfect for field workers and on-site staff
- **GPS Integration**: Location verification for attendance
- **Status Tracking**: Real-time attendance and approval status
- **History Access**: Personal attendance records and summaries
- **Request System**: Attendance corrections and leave requests

### 📋 Reporting System

- **Executive Reports**: High-level salary and cost analysis
- **Detailed Breakdowns**: Individual and department reports
- **Multiple Formats**: PDF, Excel, CSV export options
- **Custom Periods**: Date range selection and filtering
- **Automated Generation**: Scheduled and on-demand reports

---

## 🔐 Security & Authentication

### Authentication System

- **JWT-Based Authentication**: Secure token-based login system
- **Role-Based Access Control**: Different permissions for each user type
- **Password Encryption**: Bcrypt hashing for secure password storage
- **Session Management**: Automatic token refresh and expiration

### Security Features

- **GPS Verification**: Location-based attendance validation
- **Input Validation**: Client-side and server-side data validation
- **SQL Injection Prevention**: Mongoose ODM protection
- **XSS Protection**: Input sanitization and output encoding
- **CORS Configuration**: Controlled cross-origin requests
- **Audit Trails**: Complete logging of all attendance modifications

### Privacy & Compliance

- **Data Encryption**: Sensitive data encryption at rest and in transit
- **Access Logging**: User action tracking and monitoring
- **Data Backup**: Regular database backups and recovery
- **GDPR Compliance**: Data protection and user rights

---

## 🌐 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

```http
POST /api/auth/login          # User login
POST /api/auth/register       # User registration
POST /api/auth/refresh        # Token refresh
POST /api/auth/logout         # User logout
```

### Employee Management

```http
GET    /api/employees         # Get all employees
POST   /api/employees         # Create new employee
GET    /api/employees/:id     # Get employee by ID
PUT    /api/employees/:id     # Update employee
DELETE /api/employees/:id     # Delete employee
```

### Attendance Management

```http
GET    /api/attendance        # Get attendance records
POST   /api/attendance        # Create attendance record
PUT    /api/attendance/:id    # Update attendance
DELETE /api/attendance/:id    # Delete attendance record
GET    /api/attendance/today  # Today's attendance
```

### Dashboard & Reports

```http
GET    /api/dashboard/stats   # Dashboard statistics
GET    /api/dashboard/charts  # Chart data
GET    /api/reports/salary    # Salary reports
GET    /api/reports/export    # Export reports
```

---

## 🧪 Testing & Development

### Development Commands

```bash
# Development with auto-restart
cd server && npm run dev

# Frontend development mode
cd client && npm run dev

# Run all tests
npm test

# Code linting
npm run lint

# Build for production
cd client && npm run build
```

### Testing Strategies

- **Unit Testing**: Component and function level testing
- **Integration Testing**: API endpoint testing
- **End-to-End Testing**: Complete user workflow testing
- **Security Testing**: Vulnerability assessment and penetration testing

### Development Tools

- **Hot Reload**: Automatic code reloading during development
- **Error Boundaries**: React error handling and reporting
- **Debug Mode**: Detailed logging and error messages
- **Performance Monitoring**: Bundle analysis and optimization

---

## 🚀 Deployment Guide

### Production Build

```bash
# Build frontend
cd client && npm run build

# Start production server
cd server && npm start
```

### Environment Setup

1. **Production Environment Variables**:

   ```env
   NODE_ENV=production
   MONGODB_URI=<production-mongodb-url>
   JWT_SECRET=<secure-production-secret>
   PORT=5000
   ```

2. **Server Configuration**:

   - Configure reverse proxy (Nginx/Apache)
   - Set up SSL certificates
   - Configure firewall rules
   - Set up monitoring and logging

3. **Database Configuration**:
   - MongoDB Atlas cluster setup
   - Connection pooling configuration
   - Backup and recovery procedures
   - Performance optimization

### Deployment Options

- **Cloud Platforms**: AWS, Azure, Google Cloud, DigitalOcean
- **Container Deployment**: Docker, Kubernetes
- **Serverless**: Vercel, Netlify (frontend), AWS Lambda (backend)
- **Traditional Hosting**: VPS, dedicated servers

---

## 📈 Performance & Optimization

### Frontend Optimization

- **Code Splitting**: Lazy loading of route components
- **Bundle Optimization**: Tree shaking and minification
- **Image Optimization**: Compressed and responsive images
- **Caching Strategy**: Browser and service worker caching

### Backend Optimization

- **Database Indexing**: Optimized MongoDB queries
- **Connection Pooling**: Efficient database connections
- **Response Compression**: Gzip compression for API responses
- **Caching Layer**: Redis for session and data caching

### Monitoring & Analytics

- **Performance Metrics**: Response time and throughput monitoring
- **Error Tracking**: Automated error reporting and alerts
- **User Analytics**: Usage patterns and behavior tracking
- **System Health**: Resource utilization and availability monitoring

---

## 🤝 Contributing Guidelines

### Development Workflow

1. **Fork Repository**: Create personal fork
2. **Create Branch**: Feature or bug fix branch
3. **Make Changes**: Follow coding standards
4. **Test Changes**: Run all tests and checks
5. **Submit PR**: Detailed pull request description

### Coding Standards

- **JavaScript**: ES6+ syntax with consistent formatting
- **React**: Functional components with hooks
- **CSS**: Tailwind CSS utility classes
- **API**: RESTful design principles
- **Database**: Normalized schema design

### Code Review Process

- **Peer Review**: At least one reviewer approval
- **Automated Checks**: Linting, testing, security scans
- **Documentation**: Update documentation for new features
- **Testing**: Comprehensive test coverage

---

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**

```bash
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution**: Ensure MongoDB is running or check connection string

**2. Port Already in Use**

```bash
Error: listen EADDRINUSE :::5000
```

**Solution**: Kill process on port or use different port

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <process-id> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

**3. GPS Permission Denied**

```bash
GeolocationPositionError: User denied geolocation
```

**Solution**: Enable location access in browser settings

**4. CORS Issues**

```bash
Access to fetch blocked by CORS policy
```

**Solution**: Check CORS configuration in server.js

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm run dev

# Check server logs
tail -f server/logs/app.log

# Monitor network requests
# Use browser DevTools Network tab
```

### Performance Issues

- **Slow Database Queries**: Check MongoDB indexes
- **Large Bundle Size**: Analyze with `npm run build --analyze`
- **Memory Leaks**: Use browser DevTools Performance tab
- **Network Issues**: Check API response times

---

## 📚 Additional Resources

### Documentation Links

- [React.js Documentation](https://reactjs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide)
- [MongoDB Manual](https://docs.mongodb.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Community & Support

- **Issues**: GitHub Issues for bug reports
- **Discussions**: GitHub Discussions for questions
- **Wiki**: Detailed technical documentation
- **Changelog**: Release notes and updates

### Learning Resources

- **Tutorials**: Step-by-step implementation guides
- **Video Courses**: Complete development walkthrough
- **Code Examples**: Sample implementations and patterns
- **Best Practices**: Industry standards and conventions

---

## 📄 License & Copyright

### License Information

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Third-Party Licenses

- React.js: MIT License
- Express.js: MIT License
- MongoDB: SSPL License
- Tailwind CSS: MIT License

### Usage Rights

- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ❌ Liability and warranty not provided

---

## 🎯 Project Roadmap

### Phase 1: Core Features ✅

- ✅ Employee directory management
- ✅ GPS-based attendance tracking
- ✅ Real-time dashboard analytics
- ✅ Multi-portal architecture
- ✅ Automated salary calculations

### Phase 2: Advanced Features 🚧

- 🔄 Mobile application development
- 🔄 Advanced reporting and analytics
- 🔄 Integration with payroll systems
- 🔄 Multi-location support
- 🔄 Biometric authentication

### Phase 3: Enterprise Features 📅

- 📅 Cloud deployment and scaling
- 📅 Advanced security enhancements
- 📅 Third-party integrations (Slack, Teams)
- 📅 Machine learning insights
- 📅 Compliance and audit features

---

## 👥 Development Team

### Core Contributors

- **Project Lead**: System architecture and full-stack development
- **Frontend Developer**: React.js UI/UX implementation
- **Backend Developer**: Node.js API and database design
- **DevOps Engineer**: Deployment and infrastructure

### Acknowledgments

- MongoDB Community for excellent documentation
- React.js team for powerful frontend framework
- Express.js contributors for robust backend framework
- Open source community for invaluable tools and libraries

---

## 📞 Contact & Support

### Getting Help

- **Documentation**: Check this README and project wiki
- **Issues**: Open GitHub issue for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact development team for urgent issues

### Project Information

- **Repository**: [GitHub Repository Link]
- **Demo**: [Live Demo Link]
- **Documentation**: [Wiki Link]
- **Releases**: [Releases Page Link]

---

_This Employee and Attendance Management System (EMS) is designed to streamline HR operations, improve accuracy in attendance tracking, and provide comprehensive insights for better business decision-making. Built with modern technologies and best practices, it offers a scalable solution for organizations of all sizes._

**🚀 Ready to get started? Run `npm run install-all && npm run dev-all` and visit the portals!**
