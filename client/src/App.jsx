import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./Layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import LeaveManagement from "./pages/LeaveManagement";
import EmployeeDirectory from "./pages/EmployeeDirectory";
import SalaryReport from "./pages/SalaryReport";

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="leave-management" element={<LeaveManagement />} />
        <Route path="employee-directory" element={<EmployeeDirectory />} />
        <Route path="salary-report" element={<SalaryReport />} />
      </Route>
    </Routes>
  );
}

export default App;
