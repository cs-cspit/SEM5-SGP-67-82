import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Clock,
  FileText,
  Users,
  IndianRupee,
  LogOut,
  Building2,
} from "lucide-react";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  const sidebarItems = [
    { icon: LayoutDashboard, name: "Dashboard", href: "/" },
    { icon: Users, name: "Employee Directory", href: "/employee-directory" },
    { icon: Clock, name: "Attendance", href: "/attendance" },
    { icon: FileText, name: "Leave Management", href: "/leave-management" },
    { icon: IndianRupee, name: "Salary Report", href: "/salary-report" },
  ];

  const isActive = (href) => location.pathname === href;

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
        <button className="logout-btn">
          <LogOut className="logout-icon" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
