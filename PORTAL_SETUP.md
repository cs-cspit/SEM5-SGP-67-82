# Three Portal Setup Instructions

## 🚀 Quick Start Guide

### 1. Employee Portal (Port 5000)

```bash
cd server
npm start
```

**Access:** `http://localhost:5000/employee-portal/`
**Purpose:** Employee check-in/check-out, view attendance

### 2. HR/Admin Portal (Port 5173)

```bash
cd client
npm run dev
```

**Access:** `http://localhost:5173`
**Purpose:** HR management, attendance tracking, leave approval

### 3. Owner Portal (Port 3000)

```bash
cd client
npm run start
```

**Access:** `http://localhost:3000`
**Purpose:** High-level analytics, salary reports (Password: 09727)

## 🔧 Development Commands

### Start Individual Portals

```bash
# Employee Portal
npm run server

# HR/Admin Portal
npm run hr-admin

# Owner Portal
npm run owner-portal
```

### Start Multiple Portals

```bash
# Start Employee + HR/Admin portals
npm run dev

# Start all three portals
npm run dev-all
```

## 📋 Portal Overview

| Portal       | Port | URL                                      | Access          | Purpose              |
| ------------ | ---- | ---------------------------------------- | --------------- | -------------------- |
| **Employee** | 5000 | `http://localhost:5000/employee-portal/` | Employee Login  | Attendance tracking  |
| **HR/Admin** | 5173 | `http://localhost:5173`                  | HR Login        | Management dashboard |
| **Owner**    | 3000 | `http://localhost:3000`                  | Password: 09727 | Executive analytics  |

## 🔐 Authentication

- **Employee Portal**: Employee credentials
- **HR/Admin Portal**: HR/Admin credentials
- **Owner Portal**: Fixed password (09727)

## 🌐 Cross-Portal Navigation

- **No navigation** between Owner Portal and other portals
- Owner Portal is completely isolated
- HR/Admin Portal has no Owner Portal access
- Clean separation of concerns

## ✅ Setup Complete!

### Verification Steps

1. **Employee Portal**: `http://localhost:5000/employee-portal/` ✅
2. **HR/Admin Portal**: `http://localhost:5173` ✅
3. **Owner Portal**: `http://localhost:3000` ✅

### Key Changes Made

- ✅ Removed Owner Portal button from Landing Page
- ✅ Removed Owner Portal navigation from Sidebar
- ✅ Removed Owner Portal route from HR/Admin App
- ✅ Created separate OwnerApp component
- ✅ Port-based app loading in main.jsx
- ✅ Updated CORS configuration
- ✅ Configured separate port scripts

### Security

- Owner Portal completely isolated from HR/Admin portal
- No cross-navigation between portals
- Separate authentication systems
- Port-based access control
