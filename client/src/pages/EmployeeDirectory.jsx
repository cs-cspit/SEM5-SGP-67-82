import React, { useState } from "react";
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
  Eye,
  Download,
  ChevronDown,
} from "lucide-react";
import "./EmployeeDirectory.css";

const EmployeeDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Sample employee data
  const employees = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@company.com",
      phone: "+1 (555) 123-4567",
      position: "Senior Developer",
      department: "Engineering",
      location: "New York, NY",
      joinDate: "2022-01-15",
      status: "Active",
      avatar: "/api/placeholder/40/40",
      salary: 85000,
      attendance: 95.2,
    },
    {
      id: 2,
      name: "Sarah Wilson",
      email: "sarah.wilson@company.com",
      phone: "+1 (555) 987-6543",
      position: "Product Manager",
      department: "Product",
      location: "San Francisco, CA",
      joinDate: "2021-08-22",
      status: "Active",
      avatar: "/api/placeholder/40/40",
      salary: 92000,
      attendance: 98.1,
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@company.com",
      phone: "+1 (555) 456-7890",
      position: "UX Designer",
      department: "Design",
      location: "Austin, TX",
      joinDate: "2023-03-10",
      status: "Active",
      avatar: "/api/placeholder/40/40",
      salary: 78000,
      attendance: 92.7,
    },
    {
      id: 4,
      name: "Emma Davis",
      email: "emma.davis@company.com",
      phone: "+1 (555) 321-9876",
      position: "HR Manager",
      department: "Human Resources",
      location: "Chicago, IL",
      joinDate: "2020-11-05",
      status: "Active",
      avatar: "/api/placeholder/40/40",
      salary: 88000,
      attendance: 96.8,
    },
    {
      id: 5,
      name: "Alex Rodriguez",
      email: "alex.rodriguez@company.com",
      phone: "+1 (555) 654-3210",
      position: "Marketing Specialist",
      department: "Marketing",
      location: "Miami, FL",
      joinDate: "2022-09-12",
      status: "Active",
      avatar: "/api/placeholder/40/40",
      salary: 72000,
      attendance: 89.5,
    },
    {
      id: 6,
      name: "Lisa Chen",
      email: "lisa.chen@company.com",
      phone: "+1 (555) 789-0123",
      position: "Data Analyst",
      department: "Analytics",
      location: "Seattle, WA",
      joinDate: "2023-01-08",
      status: "On Leave",
      avatar: "/api/placeholder/40/40",
      salary: 76000,
      attendance: 94.3,
    },
  ];

  const departments = [
    "all",
    "Engineering",
    "Product",
    "Design",
    "Human Resources",
    "Marketing",
    "Analytics",
  ];
  const statuses = ["all", "Active", "Inactive", "On Leave"];

  const stats = [
    {
      title: "Total Employees",
      value: "156",
      icon: Users,
      type: "total",
      change: "+12%",
      changeType: "positive",
    },
    {
      title: "New Hires (This Month)",
      value: "8",
      icon: UserPlus,
      type: "new",
      change: "+2",
      changeType: "positive",
    },
    {
      title: "Departments",
      value: "6",
      icon: Briefcase,
      type: "departments",
      change: "0",
      changeType: "neutral",
    },
    {
      title: "Avg. Attendance",
      value: "94.2%",
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
              <button className="btn-primary-small">
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
                          className="action-btn-compact view"
                          title="View"
                        >
                          <Eye className="action-icon-small" />
                        </button>
                        <button
                          className="action-btn-compact edit"
                          title="Edit"
                        >
                          <Edit className="action-icon-small" />
                        </button>
                        <button
                          className="action-btn-compact delete"
                          title="Delete"
                        >
                          <Trash2 className="action-icon-small" />
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
      </div>
    </div>
  );
};

export default EmployeeDirectory;
