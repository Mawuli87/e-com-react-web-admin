// pages/AdminDashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if not admin
  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/dashboard"); // fallback for non-admin
    }
  }, [user, navigate]);

  return (
    <DashboardLayout role="admin">
      <div className="container-fluid">
        <h3 className="mb-4">🛠️ Admin Dashboard</h3>

        <div className="row">
          <div className="col-md-4 mb-3">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h5>📦 Total Products</h5>
                <p className="display-6">120</p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h5>👥 Users</h5>
                <p className="display-6">57</p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h5>🛒 Orders</h5>
                <p className="display-6">342</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add more admin-specific sections here */}
      </div>
    </DashboardLayout>
  );
}
