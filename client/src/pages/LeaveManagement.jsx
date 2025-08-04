import React, { useState } from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  FileText,
  TrendingUp,
  Download,
  Filter,
  Search,
  ChevronDown,
  Eye,
  Check,
  X,
  Users,
  CalendarDays,
  Timer,
  BarChart3,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import "./LeaveManagement.css";

const LeaveManagement = () => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [searchTerm, setSearchTerm] = useState("");

  // Sample leave applications data
  const leaveApplications = [
    {
      id: 1,
      employeeId: "EMP001",
      employeeName: "John Doe",
      department: "Engineering",
      position: "Senior Developer",
      leaveType: "Sick Leave",
      startDate: "2025-08-01",
      endDate: "2025-08-03",
      days: 3,
      reason: "Fever and flu symptoms",
      appliedDate: "2025-07-25",
      status: "Pending",
      priority: "High",
      attachments: 1,
    },
    {
      id: 2,
      employeeId: "EMP002",
      employeeName: "Sarah Wilson",
      department: "Product",
      position: "Product Manager",
      leaveType: "Annual Leave",
      startDate: "2025-08-05",
      endDate: "2025-08-12",
      days: 8,
      reason: "Family vacation to Europe",
      appliedDate: "2025-07-20",
      status: "Approved",
      priority: "Medium",
      attachments: 0,
      approvedDate: "2025-07-22",
      approvedBy: "HR Manager",
    },
    {
      id: 3,
      employeeId: "EMP003",
      employeeName: "Mike Johnson",
      department: "Design",
      position: "UX Designer",
      leaveType: "Personal Leave",
      startDate: "2025-07-30",
      endDate: "2025-07-30",
      days: 1,
      reason: "Family wedding ceremony",
      appliedDate: "2025-07-28",
      status: "Approved",
      priority: "Low",
      attachments: 0,
      approvedDate: "2025-07-29",
      approvedBy: "Team Lead",
    },
    {
      id: 4,
      employeeId: "EMP004",
      employeeName: "Emma Davis",
      department: "Human Resources",
      position: "HR Manager",
      leaveType: "Maternity Leave",
      startDate: "2025-08-15",
      endDate: "2025-11-15",
      days: 92,
      reason: "Maternity leave for childbirth",
      appliedDate: "2025-07-15",
      status: "Approved",
      priority: "High",
      attachments: 2,
      approvedDate: "2025-07-16",
      approvedBy: "Director",
    },
    {
      id: 5,
      employeeId: "EMP005",
      employeeName: "Alex Rodriguez",
      department: "Marketing",
      position: "Marketing Specialist",
      leaveType: "Sick Leave",
      startDate: "2025-07-28",
      endDate: "2025-07-29",
      days: 2,
      reason: "Doctor appointment and recovery",
      appliedDate: "2025-07-27",
      status: "Rejected",
      priority: "Medium",
      attachments: 0,
      rejectedDate: "2025-07-28",
      rejectedBy: "HR Manager",
      rejectionReason: "Insufficient sick leave balance",
    },
    {
      id: 6,
      employeeId: "EMP006",
      employeeName: "Lisa Chen",
      department: "Analytics",
      position: "Data Analyst",
      leaveType: "Annual Leave",
      startDate: "2025-08-20",
      endDate: "2025-08-22",
      days: 3,
      reason: "Short break and rest",
      appliedDate: "2025-07-29",
      status: "Pending",
      priority: "Low",
      attachments: 0,
    },
  ];

  // Employee leave statistics for current month
  const employeeLeaveStats = [
    {
      employeeId: "EMP001",
      employeeName: "John Doe",
      department: "Engineering",
      totalLeaves: 5,
      approved: 3,
      rejected: 1,
      pending: 1,
      sickLeaves: 2,
      annualLeaves: 2,
      personalLeaves: 1,
      remainingLeaves: 15,
    },
    {
      employeeId: "EMP002",
      employeeName: "Sarah Wilson",
      department: "Product",
      totalLeaves: 8,
      approved: 7,
      rejected: 0,
      pending: 1,
      sickLeaves: 1,
      annualLeaves: 6,
      personalLeaves: 1,
      remainingLeaves: 12,
    },
    {
      employeeId: "EMP003",
      employeeName: "Mike Johnson",
      department: "Design",
      totalLeaves: 3,
      approved: 3,
      rejected: 0,
      pending: 0,
      sickLeaves: 0,
      annualLeaves: 2,
      personalLeaves: 1,
      remainingLeaves: 17,
    },
    {
      employeeId: "EMP004",
      employeeName: "Emma Davis",
      department: "Human Resources",
      totalLeaves: 92,
      approved: 92,
      rejected: 0,
      pending: 0,
      sickLeaves: 0,
      annualLeaves: 0,
      personalLeaves: 0,
      remainingLeaves: 8,
    },
    {
      employeeId: "EMP005",
      employeeName: "Alex Rodriguez",
      department: "Marketing",
      totalLeaves: 4,
      approved: 2,
      rejected: 2,
      pending: 0,
      sickLeaves: 3,
      annualLeaves: 1,
      personalLeaves: 0,
      remainingLeaves: 16,
    },
    {
      employeeId: "EMP006",
      employeeName: "Lisa Chen",
      department: "Analytics",
      totalLeaves: 2,
      approved: 1,
      rejected: 0,
      pending: 1,
      sickLeaves: 0,
      annualLeaves: 2,
      personalLeaves: 0,
      remainingLeaves: 18,
    },
  ];

  const leaveTypes = [
    "all",
    "Sick Leave",
    "Annual Leave",
    "Personal Leave",
    "Maternity Leave",
    "Emergency Leave",
  ];
  const statusTypes = ["all", "Pending", "Approved", "Rejected"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Stats data
  const stats = [
    {
      title: "Pending Applications",
      value: leaveApplications
        .filter((app) => app.status === "Pending")
        .length.toString(),
      icon: AlertCircle,
      type: "pending",
      change: "+3",
      changeType: "neutral",
    },
    {
      title: "Approved This Month",
      value: leaveApplications
        .filter((app) => app.status === "Approved")
        .length.toString(),
      icon: CheckCircle,
      type: "approved",
      change: "+12%",
      changeType: "positive",
    },
    {
      title: "Total Applications",
      value: leaveApplications.length.toString(),
      icon: FileText,
      type: "total",
      change: "+8%",
      changeType: "positive",
    },
    {
      title: "Avg. Processing Time",
      value: "2.3 days",
      icon: Timer,
      type: "processing",
      change: "-0.5d",
      changeType: "positive",
    },
  ];

  // Chart data for leave status distribution
  const leaveStatusData = [
    {
      name: "Approved",
      value: leaveApplications.filter((app) => app.status === "Approved")
        .length,
      color: "#22c55e",
    },
    {
      name: "Pending",
      value: leaveApplications.filter((app) => app.status === "Pending").length,
      color: "#f59e0b",
    },
    {
      name: "Rejected",
      value: leaveApplications.filter((app) => app.status === "Rejected")
        .length,
      color: "#ef4444",
    },
  ];

  // Leave type distribution data
  const leaveTypeData = [
    {
      type: "Sick Leave",
      count: leaveApplications.filter((app) => app.leaveType === "Sick Leave")
        .length,
    },
    {
      type: "Annual Leave",
      count: leaveApplications.filter((app) => app.leaveType === "Annual Leave")
        .length,
    },
    {
      type: "Personal Leave",
      count: leaveApplications.filter(
        (app) => app.leaveType === "Personal Leave"
      ).length,
    },
    {
      type: "Maternity Leave",
      count: leaveApplications.filter(
        (app) => app.leaveType === "Maternity Leave"
      ).length,
    },
  ];

  // Monthly leave trend (sample data)
  const monthlyTrendData = [
    { month: "Jan", applications: 45, approved: 38, rejected: 7 },
    { month: "Feb", applications: 52, approved: 46, rejected: 6 },
    { month: "Mar", applications: 48, approved: 42, rejected: 6 },
    { month: "Apr", applications: 55, approved: 48, rejected: 7 },
    { month: "May", applications: 62, approved: 55, rejected: 7 },
    { month: "Jun", applications: 58, approved: 52, rejected: 6 },
    { month: "Jul", applications: 64, approved: 58, rejected: 6 },
  ];

  // Filter applications
  const filteredApplications = leaveApplications.filter((app) => {
    const matchesSearch =
      app.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || app.status === selectedStatus;
    const matchesType =
      selectedType === "all" || app.leaveType === selectedType;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Filter employee stats by selected month
  const filteredEmployeeStats = employeeLeaveStats;

  const handleApprove = (id) => {
    console.log(`Approving leave application ${id}`);
    // Here you would update the application status
  };

  const handleReject = (id) => {
    console.log(`Rejecting leave application ${id}`);
    // Here you would update the application status
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="leave-management-page">
      <div className="leave-management-container">
        {/* Header */}
        <div className="leave-management-header">
          <div className="header-content">
            <div className="header-info">
              <h1 className="leave-management-title">
                Leave Management System
              </h1>
              <p className="leave-management-subtitle">
                Approve, reject, and track employee leave applications
              </p>
              <div className="leave-management-date">
                <Calendar className="date-icon" />
                {currentDate}
              </div>
            </div>
            <div className="header-actions">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="month-selector"
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>
                    {month} 2025
                  </option>
                ))}
              </select>
              <button className="btn-secondary-small">
                <Download className="btn-icon" />
                Export Report
              </button>
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
                    <stat.icon className="stat-title-icon" />
                    <h3>{stat.title}</h3>
                  </div>
                  <p className="stat-value">{stat.value}</p>
                  <div className={`stat-change ${stat.changeType}`}>
                    <TrendingUp className="change-icon" />
                    {stat.change}
                  </div>
                </div>
                <div className="stat-icon">
                  <stat.icon className="main-stat-icon" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">
                <BarChart3 className="chart-title-icon" />
                Leave Status Distribution
              </h3>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={leaveStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {leaveStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">
                <CalendarDays className="chart-title-icon" />
                Leave Type Distribution
              </h3>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={leaveTypeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="charts-section">
          <div className="chart-card full-width">
            <div className="chart-header">
              <h3 className="chart-title">
                <TrendingUp className="chart-title-icon" />
                Monthly Leave Applications Trend
              </h3>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="applications"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name="Total Applications"
                  />
                  <Line
                    type="monotone"
                    dataKey="approved"
                    stroke="#22c55e"
                    strokeWidth={3}
                    name="Approved"
                  />
                  <Line
                    type="monotone"
                    dataKey="rejected"
                    stroke="#ef4444"
                    strokeWidth={3}
                    name="Rejected"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="search-filters-compact">
            <div className="search-container-small">
              <Search className="search-icon-small" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input-small"
              />
            </div>

            <div className="filter-group-compact">
              <div className="filter-item-small">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="filter-select-small"
                >
                  {statusTypes.map((status) => (
                    <option key={status} value={status}>
                      {status === "all" ? "All Status" : status}
                    </option>
                  ))}
                </select>
                <ChevronDown className="select-icon-small" />
              </div>

              <div className="filter-item-small">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="filter-select-small"
                >
                  {leaveTypes.map((type) => (
                    <option key={type} value={type}>
                      {type === "all" ? "All Types" : type}
                    </option>
                  ))}
                </select>
                <ChevronDown className="select-icon-small" />
              </div>

              <button className="filter-btn-small">
                <Filter className="filter-icon-small" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Leave Applications Table */}
        <div className="leave-applications-section">
          <div className="section-header">
            <h3 className="section-title">
              <FileText className="section-icon" />
              Latest Leave Applications ({filteredApplications.length}{" "}
              applications)
            </h3>
          </div>

          <div className="table-container-compact">
            <table className="leave-table-compact">
              <thead className="table-header-compact">
                <tr>
                  <th className="table-header-cell-compact">Employee</th>
                  <th className="table-header-cell-compact">Leave Details</th>
                  <th className="table-header-cell-compact">Duration</th>
                  <th className="table-header-cell-compact">Decision</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="table-row-compact">
                    <td className="table-cell-compact">
                      <div className="employee-info-compact">
                        <div className="employee-details-compact">
                          <h4 className="employee-name-compact">
                            {application.employeeName}
                          </h4>
                          <p className="employee-id-compact">
                            {application.employeeId}
                          </p>
                          <p className="department-compact">
                            {application.department}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="table-cell-compact">
                      <div className="leave-details">
                        <div className="leave-type">
                          <span
                            className={`leave-type-badge ${application.leaveType
                              .toLowerCase()
                              .replace(" ", "-")}`}
                          >
                            {application.leaveType}
                          </span>
                        </div>
                        <div className="reason-text">
                          {application.reason.length > 50
                            ? `${application.reason.substring(0, 50)}...`
                            : application.reason}
                        </div>
                      </div>
                    </td>

                    <td className="table-cell-compact">
                      <div className="duration-info">
                        <div className="days-count">
                          {application.days} days
                        </div>
                        <div className="applied-date">
                          Applied:{" "}
                          {new Date(
                            application.appliedDate
                          ).toLocaleDateString()}
                        </div>
                        {application.attachments > 0 && (
                          <div className="attachments">
                            📎 {application.attachments} file(s)
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="table-cell-compact">
                      <div className="decision-buttons">
                        {application.status === "Pending" ? (
                          <div className="action-buttons-compact">
                            <button
                              className="action-btn-compact approve"
                              title="Accept"
                              onClick={() => handleApprove(application.id)}
                            >
                              <Check className="action-icon-small" />
                              Accept
                            </button>
                            <button
                              className="action-btn-compact reject"
                              title="Reject"
                              onClick={() => handleReject(application.id)}
                            >
                              <X className="action-icon-small" />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <div
                            className={`status-badge-compact ${application.status.toLowerCase()}`}
                          >
                            <div className="status-indicator-small"></div>
                            {application.status}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Employee Leave Statistics */}
        <div className="employee-stats-section">
          <div className="section-header">
            <h3 className="section-title">
              <Users className="section-icon" />
              Employee Leave Statistics - {months[selectedMonth]} 2025
            </h3>
          </div>

          <div className="table-container-compact">
            <table className="employee-stats-table-compact">
              <thead className="table-header-compact">
                <tr>
                  <th className="table-header-cell-compact">Employee</th>
                  <th className="table-header-cell-compact">Total Leaves</th>
                  <th className="table-header-cell-compact">
                    Status Breakdown
                  </th>
                  <th className="table-header-cell-compact">Leave Types</th>
                  <th className="table-header-cell-compact">Remaining</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployeeStats.map((employee) => (
                  <tr key={employee.employeeId} className="table-row-compact">
                    <td className="table-cell-compact">
                      <div className="employee-info-compact">
                        <div className="employee-details-compact">
                          <h4 className="employee-name-compact">
                            {employee.employeeName}
                          </h4>
                          <p className="employee-id-compact">
                            {employee.employeeId}
                          </p>
                          <p className="department-compact">
                            {employee.department}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="table-cell-compact">
                      <div className="total-leaves-count">
                        {employee.totalLeaves} days
                      </div>
                    </td>

                    <td className="table-cell-compact">
                      <div className="status-breakdown">
                        <div className="status-item approved">
                          <CheckCircle className="status-icon-small" />
                          <span>{employee.approved} Approved</span>
                        </div>
                        <div className="status-item rejected">
                          <XCircle className="status-icon-small" />
                          <span>{employee.rejected} Rejected</span>
                        </div>
                        <div className="status-item pending">
                          <AlertCircle className="status-icon-small" />
                          <span>{employee.pending} Pending</span>
                        </div>
                      </div>
                    </td>

                    <td className="table-cell-compact">
                      <div className="leave-types-breakdown">
                        <div className="type-item">
                          Sick: {employee.sickLeaves}
                        </div>
                        <div className="type-item">
                          Annual: {employee.annualLeaves}
                        </div>
                        <div className="type-item">
                          Personal: {employee.personalLeaves}
                        </div>
                      </div>
                    </td>

                    <td className="table-cell-compact">
                      <div className="remaining-leaves">
                        <div className="remaining-count">
                          {employee.remainingLeaves}
                        </div>
                        <div className="remaining-label">days left</div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredApplications.length === 0 && (
          <div className="empty-state-compact">
            <FileText className="empty-icon" />
            <h3 className="empty-title">No leave applications found</h3>
            <p className="empty-text">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveManagement;
