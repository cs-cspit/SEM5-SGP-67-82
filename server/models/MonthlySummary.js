const mongoose = require('mongoose');

const departmentBreakdownSchema = new mongoose.Schema({
  departmentId: {
    type: String,
    required: true
  },
  departmentName: {
    type: String,
    required: true
  },
  employeeCount: {
    type: Number,
    required: true,
    min: 0
  },
  totalSalary: {
    type: Number,
    required: true,
    min: 0
  },
  avgSalary: {
    type: Number,
    required: true,
    min: 0
  },
  attendanceRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  totalWorkingDays: {
    type: Number,
    required: true,
    min: 0
  },
  totalPresentDays: {
    type: Number,
    required: true,
    min: 0
  }
});

const employeeSummarySchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true
  },
  employeeName: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  baseSalary: {
    type: Number,
    required: true,
    min: 0
  },
  bonuses: {
    type: Number,
    default: 0,
    min: 0
  },
  deductions: {
    type: Number,
    default: 0,
    min: 0
  },
  finalSalary: {
    type: Number,
    required: true,
    min: 0
  },
  workingDays: {
    type: Number,
    required: true,
    min: 0
  },
  presentDays: {
    type: Number,
    required: true,
    min: 0
  },
  absentDays: {
    type: Number,
    required: true,
    min: 0
  },
  leavesTaken: {
    sickLeave: { type: Number, default: 0 },
    casualLeave: { type: Number, default: 0 },
    annualLeave: { type: Number, default: 0 }
  },
  attendancePercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  overtimeHours: {
    type: Number,
    default: 0,
    min: 0
  },
  overtimePay: {
    type: Number,
    default: 0,
    min: 0
  }
});

const weeklyDataSchema = new mongoose.Schema({
  weekNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  weekLabel: {
    type: String,
    required: true
  },
  attendance: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  productivity: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  totalEmployees: {
    type: Number,
    required: true,
    min: 0
  },
  presentEmployees: {
    type: Number,
    required: true,
    min: 0
  },
  absentEmployees: {
    type: Number,
    required: true,
    min: 0
  }
});

const dailyAttendanceSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  totalEmployees: {
    type: Number,
    required: true,
    min: 0
  },
  present: {
    type: Number,
    required: true,
    min: 0
  },
  absent: {
    type: Number,
    required: true,
    min: 0
  },
  onLeave: {
    type: Number,
    default: 0,
    min: 0
  },
  attendanceRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
});

const leaveSummarySchema = new mongoose.Schema({
  sickLeave: {
    type: Number,
    default: 0,
    min: 0
  },
  casualLeave: {
    type: Number,
    default: 0,
    min: 0
  },
  annualLeave: {
    type: Number,
    default: 0,
    min: 0
  },
  maternityLeave: {
    type: Number,
    default: 0,
    min: 0
  },
  paternityLeave: {
    type: Number,
    default: 0,
    min: 0
  },
  totalLeavesTaken: {
    type: Number,
    required: true,
    min: 0
  },
  pendingLeaveRequests: {
    type: Number,
    default: 0,
    min: 0
  }
});

const monthlySummarySchema = new mongoose.Schema({
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true,
    min: 2020,
    max: 2030
  },
  monthName: {
    type: String,
    required: true
  },
  
  // Employee Summary
  totalEmployees: {
    type: Number,
    required: true,
    min: 0
  },
  activeEmployees: {
    type: Number,
    required: true,
    min: 0
  },
  newHires: {
    type: Number,
    default: 0,
    min: 0
  },
  resignations: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Attendance Summary
  totalWorkingDays: {
    type: Number,
    required: true,
    min: 0
  },
  avgAttendanceRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  presentEmployees: {
    type: Number,
    required: true,
    min: 0
  },
  absentEmployees: {
    type: Number,
    required: true,
    min: 0
  },
  onLeaveEmployees: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Salary Summary
  totalSalaryPaid: {
    type: Number,
    required: true,
    min: 0
  },
  avgSalary: {
    type: Number,
    required: true,
    min: 0
  },
  totalBonuses: {
    type: Number,
    default: 0,
    min: 0
  },
  totalDeductions: {
    type: Number,
    default: 0,
    min: 0
  },
  totalOvertimePay: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Growth Metrics
  monthlyGrowthRate: {
    type: Number,
    default: 0
  },
  salaryGrowthRate: {
    type: Number,
    default: 0
  },
  productivityIndex: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Department-wise breakdown
  departmentBreakdown: [departmentBreakdownSchema],
  
  // Employee-wise details
  employeeDetails: [employeeSummarySchema],
  
  // Weekly data
  weeklyData: [weeklyDataSchema],
  
  // Daily attendance pattern
  dailyAttendance: [dailyAttendanceSchema],
  
  // Leave summary
  leaveSummary: leaveSummarySchema,
  
  // Additional metrics
  metrics: {
    topPerformingDepartment: {
      type: String,
      default: ''
    },
    lowestAttendanceDepartment: {
      type: String,
      default: ''
    },
    averageOvertimeHours: {
      type: Number,
      default: 0
    },
    employeeSatisfactionScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 10
    }
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'monthly_summaries'
});

// Compound index for efficient querying
monthlySummarySchema.index({ year: 1, month: 1 }, { unique: true });

// Virtual for month-year display
monthlySummarySchema.virtual('monthYear').get(function() {
  return `${this.monthName} ${this.year}`;
});

// Pre-save middleware to update timestamps
monthlySummarySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const MonthlySummary = mongoose.model('MonthlySummary', monthlySummarySchema);

module.exports = MonthlySummary;
