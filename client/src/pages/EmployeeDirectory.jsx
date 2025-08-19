import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  UserPlus,
  MoreHorizontal,
  Users,
  Briefcase,
  Award,
  TrendingUp,
  Download,
  ChevronDown,
} from "lucide-react";
import AddEmployeeModal from "../components/AddEmployeeModal";
import EditEmployeeModal from "../components/EditEmployeeModal";
import { useToast } from "../components/Toast";
import "./EmployeeDirectory.css";

const API_BASE_URL = "http://localhost:5000/api";

const EmployeeDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const { showSuccess, showError, ToastContainer } = useToast();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const statuses = ["all", "Active", "Inactive", "On Leave"];

  // Fetch employees from API
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/employees`);
      if (!response.ok) throw new Error("Failed to fetch employees");
      const data = await response.json();

      // Transform data to match frontend format
      const transformedEmployees = data.map((emp) => ({
        id: emp._id,
        name: `${emp.firstName} ${emp.lastName}`,
        email: emp.email,
        phone: emp.phone,
        position: emp.position,
        department: emp.department?.name || emp.department,
        location: emp.address || "N/A",
        joinDate: new Date(emp.dateOfJoining).toISOString().split("T")[0],
        status: emp.status,
        avatar: "/api/placeholder/40/40",
        salary: emp.basicSalary,
        attendance: Math.random() * 100, // TODO: Calculate from actual attendance data
      }));

      setEmployees(transformedEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      showError("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  // Fetch departments from API
  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/departments`);
      if (!response.ok) throw new Error("Failed to fetch departments");
      const data = await response.json();

      const departmentNames = ["all", ...data.map((dept) => dept.name)];
      setDepartments(departmentNames);
    } catch (error) {
      console.error("Error fetching departments:", error);
      setDepartments(["all", "Engineering", "HR", "Marketing", "Finance"]);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  // Calculate dynamic stats
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(
    (emp) => emp.status === "Active"
  ).length;
  const uniqueDepartments = [...new Set(employees.map((emp) => emp.department))]
    .length;
  const avgAttendance =
    employees.length > 0
      ? (
          employees.reduce((sum, emp) => sum + emp.attendance, 0) /
          employees.length
        ).toFixed(1)
      : 0;

  const stats = [
    {
      title: "Total Employees",
      value: totalEmployees.toString(),
      icon: Users,
      type: "total",
      change: "+12%",
      changeType: "positive",
    },
    {
      title: "Active Employees",
      value: activeEmployees.toString(),
      icon: UserPlus,
      type: "new",
      change: `${((activeEmployees / totalEmployees) * 100).toFixed(0)}%`,
      changeType: "positive",
    },
    {
      title: "Departments",
      value: uniqueDepartments.toString(),
      icon: Briefcase,
      type: "departments",
      change: "0",
      changeType: "neutral",
    },
    {
      title: "Avg. Attendance",
      value: `${avgAttendance}%`,
      icon: Award,
      type: "attendance",
      change: "+1.5%",
      changeType: "positive",
    },
  ];

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "all" ||
      employee.department === selectedDepartment;
    const matchesStatus =
      selectedStatus === "all" || employee.status === selectedStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Handle add employee
  const handleAddEmployee = async (employeeData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: employeeData.name.split(" ")[0],
          lastName: employeeData.name.split(" ").slice(1).join(" ") || "",
          email: employeeData.email,
          phone: employeeData.phone,
          position: employeeData.position,
          department: employeeData.department,
          address: employeeData.location,
          dateOfJoining: employeeData.joinDate,
          basicSalary: employeeData.salary,
          status: employeeData.status,
        }),
      });

      if (!response.ok) throw new Error("Failed to add employee");

      const newEmployee = await response.json();
      await fetchEmployees(); // Refresh the list
      showSuccess(`Employee ${employeeData.name} has been added successfully!`);
    } catch (error) {
      console.error("Error adding employee:", error);
      showError("Failed to add employee. Please try again.");
      throw error;
    }
  };

  // Handle delete employee
  const handleDeleteEmployee = async (employeeId) => {
    try {
      const employee = employees.find((emp) => emp.id === employeeId);

      const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete employee");

      await fetchEmployees(); // Refresh the list
      showSuccess(`Employee ${employee?.name} has been deleted successfully.`);
    } catch (error) {
      console.error("Error deleting employee:", error);
      showError("Failed to delete employee. Please try again.");
    }
  };

  // Handle edit employee
  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  // Handle update employee
  const handleUpdateEmployee = async (updatedEmployee) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/employees/${updatedEmployee.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: updatedEmployee.name.split(" ")[0],
            lastName: updatedEmployee.name.split(" ").slice(1).join(" ") || "",
            email: updatedEmployee.email,
            phone: updatedEmployee.phone,
            position: updatedEmployee.position,
            department: updatedEmployee.department,
            address: updatedEmployee.location,
            dateOfJoining: updatedEmployee.joinDate,
            basicSalary: updatedEmployee.salary,
            status: updatedEmployee.status,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update employee");

      await fetchEmployees(); // Refresh the list
      showSuccess(
        `Employee ${updatedEmployee.name} has been updated successfully!`
      );
    } catch (error) {
      console.error("Error updating employee:", error);
      showError("Failed to update employee. Please try again.");
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="employee-directory">
        <div className="employee-directory-container">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <div>Loading employees...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-directory">
      <div className="employee-directory-container">
        {/* Header */}
        <div className="employee-header">
          <div className="header-content">
            <div className="header-info">
              <h1 className="employee-title">Employee Directory</h1>
              <p className="employee-subtitle">
                Manage your team members and their information
              </p>
              <div className="employee-date">
                <Calendar className="w-4 h-4" />
                {currentDate}
              </div>
            </div>
            <div className="header-actions">
              <button className="btn-secondary-small">
                <Download className="w-3 h-3" />
                Export
              </button>
              <button
                className="btn-primary-small"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus className="w-3 h-3" />
                Add Employee
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className={`stat-card ${stat.type}`}>
              <div className="stat-header">
                <div className="stat-info">
                  <div className="stat-title-with-icon">
                    <stat.icon className="w-4 h-4" />
                    <h3>{stat.title}</h3>
                  </div>
                  <p className="stat-value">{stat.value}</p>
                  <div className={`stat-change ${stat.changeType}`}>
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </div>
                </div>
                <div className="stat-icon">
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="filters-section">
          <div className="search-filters-compact">
            <div className="search-container-small">
              <Search className="search-icon-small" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input-small"
              />
            </div>

            <div className="filter-group-compact">
              <div className="filter-item-small">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="filter-select-small"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept === "all" ? "All Depts" : dept}
                    </option>
                  ))}
                </select>
                <ChevronDown className="select-icon-small" />
              </div>

              <div className="filter-item-small">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="filter-select-small"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status === "all" ? "All Status" : status}
                    </option>
                  ))}
                </select>
                <ChevronDown className="select-icon-small" />
              </div>

              <button className="filter-btn-small">
                <Filter className="filter-icon-small" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Employee Table */}
        <div className="employee-table-section">
          <div className="section-header">
            <h3 className="section-title">
              <Users className="w-5 h-5" />
              Employee List ({filteredEmployees.length} employees)
            </h3>
          </div>

          <div className="table-container-compact">
            <table className="employee-table-compact">
              <thead className="table-header-compact">
                <tr>
                  <th className="table-header-cell-compact">Employee</th>
                  <th className="table-header-cell-compact">Position</th>
                  <th className="table-header-cell-compact">Department</th>
                  <th className="table-header-cell-compact">Status</th>
                  <th className="table-header-cell-compact">Attendance</th>
                  <th className="table-header-cell-compact">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="table-row-compact">
                    <td className="table-cell-compact">
                      <div className="employee-info-compact">
                        <div className="employee-details-compact">
                          <h4 className="employee-name-compact">
                            {employee.name}
                          </h4>
                          <p className="employee-id-compact">
                            EMP{employee.id.toString().padStart(3, "0")}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="table-cell-compact">
                      <div className="position-info-compact">
                        <span className="position-title-compact">
                          {employee.position}
                        </span>
                        <span className="salary-info-compact">
                          ${employee.salary.toLocaleString()}
                        </span>
                      </div>
                    </td>

                    <td className="table-cell-compact">
                      <span
                        className={`department-badge-compact ${employee.department
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {employee.department}
                      </span>
                    </td>

                    <td className="table-cell-compact">
                      <div
                        className={`status-badge-compact ${employee.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        <div className="status-indicator-small"></div>
                        {employee.status}
                      </div>
                    </td>

                    <td className="table-cell-compact">
                      <div className="attendance-info-compact">
                        <div className="attendance-percentage-compact">
                          {employee.attendance}%
                        </div>
                        <div
                          className={`attendance-bar-compact ${
                            employee.attendance >= 95
                              ? "excellent"
                              : employee.attendance >= 90
                              ? "good"
                              : "needs-improvement"
                          }`}
                        >
                          <div
                            className="attendance-fill-compact"
                            style={{ width: `${employee.attendance}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    <td className="table-cell-compact">
                      <div className="action-buttons-compact">
                        <button
                          className="action-btn-compact edit"
                          title="Edit"
                          onClick={() => handleEditEmployee(employee)}
                        >
                          <Edit className="action-icon-small" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredEmployees.length === 0 && (
            <div className="empty-state-compact">
              <Users className="empty-icon" />
              <h3 className="empty-title">No employees found</h3>
              <p className="empty-text">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>

        {/* Add Employee Modal */}
        <AddEmployeeModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddEmployee}
        />

        {/* Edit Employee Modal */}
        <EditEmployeeModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedEmployee(null);
          }}
          onUpdate={handleUpdateEmployee}
          onDelete={handleDeleteEmployee}
          employee={selectedEmployee}
        />

        {/* Toast Notifications */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default EmployeeDirectory;
