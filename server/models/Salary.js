import mongoose from "mongoose";

const salarySchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "Employee reference is required"],
    },
    baseSalary: {
      type: Number,
      required: [true, "Base salary is required"],
      min: [0, "Base salary cannot be negative"],
    },
    hourlyRate: {
      type: Number,
      required: [true, "Hourly rate is required"],
      min: [0, "Hourly rate cannot be negative"],
    },
    overtimeRate: {
      type: Number,
      min: [0, "Overtime rate cannot be negative"],
      default: function () {
        return this.hourlyRate * 1.5;
      },
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
    effectiveFrom: {
      type: Date,
      required: [true, "Effective from date is required"],
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual to calculate gross salary
salarySchema.virtual("grossSalary").get(function () {
  return this.baseSalary + this.allowances;
});

// Virtual to calculate net salary
salarySchema.virtual("netSalary").get(function () {
  return this.grossSalary - this.deductions;
});

module.exports = mongoose.model("Salary", salarySchema);
