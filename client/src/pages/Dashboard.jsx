// client/src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Calendar,
  Sun,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

import "./Dashboard.css";

const API_BASE_URL = "http://localhost:5000/api";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    attendanceToday: { present: 0, absent: 0 },
    pendingLeaves: 0,
    departmentStats: [],
    attendanceTrend: [],
  });
  const [loading, setLoading] = useState(true);
  const [pendingAttendance, setPendingAttendance] = useState([]);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
      if (!response.ok) throw new Error("Failed to fetch dashboard stats");
      const data = await response.json();
      console.log("Dashboard data received:", data); // Debug log

      // Verify total calculation
      const activeCount = data.employeeStatusBreakdown?.active || 0;
      const onLeaveCount = data.employeeStatusBreakdown?.onLeave || 0;
      const calculatedTotal = activeCount + onLeaveCount;
      console.log(
        `Frontend verification: Active(${activeCount}) + OnLeave(${onLeaveCount}) = ${calculatedTotal}, API Total: ${data.totalEmployees}`
      );

      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Keep default empty values on error
    }
  };

  // Fetch pending attendance requests
  const fetchPendingAttendance = async () => {
    try {
      console.log("Fetching pending attendance..."); // Debug log
      const response = await fetch(`${API_BASE_URL}/attendance/pending`);
      if (response.ok) {
        const data = await response.json();
        console.log("Pending attendance data:", data); // Debug log
        setPendingAttendance(data);
      } else {
        console.error("Failed to fetch pending attendance:", response.status);
      }
    } catch (error) {
      console.error("Error fetching pending attendance:", error);
    }
  };

  // Handle attendance approval/rejection
  const handleAttendanceAction = async (attendanceId, action, employeeName) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/attendance/${attendanceId}/approve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action, // 'approve' or 'reject'
            status: action === "approve" ? "Present" : "Absent",
          }),
        }
      );

      if (response.ok) {
        // Remove from pending list
        setPendingAttendance((prev) =>
          prev.filter((item) => item._id !== attendanceId)
        );

        // Show success message
        alert(
          action === "approve"
            ? `✅ ${employeeName}'s attendance has been approved and marked as Present!`
            : `❌ ${employeeName}'s attendance has been rejected and marked as Absent!`
        );

        // Refresh dashboard data
        fetchDashboardStats();
      } else {
        alert(`❌ Failed to ${action} attendance. Please try again.`);
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
      alert(`❌ Error occurred while ${action}ing attendance.`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchDashboardStats(), fetchPendingAttendance()]);
      setLoading(false);
    };
    fetchData();

    // Poll for pending attendance every 30 seconds
    const interval = setInterval(fetchPendingAttendance, 30000);
    return () => clearInterval(interval);
  }, []);

  // Transform data for stats cards
  const stats = [
    {
      title: "Total Employees",
      value: dashboardData.totalEmployees.toString(),
      icon: Users,
      type: "total",
    },
    {
      title: "Present Today",
      value: dashboardData.attendanceToday.present.toString(),
      icon: UserCheck,
      type: "present",
    },
    {
      title: "Absent Today",
      value: dashboardData.attendanceToday.absent.toString(),
      icon: UserX,
      type: "absent",
    },
    {
      title: "On Leave Today",
      value: (dashboardData.attendanceToday.onLeave || 0).toString(),
      icon: Calendar,
      type: "leave",
    },
  ];

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-container">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <div>Loading dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-content">
            <h1 className="welcome-title">Hello HR!</h1>
            <p className="welcome-subtitle">
              Here's what's happening with your team today
            </p>
            <div className="welcome-stats">
              <div className="welcome-stat">
                <div className="welcome-stat-value">
                  {dashboardData.totalEmployees > 0
                    ? (
                        (dashboardData.attendanceToday.present /
                          dashboardData.totalEmployees) *
                        100
                      ).toFixed(1)
                    : "0"}
                  %
                </div>
                <div className="welcome-stat-label">Present Rate</div>
              </div>
              <div className="welcome-stat">
                <div className="welcome-stat-value">
                  {dashboardData.totalEmployees > 0
                    ? (
                        100 -
                        (dashboardData.attendanceToday.present /
                          dashboardData.totalEmployees) *
                          100
                      ).toFixed(1)
                    : "0"}
                  %
                </div>
                <div className="welcome-stat-label">Absent Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Attendance Requests Section */}
        <div className="pending-attendance-section">
          <div className="pending-header">
            <div className="pending-title-wrapper">
              <AlertCircle className="pending-icon" />
              <h3 className="pending-title">
                Pending Attendance Requests ({pendingAttendance.length})
              </h3>
            </div>
          </div>

          {pendingAttendance.length > 0 ? (
            <div className="pending-list">
              {pendingAttendance.map((attendance) => (
                <div key={attendance._id} className="pending-item">
                  <div className="employee-info">
                    <div className="employee-avatar">
                      {attendance.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="employee-details">
                      <h4 className="employee-name">{attendance.name}</h4>
                      <p className="employee-meta">
                        {attendance.employeeId} • {attendance.department}
                      </p>
                      <div className="attendance-meta">
                        <Clock className="meta-icon" />
                        <span>{attendance.checkIn}</span>
                        <span className="separator">•</span>
                        <span className="method-badge">
                          {attendance.method}
                        </span>
                        {attendance.location && (
                          <>
                            <span className="separator">•</span>
                            <span className="location-info">
                              📍 Location verified
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="action-buttons">
                    <button
                      className="approve-btn"
                      onClick={() =>
                        handleAttendanceAction(
                          attendance._id,
                          "approve",
                          attendance.name
                        )
                      }
                      title="Mark Present"
                    >
                      <CheckCircle className="btn-icon" />
                      Present
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() =>
                        handleAttendanceAction(
                          attendance._id,
                          "reject",
                          attendance.name
                        )
                      }
                      title="Mark Absent"
                    >
                      <XCircle className="btn-icon" />
                      Absent
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-pending-requests">
              <div className="no-pending-icon">
                <CheckCircle className="check-icon" />
              </div>
              <h4>All Clear!</h4>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className={`stat-card ${stat.type}`}>
              <div className="stat-header">
                <div className="stat-info">
                  <div className="stat-title-with-icon">
                    <stat.icon className="w-4 h-4" />
                    <h3>{stat.title}</h3>
                  </div>
                  <p className="stat-value">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
