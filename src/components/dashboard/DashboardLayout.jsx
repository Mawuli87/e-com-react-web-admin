// components/dashboard/DashboardLayout.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaUser,
  FaShoppingCart,
} from "react-icons/fa";
import TopNavbar from "./TopNavbar";

// DashboardLayout.jsx
export default function DashboardLayout({ children, role = "user" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className={`bg-dark text-white p-3 sidebar d-md-block ${
          sidebarOpen ? "d-block" : "d-none"
        }`}
        style={{
          width: "auto",
          minHeight: "100vh",
          position: "fixed",
          zIndex: 1000,
        }}
      >
        <h4 className="mb-4">Dashboard</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/" className="nav-link text-white">
              <FaHome className="me-2" /> Home
            </Link>
          </li>

          {role === "admin" && (
            <li className="nav-item mb-2">
              <Link to="/admin-dashboard" className="nav-link text-white">
                <FaUser className="me-2" /> Admin Dashboard
              </Link>
            </li>
          )}

          {role === "user" && (
            <>
              <li className="nav-item mb-2">
                <Link to="/dashboard" className="nav-link text-white">
                  <FaUser className="me-2" /> My Dashboard
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/cart" className="nav-link text-white">
                  <FaShoppingCart className="me-2" /> Cart
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Main Content */}
      <div
        className="flex-grow-1"
        style={{
          marginLeft: sidebarOpen || window.innerWidth >= 768,
          transition: "margin-left 0.3s ease",
          width: "100%",
        }}
      >
        <TopNavbar toggleSidebar={toggleSidebar} />
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
