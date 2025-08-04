import React, { useState } from "react";
import {
  Calendar,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  Download,
  Filter,
  Search,
  ChevronDown,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle,
  Timer,
  Calculator,
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
import "./Attendance.css";

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Sample attendance data with hourly rates
  const attendanceData = [
    {
      id: 1,
      employeeId: "EMP001",
      name: "John Doe",
      department: "Engineering",
      position: "Senior Developer",
      hourlyRate: 45,
      checkIn: "09:00",
      checkOut: "18:30",
      totalHours: 8.5,
      breakTime: 1,
      workingHours: 7.5,
      dailySalary: 337.5,
      status: "Present",
      overtime: 0.5,
      overtimePay: 33.75,
    },
    {
      id: 2,
      employeeId: "EMP002",
      name: "Sarah Wilson",
      department: "Product",
      position: "Product Manager",
      hourlyRate: 50,
      checkIn: "08:45",
      checkOut: "17:15",
      totalHours: 8.5,
      breakTime: 1,
      workingHours: 7.5,
      dailySalary: 375,
      status: "Present",
      overtime: 0,
      overtimePay: 0,
    },
    {
      id: 3,
      employeeId: "EMP003",
      name: "Mike Johnson",
      department: "Design",
      position: "UX Designer",
      hourlyRate: 38,
      checkIn: "09:15",
      checkOut: "18:00",
      totalHours: 8.75,
      breakTime: 1,
      workingHours: 7.75,
      dailySalary: 294.5,
      status: "Present",
      overtime: 0.75,
      overtimePay: 42.75,
    },
    {
      id: 4,
      employeeId: "EMP004",
      name: "Emma Davis",
      department: "Human Resources",
      position: "HR Manager",
      hourlyRate: 42,
      checkIn: "08:30",
      checkOut: "17:30",
      totalHours: 9,
      breakTime: 1,
      workingHours: 8,
      dailySalary: 336,
      status: "Present",
      overtime: 1,
      overtimePay: 63,
    },
    {
      id: 5,
      employeeId: "EMP005",
      name: "Alex Rodriguez",
      department: "Marketing",
      position: "Marketing Specialist",
      hourlyRate: 35,
      checkIn: "09:30",
      checkOut: "16:00",
      totalHours: 6.5,
      breakTime: 0.5,
      workingHours: 6,
      dailySalary: 210,
      status: "Half Day",
      overtime: 0,
      overtimePay: 0,
    },
    {
      id: 6,
      employeeId: "EMP006",
      name: "Lisa Chen",
      department: "Analytics",
      position: "Data Analyst",
      hourlyRate: 40,
      checkIn: null,
      checkOut: null,
      totalHours: 0,
      breakTime: 0,
      workingHours: 0,
      dailySalary: 0,
      status: "Absent",
      overtime: 0,
      overtimePay: 0,
    },
  ];

  // Department and status options
  const departments = [
    "all",
    "Engineering",
    "Product",
    "Design",
    "Human Resources",
    "Marketing",
    "Analytics",
  ];
  const statuses = ["all", "Present", "Absent", "Half Day", "Late", "On Leave"];

  // Stats data
  const stats = [
    {
      title: "Total Present",
      value: attendanceData
        .filter((emp) => emp.status === "Present")
        .length.toString(),
      icon: CheckCircle,
      type: "present",
      change: "+5%",
      changeType: "positive",
    },
    {
      title: "Total Absent",
      value: attendanceData
        .filter((emp) => emp.status === "Absent")
        .length.toString(),
      icon: XCircle,
      type: "absent",
      change: "-2%",
      changeType: "positive",
    },
    {
      title: "Daily Salary Total",
      value: `$${attendanceData
        .reduce((sum, emp) => sum + emp.dailySalary, 0)
        .toLocaleString()}`,
      icon: DollarSign,
      type: "salary",
      change: "+12%",
      changeType: "positive",
    },
    {
      title: "Avg. Working Hours",
      value: `${(
        attendanceData.reduce((sum, emp) => sum + emp.workingHours, 0) /
        attendanceData.length
      ).toFixed(1)}h`,
      icon: Clock,
      type: "hours",
      change: "+0.5h",
      changeType: "positive",
    },
  ];

  // Chart data for attendance status
  const attendanceChartData = [
    {
      name: "Present",
      value: attendanceData.filter((emp) => emp.status === "Present").length,
      color: "#22c55e",
    },
    {
      name: "Absent",
      value: attendanceData.filter((emp) => emp.status === "Absent").length,
      color: "#ef4444",
    },
    {
      name: "Half Day",
      value: attendanceData.filter((emp) => emp.status === "Half Day").length,
      color: "#f59e0b",
    },
    {
      name: "Late",
      value: attendanceData.filter((emp) => emp.status === "Late").length,
      color: "#f97316",
    },
  ];

  // Department-wise attendance data
  const departmentData = departments.slice(1).map((dept) => ({
    department: dept,
    present: attendanceData.filter(
      (emp) => emp.department === dept && emp.status === "Present"
    ).length,
    absent: attendanceData.filter(
      (emp) => emp.department === dept && emp.status === "Absent"
    ).length,
    halfDay: attendanceData.filter(
      (emp) => emp.department === dept && emp.status === "Half Day"
    ).length,
  }));

  // Hourly salary trend (sample data for last 7 days)
  const salaryTrendData = [
    { day: "Mon", salary: 2450 },
    { day: "Tue", salary: 2680 },
    { day: "Wed", salary: 2520 },
    { day: "Thu", salary: 2750 },
    { day: "Fri", salary: 2830 },
    { day: "Sat", salary: 1950 },
    { day: "Sun", salary: 1200 },
  ];

  // Filter attendance data
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
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="date-picker"
              />
              <button className="btn-secondary-small">
                <Download className="btn-icon" />
                Export Report
              </button>
              <button className="btn-primary-small">
                <Calculator className="btn-icon" />
                Calculate Salaries
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
                <Users className="chart-title-icon" />
                Attendance Status Distribution
              </h3>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={attendanceChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {attendanceChartData.map((entry, index) => (
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
                <DollarSign className="chart-title-icon" />
                Weekly Salary Trend
              </h3>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={salaryTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`$${value}`, "Daily Salary"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="salary"
                    stroke="#3b82f6"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="charts-section">
          <div className="chart-card full-width">
            <div className="chart-header">
              <h3 className="chart-title">
                <Timer className="chart-title-icon" />
                Department-wise Attendance
              </h3>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" fill="#22c55e" name="Present" />
                  <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                  <Bar dataKey="halfDay" fill="#f59e0b" name="Half Day" />
                </BarChart>
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
              Daily Attendance & Salary Records ({
                filteredAttendance.length
              }{" "}
              employees)
            </h3>
          </div>

          <div className="table-container-compact">
            <table className="attendance-table-compact">
              <thead className="table-header-compact">
                <tr>
                  <th className="table-header-cell-compact">Employee</th>
                  <th className="table-header-cell-compact">Department</th>
                  <th className="table-header-cell-compact">Time Tracking</th>
                  <th className="table-header-cell-compact">Hours & Rate</th>
                  <th className="table-header-cell-compact">Daily Salary</th>
                  <th className="table-header-cell-compact">Status</th>
                  <th className="table-header-cell-compact">Actions</th>
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
                            ${employee.hourlyRate}/hr
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
                          ${employee.dailySalary.toFixed(2)}
                        </div>
                        {employee.overtimePay > 0 && (
                          <div className="overtime-pay">
                            +${employee.overtimePay.toFixed(2)} OT
                          </div>
                        )}
                        <div className="total-salary">
                          Total: $
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

                    <td className="table-cell-compact">
                      <div className="action-buttons-compact">
                        <button
                          className="action-btn-compact view"
                          title="View Details"
                        >
                          <Eye className="action-icon-small" />
                        </button>
                        <button
                          className="action-btn-compact edit"
                          title="Edit Attendance"
                        >
                          <Edit className="action-icon-small" />
                        </button>
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
      </div>
    </div>
  );
};

export default Attendance;
