import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    position: {
      type: String,
      required: [true, "Position is required"],
      trim: true,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      enum: ["Engineering", "Human Resources", "Marketing", "Finance", "Operations"],
    },
    hourlySalary: {
      type: Number,
      required: [true, "Hourly salary is required"],
      min: [0, "Hourly salary cannot be negative"],
      default: 0,
    },
    joinDate: {
      type: Date,
      required: [true, "Join date is required"],
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Active", "On Leave"],
      default: "Active",
    },
    location: {
      type: String,
      default: "Not specified",
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: null,
    },
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Auto-generate employeeId before saving
employeeSchema.pre("save", async function (next) {
  if (!this.employeeId && this.isNew) {
    const lastEmployee = await this.constructor
      .findOne({}, {}, { sort: { employeeId: -1 } })
      .exec();

    let nextId = 1;
    if (lastEmployee && lastEmployee.employeeId) {
      const lastIdNumber = parseInt(lastEmployee.employeeId.replace("EMP", ""));
      nextId = lastIdNumber + 1;
    }

    this.employeeId = `EMP${nextId.toString().padStart(3, "0")}`;
  }
  next();
});

// Virtual for age calculation
employeeSchema.virtual("age").get(function () {
  if (!this.dateOfBirth) return null;
  
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Virtual for years of service
employeeSchema.virtual("yearsOfService").get(function () {
  const today = new Date();
  const joinDate = new Date(this.joinDate);
  const years = today.getFullYear() - joinDate.getFullYear();
  const monthDiff = today.getMonth() - joinDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < joinDate.getDate())) {
    return Math.max(0, years - 1);
  }
  
  return years;
});

// Virtual for attendance percentage (populated from attendance records)
employeeSchema.virtual("attendance").get(function () {
  return this._attendance || 85; // Default value
});

employeeSchema.set("toJSON", {
  transform: function (doc, ret) {
    if (ret._attendance !== undefined) {
      ret.attendance = ret._attendance;
    }
    return ret;
  },
});

export default mongoose.model("Employee", employeeSchema);
