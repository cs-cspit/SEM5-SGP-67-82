import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Clock, FileText, Users, LogOut } from "lucide-react";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const sidebarItems = [
    { icon: LayoutDashboard, name: "Dashboard", href: "/dashboard" },
    {
      icon: Users,
      name: "Employee Directory",
      href: "/dashboard/employee-directory",
    },
    { icon: Clock, name: "Attendance", href: "/dashboard/attendance" },
    {
      icon: FileText,
      name: "Leave Management",
      href: "/dashboard/leave-management",
    },
  ];

  const isActive = (href) => location.pathname === href;

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Navigate to landing page
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header"></div>

      <nav className="sidebar-nav">
        {sidebarItems.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            className={`nav-item ${isActive(item.href) ? "active" : ""}`}
          >
            <item.icon className="nav-icon" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <LogOut className="logout-icon" />
          <span className="logout-text">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
