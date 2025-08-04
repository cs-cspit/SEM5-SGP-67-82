import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  Download,
  Filter,
  Eye,
  FileText,
} from "lucide-react";
import "./SalaryReport.css";

const SalaryReport = () => {
  const handleDownloadReport = () => {
    console.log("Downloading salary report...");
    // Here you would implement the actual download functionality
    // For example: generate PDF, CSV, or Excel file
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="salary-report-page">
      <div className="salary-report-container">
        {/* Header Section */}
        <div className="salary-report-header">
          <div className="header-content">
            <div className="header-info">
              <h1 className="salary-report-title">Salary Report</h1>
              <p className="salary-report-subtitle">
                Monthly attendance summary and salary calculation based on hours
                present
              </p>
              <div className="salary-report-date">
                <Calendar className="date-icon" />
                {currentDate}
              </div>
            </div>
            <div className="header-actions">
              <button onClick={handleDownloadReport} className="download-btn">
                <Download className="download-icon" />
                Download Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryReport;


