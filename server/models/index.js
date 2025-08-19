// Central export file for all models
const Employee = require("./Employee");
const Department = require("./Department");
const Attendance = require("./Attendance");
const Leave = require("./Leave");
const Salary = require("./Salary");
const PayrollReport = require("./PayrollReport");

module.exports = {
  Employee,
  Department,
  Attendance,
  Leave,
  Salary,
  PayrollReport,
};
