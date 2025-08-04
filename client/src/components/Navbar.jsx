import { Search, Bell, Menu, Building2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();

  // Get page title based on current route
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/employee-directory":
        return "Employee Directory";
      case "/attendance":
        return "Attendance";
      case "/leave-management":
        return "Leave Management";
      case "/salary-report":
        return "Salary Report";
      default:
        return "Dashboard";
    }
  };

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
          <h1 className="title-text">Portal</h1>
        </div>

        <div className="breadcrumb">
          <span className="breadcrumb-current">{getPageTitle()}</span>
        </div>
      </div>

      <div className="navbar-center">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search employees, reports, or actions..."
            className="search-input"
          />
        </div>
      </div>

  
    </nav>
  );
};

export default Navbar;
