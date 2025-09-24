import { Menu, Building2, User } from "lucide-react";
import { useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();

  // Get page title based on current route
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/dashboard/employee-directory":
        return "Employee Directory";
      case "/dashboard/attendance":
        return "Attendance";
      case "/dashboard/leave-management":
        return "Leave Management";
      case "/dashboard/salary-report":
        return "Salary Report";
      default:
        return "Dashboard";
    }
  };

  // Get user info from localStorage
  const getUserInfo = () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        return JSON.parse(userData);
      }
      return {};
    } catch (error) {
      console.error("Error parsing user data:", error);
      return {};
    }
  };

  const user = getUserInfo();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="mobile-menu-btn">
          <Menu className="mobile-menu-icon" />
        </button>

        <div className="navbar-title">
          <div className="title-icon">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <h1 className="title-text">EmployeeHub</h1>
        </div>

        <div className="breadcrumb">
          <span className="breadcrumb-current">{getPageTitle()}</span>
        </div>
      </div>

      <div className="navbar-right">
        <div className="user-info">
          <div className="user-avatar">
            <User className="avatar-icon" />
          </div>
          <div className="user-details">
            <span className="user-name">
              {user.fullName || user.name || "Guest User"}
            </span>
            <span className="user-company">
              {user.companyName || user.company || "No Company"}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
