import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    role: {
      type: String,
      enum: ["admin", "hr", "manager", "employee"],
      default: "admin",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
      trim: true,
    },
    address: {
      type: String,
      default: null,
      trim: true,
    },
    subscriptionPlan: {
      type: String,
      enum: ["free", "monthly", "yearly"],
      default: "free",
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "inactive", "cancelled", "trial"],
      default: "trial",
    },
    subscriptionStartDate: {
      type: Date,
      default: Date.now,
    },
    subscriptionEndDate: {
      type: Date,
      default: function() {
        // 14 days trial by default
        const date = new Date();
        date.setDate(date.getDate() + 14);
        return date;
      },
    },
    trialUsed: {
      type: Boolean,
      default: false,
    },
    employeeLimit: {
      type: Number,
      default: 10, // Free trial limit
    },
    features: {
      attendance: { type: Boolean, default: true },
      leaveManagement: { type: Boolean, default: true },
      payroll: { type: Boolean, default: false },
      reports: { type: Boolean, default: false },
      api: { type: Boolean, default: false },
      customBranding: { type: Boolean, default: false },
    },
    preferences: {
      timezone: {
        type: String,
        default: "Asia/Kolkata",
      },
      dateFormat: {
        type: String,
        enum: ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"],
        default: "DD/MM/YYYY",
      },
      currency: {
        type: String,
        default: "INR",
      },
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: true },
      },
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for email lookup
userSchema.index({ email: 1 });

// Virtual for account lock status
userSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Method to increment login attempts
userSchema.methods.incLoginAttempts = function () {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 },
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function () {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
  });
};

// Method to check if subscription is active
userSchema.methods.isSubscriptionActive = function () {
  return (
    this.subscriptionStatus === "active" ||
    (this.subscriptionStatus === "trial" && this.subscriptionEndDate > Date.now())
  );
};

// Method to check if user can add more employees
userSchema.methods.canAddEmployee = function (currentEmployeeCount) {
  return currentEmployeeCount < this.employeeLimit;
};

// Method to update subscription
userSchema.methods.updateSubscription = function (plan, status, endDate) {
  const updates = {
    subscriptionPlan: plan,
    subscriptionStatus: status,
    subscriptionEndDate: endDate,
  };

  // Update features and limits based on plan
  if (plan === "monthly") {
    updates.employeeLimit = 100;
    updates.features = {
      attendance: true,
      leaveManagement: true,
      payroll: true,
      reports: true,
      api: false,
      customBranding: false,
    };
  } else if (plan === "yearly") {
    updates.employeeLimit = 500;
    updates.features = {
      attendance: true,
      leaveManagement: true,
      payroll: true,
      reports: true,
      api: true,
      customBranding: true,
    };
  }

  return this.updateOne(updates);
};

// Static method to find by email
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Pre-save middleware to handle various updates
userSchema.pre("save", function (next) {
  // Mark trial as used when user signs up
  if (this.isNew && !this.trialUsed) {
    this.trialUsed = true;
  }

  next();
});

// Transform output to remove sensitive data
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.loginAttempts;
  delete user.lockUntil;
  delete user.emailVerificationToken;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  return user;
};

export default mongoose.model("User", userSchema);