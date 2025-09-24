import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
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
    name: {
      type: String,
      required: [true, "Employee name is required"],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
    },
    position: {
      type: String,
      required: [true, "Position is required"],
    },
    date: {
      type: Date,
      required: [true, "Attendance date is required"],
      default: Date.now,
    },
    checkIn: {
      type: String,
      trim: true,
    },
    checkOut: {
      type: String,
      trim: true,
    },
    checkInTime: {
      type: Date,
    },
    checkOutTime: {
      type: Date,
    },
    totalHours: {
      type: Number,
      min: [0, "Total hours cannot be negative"],
      default: 0,
    },
    workingHours: {
      type: Number,
      min: [0, "Working hours cannot be negative"],
      default: 0,
    },
    overtimeHours: {
      type: Number,
      min: [0, "Overtime hours cannot be negative"],
      default: 0,
    },
    overtime: {
      type: Number,
      min: [0, "Overtime cannot be negative"],
      default: 0,
    },
    breakTime: {
      type: Number,
      min: [0, "Break time cannot be negative"],
      default: 1,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "On Leave", "Off Day"],
      required: [true, "Attendance status is required"],
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    method: {
      type: String,
      enum: ["location", "manual"],
      default: "location",
    },
    requestType: {
      type: String,
      enum: ["checkin", "checkout"],
    },
    location: {
      lat: Number,
      lng: Number,
      accuracy: Number
    },
    hourlyRate: {
      type: Number,
      min: [0, "Hourly rate cannot be negative"],
      default: 0,
    },
    regularPay: {
      type: Number,
      min: [0, "Regular pay cannot be negative"],
      default: 0,
    },
    overtimePay: {
      type: Number,
      min: [0, "Overtime pay cannot be negative"],
      default: 0,
    },
    totalPay: {
      type: Number,
      min: [0, "Total pay cannot be negative"],
      default: 0,
    },
    dailySalary: {
      type: Number,
      min: [0, "Daily salary cannot be negative"],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Helper function to calculate payment based on partial minutes
function calculatePartialHourPayment(minutes, hourlyRate) {
  if (minutes >= 45) {
    return hourlyRate * 0.75;
  } else if (minutes >= 30) {
    return hourlyRate * 0.5;
  } else if (minutes >= 15) {
    return hourlyRate * 0.25;
  } else {
    return 0;
  }
}

// Pre-save middleware to calculate working hours and pay
attendanceSchema.pre('save', function(next) {
  // Check if the date is a Sunday (0 = Sunday in JavaScript)
  const attendanceDate = new Date(this.date);
  const dayOfWeek = attendanceDate.getDay();
  
  if (dayOfWeek === 0) { // Sunday
    // Set status to Off Day for Sundays
    this.status = 'Off Day';
    // Reset all work-related fields for off days
    this.checkInTime = null;
    this.checkOutTime = null;
    this.checkIn = null;
    this.checkOut = null;
    this.totalHours = 0;
    this.workingHours = 0;
    this.regularPay = 0;
    this.totalPay = 0;
    this.approvalStatus = 'approved'; // Auto-approve off days
    return next();
  }
  
  // Calculate total hours if check-in and check-out times are available
  if (this.checkInTime && this.checkOutTime) {
    const totalMilliseconds = this.checkOutTime - this.checkInTime;
    this.totalHours = totalMilliseconds / (1000 * 60 * 60); // Convert to hours
    
    // Calculate working hours by subtracting break time (default 1 hour)
    const workingMilliseconds = Math.max(0, totalMilliseconds - (this.breakTime * 60 * 60 * 1000));
    this.workingHours = workingMilliseconds / (1000 * 60 * 60);
    
    // Calculate pay if hourly rate is available
    if (this.hourlyRate > 0) {
      const totalWorkingMinutes = workingMilliseconds / (1000 * 60);
      
      // Calculate full hours and remaining minutes
      const fullHours = Math.floor(totalWorkingMinutes / 60);
      const remainingMinutes = totalWorkingMinutes % 60;
      
      // Calculate pay for all hours at the same rate
      let totalPay = 0;
      
      // Calculate pay for full hours
      totalPay = fullHours * this.hourlyRate;
      
      // Add partial hour payment for remaining minutes
      totalPay += calculatePartialHourPayment(remainingMinutes, this.hourlyRate);
      
      // Store calculated values
      this.regularPay = Math.round(totalPay * 100) / 100;
      this.totalPay = Math.round(totalPay * 100) / 100;
    }
    
    // Set status to Present if they have both check-in and check-out times
    if (this.status !== 'On Leave' && this.status !== 'Absent' && this.status !== 'Off Day') {
      this.status = 'Present';
    }
  } else if (this.checkInTime && !this.checkOutTime) {
    // If only checked in but not checked out, still consider present
    if (this.status !== 'On Leave' && this.status !== 'Absent' && this.status !== 'Off Day') {
      this.status = 'Present';
    }
  }
  // If no check-in time, status remains as set (likely Absent or On Leave)
  
  next();
});

// Compound index for unique attendance per employee per day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);
