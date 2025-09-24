# Port Configuration

## Application Ports

| Application                          | Port   | URL                     | Description                                                          |
| ------------------------------------ | ------ | ----------------------- | -------------------------------------------------------------------- |
| **Backend Server & Employee Portal** | `5000` | `http://localhost:5000` | Express server with API endpoints and employee portal                |
| **HR/Admin Portal (React App)**      | `5173` | `http://localhost:5173` | React-based HR dashboard for attendance and leave management         |
| **Owner Portal (Separate)**          | `3000` | `http://localhost:3000` | Completely separate owner portal for high-level management functions |

## Quick Start Commands

### Start Backend Server (Port 5000)

```bash
cd server
npm start
```

**Access:**

- API: `http://localhost:5000/api/`
- Employee Portal: `http://localhost:5000/employee-portal/`

### Start HR/Admin Portal (Port 5173)

```bash
cd client
npm run dev
```

**Access:** `http://localhost:5173`

### Start Owner Portal (Port 3000)

```bash
cd client
npm run start
```

**Access:** `http://localhost:3000`

### Start All Applications

```bash
# From root directory
npm run dev
```

## Port Details

### Backend Server (Port 5000)

- Express server with MongoDB connection
- Serves API endpoints for:
  - Employee management
  - Attendance tracking
  - Dashboard data
  - Reports and analytics
- Static file serving for employee portal

### HR/Admin Portal (Port 5173)

- React application built with Vite (default port)
- HR/Admin dashboard for:
  - Employee directory management
  - Attendance reports and management
  - Leave management and approval
  - Daily attendance tracking
- Makes API calls to backend server on port 5000

### Owner Portal (Port 3000)

- Completely separate React application
- Owner-level dashboard for:
  - High-level salary reports
  - Executive summaries
  - Business analytics
  - Strategic decision making
- Independent access with no cross-navigation

## CORS Configuration

The backend server is configured to accept requests from:

- `http://localhost:5173` (HR/Admin Portal)
- `http://localhost:3000` (Owner Portal)
- `http://localhost:5000` (Employee Portal)

## Development Workflow

1. Start backend server: `npm run server` (Terminal 1)
2. Start HR/Admin portal: `npm run dev` in client folder (Terminal 2) - Port 5173
3. Start Owner portal: `npm run start` in client folder (Terminal 3) - Port 3000
4. Access applications:
   - Employee Portal: `http://localhost:5000/employee-portal/`
   - HR/Admin Portal: `http://localhost:5173`
   - Owner Portal: `http://localhost:3000` (separate access)
   - API endpoints: `http://localhost:5000/api/`
