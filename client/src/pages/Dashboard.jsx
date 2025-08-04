// client/src/pages/Dashboard.jsx
import React from "react";
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

const Dashboard = () => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const stats = [
    {
      title: "Total Employees",
      value: "50",
      icon: Users,
      type: "total",
      chartData: [
        { name: "Active", value: 50, color: "#3b82f6" },
        { name: "Inactive", value: 47, color: "#e5e7eb" },
      ],
    },
    {
      title: "Present Today",
      value: "38",
      icon: UserCheck,
      type: "present",
      chartData: [
        { name: "Present", value: 38, color: "#10b981" },
        { name: "Total", value: 355, color: "#e5e7eb" },
      ],
    },
    {
      title: "Absent Today",
      value: "12",
      icon: UserX,
      type: "absent",
      chartData: [
        { name: "Absent", value: 12, color: "#ef4444" },
        { name: "Present", value: 892, color: "#e5e7eb" },
      ],
    },
    {
      title: "Late Arrivals",
      value: "0",
      icon: Clock,
      type: "late",
      chartData: [
        { name: "Late", value: 0, color: "#f59e0b" },
        { name: "On Time", value: 876, color: "#e5e7eb" },
      ],
    },
  ];

  const quickActions = [
    { icon: Users, title: "Add Employee", href: "/employee-directory" },
    { icon: Clock, title: "Mark Attendance", href: "/attendance" },
    { icon: Calendar, title: "Leave Requests", href: "/leave-management" },
    { icon: TrendingUp, title: "Reports", href: "/salary-report" },
  ];

  const recentActivities = [
    {
      icon: UserCheck,
      title: "John Doe checked in",
      time: "2 minutes ago",
    },
    {
      icon: Calendar,
      title: "New leave request from Sarah Wilson",
      time: "15 minutes ago",
    },
    {
      icon: Users,
      title: "Mike Johnson added to Engineering team",
      time: "1 hour ago",
    },
    {
      icon: Clock,
      title: "Daily attendance report generated",
      time: "2 hours ago",
    },
  ];

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
                <div className="welcome-stat-value">95.2%</div>
                <div className="welcome-stat-label">Attendance Rate</div>
              </div>
              <div className="welcome-stat">
                <div className="welcome-stat-value">5.8%</div>
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
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Present", value: 38, fill: "#10b981" },
                      { name: "Absent", value: 12, fill: "#ef4444" },
                      { name: "Late", value: 0, fill: "#f59e0b" },
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
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { name: "Total", value: 50, fill: "#3b82f6" },
                    { name: "Present", value: 38, fill: "#10b981" },
                    { name: "Absent", value: 12, fill: "#ef4444" },
                    { name: "Late", value: 0, fill: "#f59e0b" },
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
            {recentActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  <activity.icon className="w-5 h-5" />
                </div>
                <div className="activity-content">
                  <div className="activity-title">{activity.title}</div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
