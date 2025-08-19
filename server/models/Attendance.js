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
      enum: ["Present", "Absent", "Half Day", "Late", "On Leave"],
      required: [true, "Attendance status is required"],
    },
    hourlyRate: {
      type: Number,
      min: [0, "Hourly rate cannot be negative"],
      default: 0,
    },
    dailySalary: {
      type: Number,
      min: [0, "Daily salary cannot be negative"],
      default: 0,
    },
    overtimePay: {
      type: Number,
      min: [0, "Overtime pay cannot be negative"],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique attendance per employee per day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);
