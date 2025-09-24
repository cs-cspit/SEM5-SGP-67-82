import React, { useState, useEffect } from "react";
import {
  BarChart3,
  IndianRupee,
  LogOut,
  Crown,
  PieChart,
  Users,
  Clock,
  TrendingUp,
  Calendar,
  ChevronDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import SalaryReport from "./SalaryReport";
import {
  getMonthDataByName,
  getAvailableMonths,
  processChartData,
  calculatePreviousMonthComparison,
  monthlySummaryData,
} from "../data/monthlyData";
import "./OwnerPortal.css";

const OwnerDashboard = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [currentMonthData, setCurrentMonthData] = useState(null);
  const [chartData, setChartData] = useState(null);

  // Get available months from real data
  const monthOptions = [
    { value: "", label: "Select a month..." },
    ...getAvailableMonths(),
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  // Handle month change
  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    setShowMessage(false);

    if (month) {
      // Get real data for selected month
      const monthData = getMonthDataByName(month);
      if (monthData) {
        setCurrentMonthData(monthData);
        setChartData(processChartData(monthData));
      } else {
        setCurrentMonthData(null);
        setChartData(null);
      }
    } else {
      setCurrentMonthData(null);
      setChartData(null);
    }
  };

  // Handle section click
  const handleSectionClick = (sectionId) => {
    if (!selectedMonth) {
      setShowMessage(true);
      setActiveSection("");
      return;
    }
    setShowMessage(false);
    setActiveSection(sectionId);
  };

  const navigationItems = [
    { id: "analytics", label: "Analytics Overview", icon: BarChart3 },
    { id: "charts", label: "Charts & Graphs", icon: PieChart },
    { id: "salary", label: "Salary Reports", icon: IndianRupee },
  ];

  // Month Selector Component
  const MonthSelector = () => (
    <div className="main-month-selector">
      <div className="month-selector-container">
        <Calendar size={18} />
        <select
          value={selectedMonth}
          onChange={(e) => handleMonthChange(e.target.value)}
          className="main-month-select"
        >
          {monthOptions.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="main-dropdown-icon" />
      </div>
      {selectedMonth && !currentMonthData && (
        <div className="main-no-data-warning">
          <span>⚠️ No data available for selected month</span>
        </div>
      )}
    </div>
  );

  // Message Component
  const SelectMonthMessage = () => (
    <div className="select-month-message">
      <div className="message-content">
        <Calendar size={48} className="message-icon" />
        <h3>Please Select a Month</h3>
        <p>
          Please select a month from the dropdown above to view analytics,
          charts, and salary reports.
        </p>
      </div>
    </div>
  );

  const renderAnalyticsCards = () => {
    if (!selectedMonth || !currentMonthData) {
      return (
        <div className="no-data-placeholder">
          <span>📊 Please select a month to view analytics data</span>
        </div>
      );
    }

    // Calculate previous month comparison for growth indicators
    const attendanceComparison = calculatePreviousMonthComparison(
      currentMonthData,
      "avgAttendanceRate"
    );
    const salaryComparison = calculatePreviousMonthComparison(
      currentMonthData,
      "avgSalary"
    );

    return (
      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="stat-header">
            <div className="stat-info">
              <h3>Total Employees</h3>
              <p className="analytics-value">
                {currentMonthData.totalEmployees}
              </p>
              <p className="analytics-change neutral">
                {currentMonthData.newHires > 0 &&
                  `+${currentMonthData.newHires} new hires`}
                {currentMonthData.resignations > 0 &&
                  ` -${currentMonthData.resignations} resignations`}
                {currentMonthData.newHires === 0 &&
                  currentMonthData.resignations === 0 &&
                  "No changes"}
              </p>
            </div>
            <div className="stat-icon">
              <Users size={20} />
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="stat-header">
            <div className="stat-info">
              <h3>Average Attendance</h3>
              <p className="analytics-value">
                {currentMonthData.avgAttendanceRate}%
              </p>
              <p
                className={`analytics-change ${
                  attendanceComparison?.isPositive ? "positive" : "negative"
                }`}
              >
                {attendanceComparison
                  ? `${attendanceComparison.isPositive ? "+" : ""}${
                      attendanceComparison.change
                    }% from last month`
                  : "First month data"}
              </p>
            </div>
            <div className="stat-icon">
              <TrendingUp size={20} />
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="stat-header">
            <div className="stat-info">
              <h3>Monthly Salary</h3>
              <p className="analytics-value">
                ₹{(currentMonthData.totalSalaryPaid / 100000).toFixed(1)}L
              </p>
              <p
                className={`analytics-change ${
                  salaryComparison?.isPositive ? "positive" : "neutral"
                }`}
              >
                {salaryComparison
                  ? `${salaryComparison.isPositive ? "+" : ""}${
                      salaryComparison.change
                    }% from last month`
                  : monthOptions.find((m) => m.value === selectedMonth)?.label}
              </p>
            </div>
            <div className="stat-icon">
              <IndianRupee size={20} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCharts = () => {
    // Prepare data for the new charts
    const getMonthlyAttendanceTrend = () => {
      return monthlySummaryData.map((month) => ({
        month: month.monthName,
        attendance: month.avgAttendanceRate,
        employees: month.totalEmployees,
      }));
    };

    const getDepartmentAttendanceData = () => {
      if (!currentMonthData) return [];
      return currentMonthData.departmentBreakdown.map((dept) => ({
        department: dept.departmentName,
        attendance: dept.attendanceRate,
        color:
          dept.attendanceRate >= 90
            ? "#10b981"
            : dept.attendanceRate >= 80
            ? "#f59e0b"
            : "#ef4444",
      }));
    };

    const getDepartmentEmployeeCount = () => {
      if (!currentMonthData) return [];
      return currentMonthData.departmentBreakdown.map((dept) => ({
        department: dept.departmentName,
        count: dept.employeeCount,
      }));
    };

    const getWeeklyAttendanceData = () => {
      if (!currentMonthData) return [];
      return currentMonthData.weeklyData.map((week) => ({
        week: week.weekLabel,
        present: week.presentEmployees,
        absent: week.absentEmployees,
        total: week.totalEmployees,
      }));
    };

    const getSalaryDistributionData = () => {
      if (!currentMonthData) return [];
      // Create salary ranges for histogram
      const salaryRanges = [
        { range: "200K-250K", count: 0, min: 200000, max: 250000 },
        { range: "250K-300K", count: 0, min: 250000, max: 300000 },
        { range: "300K-350K", count: 0, min: 300000, max: 350000 },
        { range: "350K+", count: 0, min: 350000, max: Infinity },
      ];

      currentMonthData.departmentBreakdown.forEach((dept) => {
        salaryRanges.forEach((range) => {
          if (dept.avgSalary >= range.min && dept.avgSalary < range.max) {
            range.count += dept.employeeCount;
          }
        });
      });

      return salaryRanges;
    };

    const getTotalSalaryTrend = () => {
      return monthlySummaryData.map((month) => ({
        month: month.monthName,
        totalSalary: month.totalSalaryPaid / 100000, // Convert to lakhs
        employees: month.totalEmployees,
      }));
    };

    return (
      <div className="charts-section">
        {/* 1. Monthly Attendance Trend */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>Monthly Attendance Trend</h3>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={getMonthlyAttendanceTrend()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e0e7ff",
                    borderRadius: "8px",
                  }}
                  formatter={(value, name) => [
                    name === "attendance" ? `${value}%` : value,
                    name === "attendance" ? "Attendance Rate" : "Employees",
                  ]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="attendance"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  name="Attendance %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="charts-row">
          {/* 2. Department-wise Attendance */}
          <div className="chart-container">
            <div className="chart-header">
              <h3>
               Department-wise Attendance -{" "}
                {selectedMonth &&
                  monthOptions.find((m) => m.value === selectedMonth)?.label}
              </h3>
            </div>
            <div className="chart-content">
              {getDepartmentAttendanceData().length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getDepartmentAttendanceData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis dataKey="department" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e0e7ff",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => [`${value}%`, "Attendance Rate"]}
                    />
                    <Bar dataKey="attendance">
                      {getDepartmentAttendanceData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="no-data-placeholder">
                  <span>
                    Please select a month to view department attendance
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 3. Department-wise Employee Count */}
          <div className="chart-container">
            <div className="chart-header">
              <h3>
                Department-wise Employee Count -{" "}
                {selectedMonth &&
                  monthOptions.find((m) => m.value === selectedMonth)?.label}
              </h3>
              
            </div>
            <div className="chart-content">
              {getDepartmentEmployeeCount().length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getDepartmentEmployeeCount()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis dataKey="department" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e0e7ff",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => [value, "Employees"]}
                    />
                    <Bar dataKey="count" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="no-data-placeholder">
                  <span>🏢 Please select a month to view employee count</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="charts-row">
          {/* 4. Weekly Attendance Overview */}
          <div className="chart-container">
            <div className="chart-header">
              <h3>
                Weekly Attendance Overview -{" "}
                {selectedMonth &&
                  monthOptions.find((m) => m.value === selectedMonth)?.label}
              </h3>
            
            </div>
            <div className="chart-content">
              {getWeeklyAttendanceData().length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getWeeklyAttendanceData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis dataKey="week" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e0e7ff",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="present"
                      stackId="a"
                      fill="#10b981"
                      name="Present"
                    />
                    <Bar
                      dataKey="absent"
                      stackId="a"
                      fill="#ef4444"
                      name="Absent"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="no-data-placeholder">
                  <span>
                    Please select a month to view weekly attendance
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 5. Salary Distribution */}
          <div className="chart-container">
            <div className="chart-header">
              <h3>
                Salary Distribution -{" "}
                {selectedMonth &&
                  monthOptions.find((m) => m.value === selectedMonth)?.label}
              </h3>
             
            </div>
            <div className="chart-content">
              {getSalaryDistributionData().length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getSalaryDistributionData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis dataKey="range" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e0e7ff",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => [value, "Employees"]}
                    />
                    <Bar dataKey="count" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="no-data-placeholder">
                  <span>
                    � Please select a month to view salary distribution
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 6. Total Salary Expense Trend */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>Total Salary Expense Trend</h3>
            
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getTotalSalaryTrend()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e0e7ff",
                    borderRadius: "8px",
                  }}
                  formatter={(value, name) => [
                    name === "totalSalary" ? `₹${value}L` : value,
                    name === "totalSalary" ? "Total Salary" : "Employees",
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalSalary"
                  stroke="#ef4444"
                  strokeWidth={3}
                  name="Total Salary (₹L)"
                />
                <Line
                  type="monotone"
                  dataKey="employees"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Employee Count"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (showMessage || !selectedMonth) {
      return <SelectMonthMessage />;
    }

    switch (activeSection) {
      case "analytics":
        return (
          <div>
            <div className="section-header">
              <BarChart3 className="section-icon" />
              <h2>
                Analytics Overview -{" "}
                {monthOptions.find((m) => m.value === selectedMonth)?.label}
              </h2>
            </div>
            {renderAnalyticsCards()}
          </div>
        );

      case "charts":
        return (
          <div>
            <div className="section-header">
              <PieChart className="section-icon" />
              <h2>
                Charts & Visualization -{" "}
                {monthOptions.find((m) => m.value === selectedMonth)?.label}
              </h2>
            </div>
            {renderCharts()}
          </div>
        );

      case "salary":
        return (
          <div>
            <div className="section-header">
              <IndianRupee className="section-icon" />
              <h2>
                Salary Reports & Analysis -{" "}
                {monthOptions.find((m) => m.value === selectedMonth)?.label}
              </h2>
            </div>
            <SalaryReport
              isOwnerView={true}
              selectedMonth={selectedMonth}
              monthData={currentMonthData}
            />
          </div>
        );

      default:
        return <SelectMonthMessage />;
    }
  };

  return (
    <div className="owner-dashboard">
      <header className="owner-header">
        <div className="owner-title">
          <Crown className="owner-icon" size={24} />
          <h1>Owner Portal</h1>
        </div>
        <button onClick={onLogout} className="owner-logout">
          <LogOut size={16} />
          Logout
        </button>
      </header>

      <div className="owner-content">
        <nav className="owner-nav">
          <MonthSelector />
          <div className="owner-nav-buttons">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSectionClick(item.id)}
                className={`owner-nav-button ${
                  activeSection === item.id ? "active" : ""
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="owner-section">{renderContent()}</div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
