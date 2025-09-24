import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  roundSalary,
  formatSalary,
  formatSalaryForPDF,
} from "../utils/salaryUtils.js";
import { getMonthDataByName, getAvailableMonths } from "../data/monthlyData";
import "./SalaryReport.css";

const SalaryReport = ({
  isOwnerView = false,
  selectedMonth: propSelectedMonth,
  monthData: propMonthData,
}) => {
  const [selectedMonth, setSelectedMonth] = useState(
    propSelectedMonth || "august"
  );
  const [selectedYear] = useState("2025");
  const [salaryData, setSalaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get available months from our data
  const availableMonths = getAvailableMonths();
  const months = availableMonths.map((month) => ({
    value: month.value,
    label: month.label.split(" ")[0], // Extract month name only
  }));

  // Process monthly data to create salary report format
  const processMonthlyDataToSalaryReport = (monthData) => {
    if (!monthData) return null;

    // Create employee data from department breakdown and sample employee details
    const employees = [];
    let totalHours = 0;

    // Generate employee records based on department breakdown
    monthData.departmentBreakdown.forEach((dept, deptIndex) => {
      for (let i = 0; i < dept.employeeCount; i++) {
        const hoursWorked = (dept.totalPresentDays / dept.employeeCount) * 8; // Assuming 8 hours per day
        const hourlyRate = Math.round(
          dept.avgSalary / (monthData.totalWorkingDays * 8)
        );
        const attendanceRate = dept.attendanceRate;

        totalHours += hoursWorked;

        employees.push({
          employeeId: `EMP${String(deptIndex * 10 + i + 1).padStart(3, "0")}`,
          name: `${dept.departmentName} Employee ${i + 1}`,
          department: dept.departmentName,
          position:
            i === 0
              ? `${dept.departmentName} Lead`
              : `${dept.departmentName} Associate`,
          presentDays: Math.round(dept.totalPresentDays / dept.employeeCount),
          totalHours: hoursWorked,
          hourlyRate: hourlyRate,
          totalSalary: dept.avgSalary,
          attendanceRate: attendanceRate,
        });
      }
    });

    return {
      employees: employees,
      summary: {
        totalEmployees: monthData.totalEmployees,
        totalHours: totalHours,
        totalSalary: monthData.totalSalaryPaid,
        averageAttendance: monthData.avgAttendanceRate,
      },
    };
  };

  // Load salary data from monthly summary data
  const loadSalaryData = (month) => {
    setLoading(true);
    setError(null);

    try {
      const monthData = getMonthDataByName(month);
      if (monthData) {
        const processedData = processMonthlyDataToSalaryReport(monthData);
        setSalaryData(processedData);
      } else {
        setError("No data available for selected month");
        setSalaryData(null);
      }
    } catch (err) {
      console.error("Error processing salary data:", err);
      setError(err.message);
      setSalaryData(null);
    } finally {
      setLoading(false);
    }
  };

  // Update data when month changes or props change
  useEffect(() => {
    if (propSelectedMonth && propMonthData && isOwnerView) {
      // Use data passed from Owner Dashboard
      const processedData = processMonthlyDataToSalaryReport(propMonthData);
      setSalaryData(processedData);
      setSelectedMonth(propSelectedMonth);
    } else {
      // Load data based on selected month
      loadSalaryData(selectedMonth);
    }
  }, [selectedMonth, propSelectedMonth, propMonthData, isOwnerView]);

  const handleMonthChange = (e) => {
    if (!isOwnerView) {
      setSelectedMonth(e.target.value);
    }
  };

  const getAttendanceBadgeClass = (rate) => {
    if (rate >= 90) return "excellent";
    if (rate >= 70) return "good";
    return "average";
  };

  const generatePDF = () => {
    if (!salaryData || !salaryData.employees.length) {
      alert("No data available to generate PDF");
      return;
    }

    try {
      console.log("Starting PDF generation...");
      console.log("Salary data:", salaryData);

      const doc = new jsPDF();
      const currentMonthName =
        months.find((m) => m.value === selectedMonth)?.label || "Unknown";

      console.log("Creating PDF document...");

      // Add title
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text(`Salary Report - ${currentMonthName} ${selectedYear}`, 14, 22);

      // Add generation date
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);

      // Add summary section
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text("Summary", 14, 50);

      // Summary information
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
      let yPosition = 65;

      doc.text(
        `Total Employees: ${salaryData.summary.totalEmployees}`,
        14,
        yPosition
      );
      yPosition += 8;
      doc.text(
        `Total Working Hours: ${salaryData.summary.totalHours.toFixed(2)}`,
        14,
        yPosition
      );
      yPosition += 8;
      doc.text(
        `Total Salary Paid: Rs. ${roundSalary(salaryData.summary.totalSalary)}`,
        14,
        yPosition
      );
      yPosition += 8;
      doc.text(
        `Average Attendance: ${salaryData.summary.averageAttendance.toFixed(
          1
        )}%`,
        14,
        yPosition
      );
      yPosition += 20;

      // Employee details section
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text("Employee Details", 14, yPosition);
      yPosition += 15;

      console.log("Creating employee table...");
      console.log("autoTable available?", typeof doc.autoTable);

      // Check if autoTable is available
      if (typeof doc.autoTable === "function") {
        console.log("Using autoTable...");

        // Create employee table using autoTable
        const employeeTableData = salaryData.employees.map((emp) => [
          emp.employeeId || "",
          emp.name || "",
          emp.department || "",
          (emp.presentDays || 0).toString(),
          (emp.totalHours || 0).toFixed(2),
          `${(emp.attendanceRate || 0).toFixed(1)}%`,
          formatSalaryForPDF(emp.totalSalary || 0),
        ]);

        doc.autoTable({
          startY: yPosition,
          head: [
            [
              "Employee ID",
              "Name",
              "Department",
              "Present Days",
              "Hours",
              "Attendance %",
              "Total Salary",
            ],
          ],
          body: employeeTableData,
          theme: "grid",
          headStyles: {
            fillColor: [51, 122, 183],
            textColor: [255, 255, 255],
            fontSize: 10,
            fontStyle: "bold",
          },
          bodyStyles: {
            fontSize: 9,
            textColor: [51, 51, 51],
          },
          alternateRowStyles: {
            fillColor: [248, 249, 250],
          },
          margin: { left: 14, right: 14 },
          columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 35 },
            2: { cellWidth: 30 },
            3: { cellWidth: 20 },
            4: { cellWidth: 20 },
            5: { cellWidth: 25 },
            6: { cellWidth: 30 },
          },
        });

        // Add total salary summary at the end
        const finalY = doc.lastAutoTable.finalY + 20;
        doc.setFontSize(14);
        doc.setTextColor(40, 40, 40);
        doc.text("Total Summary", 14, finalY);

        // Add total salary box
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        doc.setFillColor(240, 240, 240);
        doc.rect(14, finalY + 10, 180, 25, "F");
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.text(
          `Total Salary Paid to All Employees: Rs. ${roundSalary(
            salaryData.summary.totalSalary
          )}`,
          20,
          finalY + 25
        );

        // Add footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          const pageText = `Page ${i} of ${pageCount}`;
          const pageWidth = doc.internal.pageSize.width;
          const textWidth = doc.getTextWidth(pageText);
          doc.text(
            pageText,
            pageWidth - textWidth - 14,
            doc.internal.pageSize.height - 10
          );
        }
      } else {
        console.log("autoTable not available, creating manual table...");

        // Manual table creation
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);

        // Table headers
        const headers = [
          "Employee ID",
          "Name",
          "Department",
          "Present Days",
          "Hours",
          "Attendance %",
          "Total Salary",
        ];
        const colWidths = [25, 35, 30, 20, 20, 25, 30];
        let xPos = 14;

        // Draw header row
        doc.setFontSize(9);
        doc.setFont(undefined, "bold");
        headers.forEach((header, index) => {
          doc.text(header, xPos, yPosition);
          xPos += colWidths[index];
        });

        yPosition += 10;
        doc.setFont(undefined, "normal");

        // Draw employee data
        salaryData.employees.forEach((emp, empIndex) => {
          if (yPosition > 270) {
            // Check if we need a new page
            doc.addPage();
            yPosition = 20;

            // Redraw headers on new page
            xPos = 14;
            doc.setFont(undefined, "bold");
            headers.forEach((header, index) => {
              doc.text(header, xPos, yPosition);
              xPos += colWidths[index];
            });
            yPosition += 10;
            doc.setFont(undefined, "normal");
          }

          const rowData = [
            emp.employeeId || "",
            emp.name || "",
            emp.department || "",
            (emp.presentDays || 0).toString(),
            (emp.totalHours || 0).toFixed(2),
            `${(emp.attendanceRate || 0).toFixed(1)}%`,
            formatSalaryForPDF(emp.totalSalary || 0),
          ];

          xPos = 14;
          rowData.forEach((cellData, index) => {
            // Truncate text if too long
            const maxLength = Math.floor(colWidths[index] / 2);
            const displayText =
              cellData.length > maxLength
                ? cellData.substring(0, maxLength - 3) + "..."
                : cellData;
            doc.text(displayText, xPos, yPosition);
            xPos += colWidths[index];
          });

          yPosition += 8;
        });

        // Add total salary summary at the end for manual table
        yPosition += 20;
        if (yPosition > 250) {
          // Check if we need a new page for summary
          doc.addPage();
          yPosition = 30;
        }

        doc.setFontSize(14);
        doc.setTextColor(40, 40, 40);
        doc.text("Total Summary", 14, yPosition);

        // Add total salary information
        yPosition += 15;
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, "bold");
        doc.text(
          `Total Salary Paid to All Employees: Rs. ${roundSalary(
            salaryData.summary.totalSalary
          )}`,
          14,
          yPosition
        );
        doc.setFont(undefined, "normal");

        // Add footer for manual table
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          const pageText = `Page ${i} of ${pageCount}`;
          const pageWidth = doc.internal.pageSize.width;
          const textWidth = doc.getTextWidth(pageText);
          doc.text(
            pageText,
            pageWidth - textWidth - 14,
            doc.internal.pageSize.height - 10
          );
        }
      }

      console.log("PDF content created, saving...");

      // Save the PDF
      doc.save(`Salary_Report_${currentMonthName}_${selectedYear}.pdf`);

      console.log("PDF saved successfully!");
    } catch (error) {
      console.error("Detailed PDF error:", error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      alert(
        `PDF generation failed: ${error.message}. Please check the browser console for more details.`
      );
    }
  };

  if (loading) {
    return (
      <div className="salary-report">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading salary data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="salary-report">
        <div className="error-message">
          <h3>Error loading data</h3>
          <p>{error}</p>
          <button onClick={() => loadSalaryData(selectedMonth)}>Retry</button>
        </div>
      </div>
    );
  }

  const currentMonthName =
    months.find((m) => m.value === selectedMonth)?.label ||
    (selectedMonth &&
      selectedMonth.charAt(0).toUpperCase() + selectedMonth.slice(1)) ||
    "Unknown";
  const hasData =
    salaryData && salaryData.employees && salaryData.employees.length > 0;

  return (
    <div className="salary-report">
      <div className="header-content">
        <div className="header-info">
          <h1>Salary Report</h1>
          <p>Monthly salary and attendance analysis</p>
        </div>

        <div className="header-controls">
          {!isOwnerView && (
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="month-dropdown"
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label} {selectedYear}
                </option>
              ))}
            </select>
          )}

          {isOwnerView && (
            <div className="owner-view-label">
              <span>
                Current Selection: {currentMonthName} {selectedYear}
              </span>
            </div>
          )}

          {hasData && (
            <button onClick={generatePDF} className="download-btn">
              <svg
                className="download-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download PDF
            </button>
          )}
        </div>
      </div>

      {!hasData ? (
        <div className="no-data-message">
          <div className="no-data-content">
            <svg
              className="no-data-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3>No Data Available</h3>
            <p>
              No salary data found for {currentMonthName} {selectedYear}
            </p>
            <small>
              Please select a month with attendance data or contact
              administrator
            </small>
          </div>
        </div>
      ) : (
        <>
          <div className="salary-summary-cards">
            <div className="summary-card">
              <div className="card-icon total-employees">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="card-content">
                <h3>Total Employees</h3>
                <div className="card-value">
                  {salaryData.summary.totalEmployees}
                </div>
                <div className="card-label">Active employees</div>
              </div>
            </div>

            <div className="summary-card">
              <div className="card-icon total-hours">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="card-content">
                <h3>Total Hours</h3>
                <div className="card-value">
                  {salaryData.summary.totalHours.toFixed(0)}
                </div>
                <div className="card-label">Working hours</div>
              </div>
            </div>

            <div className="summary-card">
              <div className="card-icon total-salary">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2v20m8-9H4m4-7h8m-8 14h8" />
                </svg>
              </div>
              <div className="card-content">
                <h3>Total Salary</h3>
                <div className="card-value">
                  ₹{roundSalary(salaryData.summary.totalSalary)}
                </div>
                <div className="card-label">Paid amount</div>
              </div>
            </div>

            <div className="summary-card">
              <div className="card-icon attendance">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="card-content">
                <h3>Attendance Rate</h3>
                <div className="card-value">
                  {salaryData.summary.averageAttendance.toFixed(1)}%
                </div>
                <div className="card-label">Average rate</div>
              </div>
            </div>
          </div>

          <div className="salary-table-container">
            <div className="table-header">
              <h2>
                Employee Salary Details - {currentMonthName} {selectedYear}
              </h2>
              <p>Detailed breakdown of employee salaries and attendance</p>
            </div>

            <div className="salary-table">
              <table>
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Position</th>
                    <th>Present Days</th>
                    <th>Total Hours</th>
                    <th>Hourly Rate</th>
                    <th>Total Salary</th>
                    <th>Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {salaryData.employees.map((employee) => (
                    <tr key={employee.employeeId}>
                      <td>{employee.employeeId}</td>
                      <td>{employee.name}</td>
                      <td>{employee.department}</td>
                      <td>{employee.position}</td>
                      <td>{employee.presentDays}</td>
                      <td>{employee.totalHours.toFixed(1)}</td>
                      <td>₹{employee.hourlyRate}</td>
                      <td>₹{roundSalary(employee.totalSalary)}</td>
                      <td>
                        <span
                          className={`attendance-badge ${getAttendanceBadgeClass(
                            employee.attendanceRate
                          )}`}
                        >
                          {employee.attendanceRate.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SalaryReport;
