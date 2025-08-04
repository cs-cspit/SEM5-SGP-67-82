import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./DashboardLayout.css";

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      {/* Fixed Navbar at top */}
      <div className="layout-navbar">
        <Navbar />
      </div>

      {/* Fixed Sidebar on left */}
      <div className="layout-sidebar">
        <Sidebar />
      </div>

      {/* Main content area on right */}
      <div className="layout-main">
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
