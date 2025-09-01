import React, { useState, useEffect } from "react";
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
  RefreshCw,
} from "lucide-react";
import "./LeaveManagement.css";

const API_BASE_URL = "http://localhost:5000/api";

const LeaveManagement = () => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [searchTerm, setSearchTerm] = useState("");
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch leave applications from backend
  const fetchLeaveApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/leaves`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched leave applications:", data);
      setLeaveApplications(data);
    } catch (error) {
      console.error("Error fetching leave applications:", error);
      setError(error.message);
      setLeaveApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchLeaveApplications();
  }, []);

  // Polling: refresh data every 10 seconds for real-time updates
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchLeaveApplications();
    }, 10000); // 10 seconds
    return () => clearInterval(intervalId);
  }, []);

  // Handle approve/reject actions
  const handleApprove = async (leaveId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/leaves/${leaveId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "Approved",
          approvedBy: "Admin",
        }),
      });

      if (response.ok) {
        console.log(`Leave application ${leaveId} approved`);
        await fetchLeaveApplications();
      } else {
        throw new Error("Failed to approve leave application");
      }
    } catch (error) {
      console.error("Error approving leave:", error);
      alert("Failed to approve leave application");
    }
  };

  const handleReject = async (leaveId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/leaves/${leaveId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "Rejected",
          approvedBy: "Admin",
        }),
      });

      if (response.ok) {
        console.log(`Leave application ${leaveId} rejected`);
        await fetchLeaveApplications();
      } else {
        throw new Error("Failed to reject leave application");
      }
    } catch (error) {
      console.error("Error rejecting leave:", error);
      alert("Failed to reject leave application");
    }
  };

  const leaveTypes = [
    "all",
    "Sick Leave",
    "Family Event",
    "Personal Leave",
    "Emergency",
    "Annual Leave",
    "Maternity Leave",
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

  // Stats data - calculated from real data
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
    },
    {
      title: "Total Applications",
      value: leaveApplications.length.toString(),
      icon: FileText,
      type: "total",
    },
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
  const filteredEmployeeStats = [];

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
              <button
                className="btn-secondary-small"
                onClick={fetchLeaveApplications}
                disabled={loading}
              >
                <RefreshCw
                  className={`btn-icon ${loading ? "spinning" : ""}`}
                />
                Refresh
              </button>
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

        {/* Pending Leave Applications Section */}
        {leaveApplications.filter((app) => app.status === "Pending").length >
        0 ? (
          <div className="pending-leave-section">
            <div className="pending-header">
              <div className="pending-title-wrapper">
                <AlertCircle className="pending-icon" />
                <h3 className="pending-title">
                  Pending Leave Requests (
                  {
                    leaveApplications.filter((app) => app.status === "Pending")
                      .length
                  }
                  )
                </h3>
              </div>
              <p className="pending-subtitle">
                Review and approve pending leave applications
              </p>
            </div>
            <div className="pending-leave-cards">
              {leaveApplications
                .filter((app) => app.status === "Pending")
                .slice(0, 5)
                .map((application) => (
                  <div
                    key={application._id}
                    className="pending-leave-card compact"
                  >
                    <div className="leave-card-header">
                      <div className="employee-info">
                        <div className="employee-avatar">
                          {application.employeeName
                            ? application.employeeName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                            : "EMP"}
                        </div>
                        <div className="employee-details">
                          <h4 className="employee-name">
                            {application.employeeName || "Unknown Employee"}
                          </h4>
                          <p className="employee-meta">
                            {application.employeeId} • {application.department}
                          </p>
                        </div>
                      </div>
                      <div className="leave-status-info">
                        <span className="leave-type-badge">
                          {application.leaveType}
                        </span>
                        <span className="leave-duration">
                          {application.days ||
                            Math.ceil(
                              (new Date(application.endDate) -
                                new Date(application.startDate)) /
                                (1000 * 60 * 60 * 24)
                            ) + 1}{" "}
                          days
                        </span>
                      </div>
                    </div>

                    <div className="leave-card-content">
                      <div className="leave-dates-compact">
                        <div className="date-range">
                          <Calendar className="date-icon" />
                          <span className="date-text">
                            {new Date(application.startDate).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" }
                            )}{" "}
                            -{" "}
                            {new Date(application.endDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        {application.reason && (
                          <div className="reason-compact">
                            <FileText className="reason-icon" />
                            <span className="reason-text">
                              {application.reason.length > 50
                                ? application.reason.substring(0, 50) + "..."
                                : application.reason}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="leave-card-actions">
                      <button
                        className="approve-btn"
                        onClick={() => handleApprove(application._id)}
                      >
                        <Check className="btn-icon" />
                        Approve
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleReject(application._id)}
                      >
                        <X className="btn-icon" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="pending-leave-section">
            <div className="no-pending-leaves">
              <div className="no-pending-icon">
                <CheckCircle className="check-icon" />
              </div>
              <h4>All Clear!</h4>
              <p>No pending leave applications to review.</p>
              <p className="helper-text">
                New leave requests will appear here for approval.
              </p>
            </div>
          </div>
        )}

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
              Latest Leave Applications
            </h3>
          </div>

          <div className="table-container-compact">
            <table className="leave-table-compact">
              <thead className="table-header-compact">
                <tr>
                  <th className="table-header-cell-compact">Employee</th>
                  <th className="table-header-cell-compact">Leave Details</th>
                  <th className="table-header-cell-compact">Duration</th>
                  <th className="table-header-cell-compact">Total Leave</th>
                  <th className="table-header-cell-compact">Leaves Used</th>
                  <th className="table-header-cell-compact">
                    Leaves Remaining
                  </th>
                  <th className="table-header-cell-compact">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((application) => {
                  // Calculate leave statistics for this employee
                  const employeeLeaves = leaveApplications.filter(
                    (app) =>
                      app.employeeId === application.employeeId &&
                      app.status === "Approved"
                  );

                  const totalLeavesUsed = employeeLeaves.reduce(
                    (total, leave) => {
                      return (
                        total +
                        (leave.days ||
                          Math.ceil(
                            (new Date(leave.endDate) -
                              new Date(leave.startDate)) /
                              (1000 * 60 * 60 * 24)
                          ) + 1)
                      );
                    },
                    0
                  );

                  const totalLeaveAllowed = 30; // 30 days per year for all employees
                  const leavesRemaining = totalLeaveAllowed - totalLeavesUsed;

                  // Check if employee is currently on leave
                  const currentDate = new Date();
                  const isOnLeave = employeeLeaves.some((leave) => {
                    const startDate = new Date(leave.startDate);
                    const endDate = new Date(leave.endDate);
                    return currentDate >= startDate && currentDate <= endDate;
                  });

                  const employeeStatus = isOnLeave ? "On Leave" : "Active";

                  return (
                    <tr key={application._id} className="table-row-compact">
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
                            {application.reason &&
                            application.reason.length > 50
                              ? `${application.reason.substring(0, 50)}...`
                              : application.reason}
                          </div>
                        </div>
                      </td>

                      <td className="table-cell-compact">
                        <div className="duration-info">
                          <div className="days-count">
                            {application.days ||
                              Math.ceil(
                                (new Date(application.endDate) -
                                  new Date(application.startDate)) /
                                  (1000 * 60 * 60 * 24)
                              ) + 1}{" "}
                            days
                          </div>
                          <div className="applied-date">
                            Applied:{" "}
                            {new Date(
                              application.appliedDate || application.createdAt
                            ).toLocaleDateString()}
                          </div>
                          <div className="date-range">
                            {new Date(
                              application.startDate
                            ).toLocaleDateString()}{" "}
                            -{" "}
                            {new Date(application.endDate).toLocaleDateString()}
                          </div>
                          {application.attachments > 0 && (
                            <div className="attachments">
                              📎 {application.attachments} file(s)
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="table-cell-compact">
                        <div className="leave-quota-info">
                          <div className="quota-number">
                            {totalLeaveAllowed}
                          </div>
                          <div className="quota-label">days/year</div>
                        </div>
                      </td>

                      <td className="table-cell-compact">
                        <div className="leave-used-info">
                          <div
                            className={`used-number ${
                              totalLeavesUsed > totalLeaveAllowed * 0.8
                                ? "warning"
                                : ""
                            }`}
                          >
                            {totalLeavesUsed}
                          </div>
                          <div className="used-label">days used</div>
                          <div className="usage-bar">
                            <div
                              className="usage-fill"
                              style={{
                                width: `${Math.min(
                                  (totalLeavesUsed / totalLeaveAllowed) * 100,
                                  100
                                )}%`,
                                backgroundColor:
                                  totalLeavesUsed > totalLeaveAllowed
                                    ? "#ef4444"
                                    : totalLeavesUsed > totalLeaveAllowed * 0.8
                                    ? "#f59e0b"
                                    : "#10b981",
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      <td className="table-cell-compact">
                        <div className="leave-remaining-info">
                          <div
                            className={`remaining-number ${
                              leavesRemaining < 5 ? "low" : ""
                            }`}
                          >
                            {Math.max(leavesRemaining, 0)}
                          </div>
                          <div className="remaining-label">days left</div>
                          {leavesRemaining < 0 && (
                            <div className="exceeded-warning">
                              Exceeded by {Math.abs(leavesRemaining)} days
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="table-cell-compact">
                        <div className="simple-status">
                          <div
                            className={`status-badge-compact ${employeeStatus
                              .toLowerCase()
                              .replace(" ", "-")}`}
                          >
                            <div className="status-indicator-small"></div>
                            {employeeStatus}
                          </div>
                          {application.status === "Pending" && (
                            <div className="quick-actions-minimal">
                              <button
                                className="quick-action-btn approve"
                                onClick={() => handleApprove(application._id)}
                                title="Approve Application"
                              >
                                <Check className="quick-action-icon" />
                                Approve
                              </button>
                              <button
                                className="quick-action-btn reject"
                                onClick={() => handleReject(application._id)}
                                title="Reject Application"
                              >
                                <X className="quick-action-icon" />
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {loading && (
          <div className="empty-state-compact">
            <RefreshCw className="empty-icon spinning" />
            <h3 className="empty-title">Loading leave applications...</h3>
            <p className="empty-text">Please wait while we fetch the data.</p>
          </div>
        )}

        {error && (
          <div className="empty-state-compact">
            <XCircle className="empty-icon" />
            <h3 className="empty-title">Error loading leave applications</h3>
            <p className="empty-text">{error}</p>
            <button onClick={fetchLeaveApplications} className="btn-primary">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && filteredApplications.length === 0 && (
          <div className="empty-state-compact">
            <FileText className="empty-icon" />
            <h3 className="empty-title">No leave applications found</h3>
            <p className="empty-text">
              {leaveApplications.length === 0
                ? "No leave applications have been submitted yet."
                : "Try adjusting your search criteria or filters."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveManagement;
