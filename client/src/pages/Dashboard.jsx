// client/src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Calendar,
  TrendingUp,
  Sun,
  Search,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";

import "./Dashboard.css";

const API_BASE_URL = "http://localhost:5000/api";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    attendanceToday: { present: 0, late: 0, absent: 0 },
    pendingLeaves: 0,
    departmentStats: [],
    attendanceTrend: [],
  });
  const [recentActivities, setRecentActivities] = useState({
    recentLeaves: [],
    recentEmployees: [],
  });
  const [loading, setLoading] = useState(true);

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
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Keep default empty values on error
    }
  };

  // Fetch recent activities
  const fetchRecentActivities = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/activities`);
      if (!response.ok) throw new Error("Failed to fetch recent activities");
      const data = await response.json();
      setRecentActivities(data);
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      // Keep default empty values on error
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchDashboardStats(), fetchRecentActivities()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Transform data for charts
  const stats = [
    {
      title: "Total Employees",
      value: dashboardData.totalEmployees.toString(),
      icon: Users,
      type: "total",
      chartData: [
        {
          name: "Active",
          value: dashboardData.totalEmployees,
          color: "#3b82f6",
        },
        {
          name: "Inactive",
          value: Math.max(0, dashboardData.totalEmployees - 3),
          color: "#e5e7eb",
        },
      ],
    },
    {
      title: "Present Today",
      value: dashboardData.attendanceToday.present.toString(),
      icon: UserCheck,
      type: "present",
      chartData: [
        {
          name: "Present",
          value: dashboardData.attendanceToday.present,
          color: "#10b981",
        },
        {
          name: "Total",
          value: dashboardData.totalEmployees,
          color: "#e5e7eb",
        },
      ],
    },
    {
      title: "Absent Today",
      value: dashboardData.attendanceToday.absent.toString(),
      icon: UserX,
      type: "absent",
      chartData: [
        {
          name: "Absent",
          value: dashboardData.attendanceToday.absent,
          color: "#ef4444",
        },
        {
          name: "Present",
          value: dashboardData.attendanceToday.present,
          color: "#e5e7eb",
        },
      ],
    },
    {
      title: "Late Arrivals",
      value: dashboardData.attendanceToday.late.toString(),
      icon: Clock,
      type: "late",
      chartData: [
        {
          name: "Late",
          value: dashboardData.attendanceToday.late,
          color: "#f59e0b",
        },
        {
          name: "On Time",
          value: dashboardData.attendanceToday.present,
          color: "#e5e7eb",
        },
      ],
    },
  ];

  const quickActions = [
    { icon: Users, title: "Add Employee", href: "/employee-directory" },
    { icon: Clock, title: "Mark Attendance", href: "/attendance" },
    { icon: Calendar, title: "Leave Requests", href: "/leave-management" },
    { icon: TrendingUp, title: "Reports", href: "/salary-report" },
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
            <h1 className="welcome-title">Hello Admin!</h1>
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
                <div className="welcome-stat-label">Attendance Rate</div>
              </div>
              <div className="welcome-stat">
                <div className="welcome-stat-value">
                  {dashboardData.totalEmployees > 0
                    ? (
                        (dashboardData.attendanceToday.absent /
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

        {/* Header */}
        <div className="dashboard-header">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="dashboard-title">Dashboard Overview</h2>
              <p className="dashboard-subtitle">
                Monitor your team's performance and attendance
              </p>
              <div className="dashboard-date">
                <Calendar className="w-4 h-4" />
                {currentDate}
              </div>
            </div>
          </div>
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

        {/* Interactive Charts Section */}
        <div className="charts-section">
          <h3 className="charts-title">
            <TrendingUp className="w-5 h-5" />
            Analytics Overview
          </h3>

          <div className="charts-grid">
            {/* Attendance Overview Pie Chart */}
            <div className="chart-card">
              <h4 className="chart-card-title">Attendance Distribution</h4>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: "Present",
                        value: dashboardData.attendanceToday.present,
                        fill: "#10b981",
                      },
                      {
                        name: "Absent",
                        value: dashboardData.attendanceToday.absent,
                        fill: "#ef4444",
                      },
                      {
                        name: "Late",
                        value: dashboardData.attendanceToday.late,
                        fill: "#f59e0b",
                      },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  ></Pie>
                  <Tooltip
                    formatter={(value, name) => [value, name]}
                    labelStyle={{ color: "#374151" }}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Employee Status Bar Chart */}
            <div className="chart-card">
              <h4 className="chart-card-title">Employee Status Overview</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      name: "Total",
                      value: dashboardData.totalEmployees,
                      fill: "#3b82f6",
                    },
                    {
                      name: "Present",
                      value: dashboardData.attendanceToday.present,
                      fill: "#10b981",
                    },
                    {
                      name: "Absent",
                      value: dashboardData.attendanceToday.absent,
                      fill: "#ef4444",
                    },
                    {
                      name: "Late",
                      value: dashboardData.attendanceToday.late,
                      fill: "#f59e0b",
                    },
                  ]}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [value, "Employees"]}
                    labelStyle={{ color: "#374151" }}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar dataKey="value" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>
            <Activity className="w-5 h-5 text-blue-600" />
            Quick Actions
          </h3>
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <a key={index} href={action.href} className="action-button">
                <action.icon className="action-icon" />
                {action.title}
              </a>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <h3>
            <Clock className="w-5 h-5 text-blue-600" />
            Recent Activity
          </h3>
          <div className="activity-list">
            {recentActivities.recentLeaves.slice(0, 2).map((leave, index) => (
              <div key={`leave-${index}`} className="activity-item">
                <div className="activity-icon">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="activity-content">
                  <div className="activity-title">
                    Leave request from {leave.employee?.firstName}{" "}
                    {leave.employee?.lastName}
                  </div>
                  <div className="activity-time">
                    {new Date(leave.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
            {recentActivities.recentEmployees
              .slice(0, 2)
              .map((employee, index) => (
                <div key={`employee-${index}`} className="activity-item">
                  <div className="activity-icon">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">
                      {employee.firstName} {employee.lastName} joined{" "}
                      {employee.department?.name}
                    </div>
                    <div className="activity-time">
                      {new Date(employee.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            {recentActivities.recentLeaves.length === 0 &&
              recentActivities.recentEmployees.length === 0 && (
                <div className="activity-item">
                  <div className="activity-content">
                    <div className="activity-title">No recent activities</div>
                    <div className="activity-time">
                      Add employees or leave requests to see activity
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
