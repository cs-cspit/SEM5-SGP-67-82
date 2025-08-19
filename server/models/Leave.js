import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
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
    position: {
      type: String,
      required: [true, "Position is required"],
    },
    leaveType: {
      type: String,
      enum: ["Sick Leave", "Annual Leave", "Personal Leave", "Maternity Leave", "Emergency Leave"],
      required: [true, "Leave type is required"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    reason: {
      type: String,
      required: [true, "Reason for leave is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    approvedDate: {
      type: Date,
      default: null,
    },
    approvedBy: {
      type: String,
      default: null,
    },
    rejectedDate: {
      type: Date,
      default: null,
    },
    rejectedBy: {
      type: String,
      default: null,
    },
    attachments: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual to calculate number of days
leaveSchema.virtual("days").get(function () {
  if (!this.startDate || !this.endDate) return 0;
  
  const timeDifference = this.endDate.getTime() - this.startDate.getTime();
  const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24)) + 1;
  
  return daysDifference;
});

export default mongoose.model("Leave", leaveSchema);
