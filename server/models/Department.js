import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Department name is required"],
      unique: true,
      trim: true,
      enum: ["Engineering", "Product", "Design", "Human Resources", "Marketing", "Analytics"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    headOfDepartment: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      trim: true,
      default: "Main Office",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Department", departmentSchema);
