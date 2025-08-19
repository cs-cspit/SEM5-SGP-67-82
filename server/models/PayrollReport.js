const mongoose = require("mongoose");

const payrollReportSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "Employee reference is required"],
    },
    employeeId: {
      type: String,
      required: [true, "Employee ID is required"],
    },
    employeeName: {
      type: String,
      required: [true, "Employee name is required"],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
    },
    month: {
      type: Number,
      required: [true, "Month is required"],
      min: [1, "Month must be between 1 and 12"],
      max: [12, "Month must be between 1 and 12"],
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      min: [2020, "Year must be 2020 or later"],
    },
    totalWorkingDays: {
      type: Number,
      required: [true, "Total working days is required"],
      min: [0, "Total working days cannot be negative"],
      default: 0,
    },
    presentDays: {
      type: Number,
      required: [true, "Present days is required"],
      min: [0, "Present days cannot be negative"],
      default: 0,
    },
    absentDays: {
      type: Number,
      min: [0, "Absent days cannot be negative"],
      default: 0,
    },
    totalWorkingHours: {
      type: Number,
      min: [0, "Total working hours cannot be negative"],
      default: 0,
    },
    overtimeHours: {
      type: Number,
      min: [0, "Overtime hours cannot be negative"],
      default: 0,
    },
    baseSalary: {
      type: Number,
      required: [true, "Base salary is required"],
      min: [0, "Base salary cannot be negative"],
    },
    allowances: {
      type: Number,
      min: [0, "Allowances cannot be negative"],
      default: 0,
    },
    deductions: {
      type: Number,
      min: [0, "Deductions cannot be negative"],
      default: 0,
    },
    grossSalary: {
      type: Number,
      required: [true, "Gross salary is required"],
      min: [0, "Gross salary cannot be negative"],
    },
    netSalary: {
      type: Number,
      required: [true, "Net salary is required"],
      min: [0, "Net salary cannot be negative"],
    },
    status: {
      type: String,
      enum: ["Generated", "Approved", "Paid"],
      default: "Generated",
    },
    generatedDate: {
      type: Date,
      default: Date.now,
    },
    paymentDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique report per employee per month/year
payrollReportSchema.index(
  { employee: 1, month: 1, year: 1 },
  { unique: true }
);

module.exports = mongoose.model("PayrollReport", payrollReportSchema);
