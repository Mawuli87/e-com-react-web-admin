// components/dashboard/TopNavbar.jsx
import React, { useContext } from "react";
import { Dropdown } from "react-bootstrap";
import { FaCog, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

export default function TopNavbar({ toggleSidebar }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-end align-items-center p-3 border-bottom bg-light">
      <button
        className="btn btn-outline-secondary d-md-none"
        onClick={toggleSidebar}
      >
        ☰
      </button>
      <Dropdown align="end">
        <Dropdown.Toggle variant="light" className="d-flex align-items-center">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="User"
              className="rounded-circle me-2"
              width={32}
              height={32}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <FaUserCircle size={28} className="me-2" />
          )}
          <span>{user?.name}</span>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => navigate("/profile")}>
            <FaUserCircle className="me-2" /> Profile
          </Dropdown.Item>
          <Dropdown.Item onClick={() => navigate("/settings")}>
            <FaCog className="me-2" /> Settings
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={logout}>
            <FaSignOutAlt className="me-2" /> Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
