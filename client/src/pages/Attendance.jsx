import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Filter,
  Search,
  ChevronDown,
  Edit,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import "./Attendance.css";

const API_BASE_URL = "http://localhost:5000/api";

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState(["all"]);
  const [error, setError] = useState(null);
  const [pendingAttendance, setPendingAttendance] = useState([]);

  const statuses = ["all", "Present", "Absent", "On Leave"];

  // Stats for dashboard
  const stats = [
    {
      title: "Present",
      value: attendanceData.filter((emp) => emp.status === "Present").length,
      icon: CheckCircle,
      type: "present",
    },
    {
      title: "Absent",
      value: attendanceData.filter((emp) => emp.status === "Absent").length,
      icon: XCircle,
      type: "absent",
    },
    {
      title: "On Leave",
      value: attendanceData.filter((emp) => emp.status === "On Leave").length,
      icon: Calendar,
      type: "leave",
    },
  ];

  // Fetch attendance data from backend
  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (selectedDate) {
        params.append("date", selectedDate);
      }
      params.append("includeAll", "true"); // Include both pending and approved records

      console.log("Fetching employees from:", `${API_BASE_URL}/employees`);
      // Fetch all employees first
      const employeesResponse = await fetch(`${API_BASE_URL}/employees`);
      if (!employeesResponse.ok) {
        throw new Error(`HTTP error! status: ${employeesResponse.status}`);
      }

      const employees = await employeesResponse.json();
      console.log("Employees fetched:", employees.length, employees);

      console.log(
        "Fetching attendance from:",
        `${API_BASE_URL}/attendance?${params}`
      );
      // Then fetch attendance data
      const attendanceResponse = await fetch(
        `${API_BASE_URL}/attendance?${params}`
      );

      if (!attendanceResponse.ok) {
        throw new Error(`HTTP error! status: ${attendanceResponse.status}`);
      }

      const attendanceData = await attendanceResponse.json();
      console.log(
        "Attendance data fetched:",
        attendanceData.length,
        attendanceData
      );

      // Create a map of employees with attendance using employee._id
      const attendanceMap = new Map();
      attendanceData.forEach((record) => {
        // Use the employee ObjectId from the populated field
        const employeeId = record.employee?._id || record.employee;
        console.log("Mapping attendance record:", employeeId, record);
        attendanceMap.set(employeeId.toString(), record);
      });

      console.log("Attendance map created:", attendanceMap);

      // Combine employee and attendance data
      const transformedData = employees.map((employee) => {
        const attendanceRecord = attendanceMap.get(employee._id.toString());
        console.log(
          "Processing employee:",
          employee.name,
          "Found attendance:",
          !!attendanceRecord
        );

        if (attendanceRecord) {
          // Employee has attendance record
          return {
            id: attendanceRecord._id,
            employeeId: attendanceRecord.employeeId || employee.employeeId,
            name: attendanceRecord.name || employee.name,
            department: attendanceRecord.department || employee.department,
            position: attendanceRecord.position || employee.position,
            hourlyRate:
              attendanceRecord.hourlyRate || employee.hourlySalary || 0,
            checkIn: attendanceRecord.checkIn || "N/A",
            checkOut: attendanceRecord.checkOut || "N/A",
            totalHours: attendanceRecord.totalHours || 0,
            breakTime: attendanceRecord.breakTime || 1,
            workingHours: attendanceRecord.workingHours || 0,
            dailySalary:
              attendanceRecord.dailySalary || attendanceRecord.totalPay || 0,
            status: attendanceRecord.status,
            overtime: attendanceRecord.overtime || 0,
            overtimePay: attendanceRecord.overtimePay || 0,
            method: attendanceRecord.method || "manual",
            date: attendanceRecord.date,
            approvalStatus: attendanceRecord.approvalStatus || "approved",
          };
        } else {
          // Employee doesn't have attendance record
          // Check employee status: if On Leave, show as On Leave; otherwise Absent
          const employeeStatus =
            employee.status === "On Leave" ? "On Leave" : "Absent";

          return {
            id: `no-attendance-${employee._id}`,
            employeeId: employee.employeeId,
            name: employee.name,
            department: employee.department,
            position: employee.position,
            hourlyRate: employee.hourlySalary || 0,
            checkIn: "N/A",
            checkOut: "N/A",
            totalHours: 0,
            breakTime: 0,
            workingHours: 0,
            dailySalary: 0,
            status: employeeStatus,
            overtime: 0,
            overtimePay: 0,
            method: "auto",
            date: new Date(selectedDate).toISOString(),
            notMarked: true, // Flag to indicate this is an auto-generated entry
            approvalStatus: "approved",
          };
        }
      });

      console.log("Transformed data:", transformedData);
      setAttendanceData(transformedData);

      // Extract unique departments
      const uniqueDepartments = [
        "all",
        ...new Set(transformedData.map((emp) => emp.department)),
      ];
      setDepartments(uniqueDepartments);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      setError(error.message);
      setAttendanceData([]);
    } finally {
      setLoading(false);
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
        // Removed popup logic
      } else {
        console.error("Failed to fetch pending attendance:", response.status);
      }
    } catch (error) {
      console.error("Error fetching pending attendance:", error);
    }
  };

  // Handle attendance approval/rejection
  const handleAttendanceAction = async (attendanceId, action, employeeData) => {
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

        // Refresh attendance data
        fetchAttendanceData();

        // Removed popup logic

        console.log(`Attendance ${action}ed for ${employeeData.name}`);
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  // Fetch data on component mount and when date changes
  useEffect(() => {
    fetchAttendanceData();
    fetchPendingAttendance();
  }, [selectedDate]);

  // Polling: fetch attendance data every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchAttendanceData();
      fetchPendingAttendance();
    }, 5000); // 5000ms = 5 seconds
    return () => clearInterval(intervalId);
  }, [selectedDate]);

  // Page refresh: refresh entire page every 10 minutes
  useEffect(() => {
    const pageRefreshId = setInterval(() => {
      console.log("Auto-refreshing attendance page...");
      window.location.reload();
    }, 600000); // 600000ms = 10 minutes

    return () => clearInterval(pageRefreshId);
  }, []); // Empty dependency array means this runs once on mount   // Filter attendance data
  const filteredAttendance = attendanceData.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "all" ||
      employee.department === selectedDepartment;
    const matchesStatus =
      selectedStatus === "all" || employee.status === selectedStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="attendance-page">
      <div className="attendance-container">
        {/* Header */}
        <div className="attendance-header">
          <div className="header-content">
            <div className="header-info">
              <h1 className="attendance-title">
                Daily Attendance & Salary Tracking
              </h1>
              <p className="attendance-subtitle">
                Monitor employee attendance and calculate hourly-based salaries
              </p>
              <div className="attendance-date">
                <Calendar className="date-icon" />
                {currentDate}
              </div>
            </div>
            <div className="header-actions">
              {pendingAttendance.length > 0 && (
                <button
                  className="notification-btn"
                  onClick={() => setShowNotificationPopup(true)}
                  title={`${pendingAttendance.length} pending attendance requests`}
                >
                  <AlertCircle className="notification-bell-icon" />
                  <span className="notification-badge">
                    {pendingAttendance.length}
                  </span>
                </button>
              )}
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="date-picker"
              />
              <button
                className="btn-secondary-small"
                onClick={fetchAttendanceData}
                disabled={loading}
              >
                <RefreshCw
                  className={`btn-icon ${loading ? "rotating" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <RefreshCw className="loading-spinner" />
            <p>Loading attendance data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-state">
            <AlertCircle className="error-icon" />
            <p>Error loading attendance data: {error}</p>
            <button onClick={fetchAttendanceData} className="btn-primary-small">
              Try Again
            </button>
          </div>
        )}

        {/* Main Content - Only show when not loading and no error */}
        {!loading && !error && (
          <>
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
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="filter-select-small"
                    >
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept === "all" ? "All Depts" : dept}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="select-icon-small" />
                  </div>

                  <div className="filter-item-small">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="filter-select-small"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status === "all" ? "All Status" : status}
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

            {/* Attendance Table */}
            <div className="attendance-table-section">
              <div className="section-header">
                <h3 className="section-title">
                  <Clock className="section-icon" />
                  Daily Attendance & Salary Records
                </h3>
              </div>

              <div className="table-container-compact">
                <table className="attendance-table-compact">
                  <thead className="table-header-compact">
                    <tr>
                      <th className="table-header-cell-compact">Employee</th>
                      <th className="table-header-cell-compact">Department</th>
                      <th className="table-header-cell-compact">
                        Time Tracking
                      </th>
                      <th className="table-header-cell-compact">
                        Hours & Rate
                      </th>
                      <th className="table-header-cell-compact">
                        Daily Salary
                      </th>
                      <th className="table-header-cell-compact">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendance.map((employee) => (
                      <tr key={employee.id} className="table-row-compact">
                        <td className="table-cell-compact">
                          <div className="employee-info-compact">
                            <div className="employee-details-compact">
                              <h4 className="employee-name-compact">
                                {employee.name}
                              </h4>
                              <p className="employee-id-compact">
                                {employee.employeeId}
                              </p>
                              <p className="position-compact">
                                {employee.position}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="table-cell-compact">
                          <span
                            className={`department-badge-compact ${employee.department
                              .toLowerCase()
                              .replace(" ", "-")}`}
                          >
                            {employee.department}
                          </span>
                        </td>

                        <td className="table-cell-compact">
                          <div className="time-tracking">
                            <div className="time-item">
                              <span className="time-label">In:</span>
                              <span className="time-value">
                                {employee.checkIn || "N/A"}
                              </span>
                            </div>
                            <div className="time-item">
                              <span className="time-label">Out:</span>
                              <span className="time-value">
                                {employee.checkOut || "N/A"}
                              </span>
                            </div>
                            <div className="time-item">
                              <span className="time-label">Total:</span>
                              <span className="time-value">
                                {employee.totalHours}h
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="table-cell-compact">
                          <div className="hours-rate">
                            <div className="rate-item">
                              <span className="rate-label">Rate:</span>
                              <span className="rate-value">
                                ₹{employee.hourlyRate}/hr
                              </span>
                            </div>
                            <div className="rate-item">
                              <span className="rate-label">Work:</span>
                              <span className="rate-value">
                                {employee.workingHours}h
                              </span>
                            </div>
                            {employee.overtime > 0 && (
                              <div className="rate-item overtime">
                                <span className="rate-label">OT:</span>
                                <span className="rate-value">
                                  {employee.overtime}h
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="table-cell-compact">
                          <div className="salary-info">
                            <div className="daily-salary">
                              ₹{employee.dailySalary.toFixed(2)}
                            </div>
                            {employee.overtimePay > 0 && (
                              <div className="overtime-pay">
                                +₹{employee.overtimePay.toFixed(2)} OT
                              </div>
                            )}
                            <div className="total-salary">
                              Total: ₹
                              {(
                                employee.dailySalary + employee.overtimePay
                              ).toFixed(2)}
                            </div>
                          </div>
                        </td>

                        <td className="table-cell-compact">
                          <div
                            className={`status-badge-compact ${employee.status
                              .toLowerCase()
                              .replace(" ", "-")}`}
                          >
                            <div className="status-indicator-small"></div>
                            {employee.status}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredAttendance.length === 0 && (
                <div className="empty-state-compact">
                  <Clock className="empty-icon" />
                  <h3 className="empty-title">No attendance records found</h3>
                  <p className="empty-text">
                    Try adjusting your search criteria or date selection.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Attendance;
