import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardLayout from "./Layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import LeaveManagement from "./pages/LeaveManagement";
import EmployeeDirectory from "./pages/EmployeeDirectory";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Landing page - public route */}
      <Route path="/" element={<LandingPage />} />

      {/* Dashboard routes - protected */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="leave-management" element={<LeaveManagement />} />
        <Route path="employee-directory" element={<EmployeeDirectory />} />
      </Route>

      {/* Redirect old routes to new structure */}
      <Route
        path="/attendance"
        element={<Navigate to="/dashboard/attendance" replace />}
      />
      <Route
        path="/leave-management"
        element={<Navigate to="/dashboard/leave-management" replace />}
      />
      <Route
        path="/employee-directory"
        element={<Navigate to="/dashboard/employee-directory" replace />}
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
