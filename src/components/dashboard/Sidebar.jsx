// components/dashboard/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUser,
  FaBox,
  FaUsers,
  FaTruck,
} from "react-icons/fa";

export default function Sidebar({ role }) {
  const menu = {
    user: [
      { label: "Dashboard", icon: <FaTachometerAlt />, to: "/dashboard/user" },
      { label: "Orders", icon: <FaBox />, to: "/dashboard/orders" },
    ],
    admin: [
      { label: "Dashboard", icon: <FaTachometerAlt />, to: "/dashboard/admin" },
      { label: "Manage Users", icon: <FaUsers />, to: "/dashboard/users" },
      { label: "Products", icon: <FaBox />, to: "/dashboard/products" },
    ],
    rider: [
      { label: "Dashboard", icon: <FaTachometerAlt />, to: "/dashboard/rider" },
      { label: "Deliveries", icon: <FaTruck />, to: "/dashboard/deliveries" },
    ],
  };

  return (
    <div className="bg-dark text-white p-3 sidebar" style={{ width: "240px" }}>
      <h5 className="text-center mb-4">Dashboard</h5>
      <ul className="nav flex-column">
        {menu[role]?.map((item) => (
          <li className="nav-item" key={item.label}>
            <Link
              to={item.to}
              className="nav-link text-white d-flex align-items-center"
            >
              <span className="me-2">{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
