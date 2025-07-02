// pages/dashboards/UserDashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { CartContext } from "../../contexts/CartContext";
import { fetchUserAddresses } from "../../hooks/address";
import { getToken } from "../../utils/auth";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

export default function UserDashboard() {
  const { user } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const token = getToken();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAddresses = async () => {
      if (!user || !token) {
        setLoading(false);
        setError("Please login to view your dashboard.");
        return;
      }

      const res = await fetchUserAddresses(user.id, token);
      if (res.error) {
        setError(res.error);
      } else {
        setAddresses(
          Array.isArray(res.data.address)
            ? res.data.address
            : [res.data.address]
        );
      }

      setLoading(false);
    };

    loadAddresses();
  }, [user, token]);

  return (
    <DashboardLayout role={user?.role || "user"}>
      <div className="container">
        <h2>👋 Welcome, {user?.name || "User"}!</h2>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        <div className="row mt-4">
          <div className="col-md-4 mb-3">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">🛒 Cart Items</h5>
                <p className="card-text display-6">{cartItems.length}</p>
                <Link to="/cart" className="btn btn-outline-primary btn-sm">
                  View Cart
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">🏠 Addresses</h5>
                <p className="card-text display-6">{addresses.length}</p>
                <Link
                  to="/addresses"
                  className="btn btn-outline-primary btn-sm"
                >
                  Manage Addresses
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">📱 Contact</h5>
                <p className="card-text">{user?.phone || "N/A"}</p>
                <p className="card-text">{user?.email || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        {addresses.length > 0 && (
          <>
            <h4 className="mt-5">Saved Addresses</h4>
            <ul className="list-group">
              {addresses.map((addr) => (
                <li
                  key={addr.id}
                  className={`list-group-item ${
                    addr.is_default ? "list-group-item-success" : ""
                  }`}
                >
                  <strong>{addr.label}</strong> - {addr.street_address},{" "}
                  {addr.city}, {addr.region}
                  <br />
                  {addr.is_default && <small>(Default)</small>}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
