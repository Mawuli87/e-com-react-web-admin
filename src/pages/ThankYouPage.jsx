import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function ThankYouPage() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const orderId = query.get("order_id");

  // Generate a consistent 6-digit code using the orderId
  const generateOrderCode = (id) => {
    const padded = String(id).padStart(6, "99999");
    return `#${padded}`;
  };

  return (
    <div className="container mt-5 text-center">
      <h2 className="mb-3">🎉 Thank You for Your Order!</h2>
      {orderId && (
        <p>
          Your Order ID is <strong>{generateOrderCode(orderId)}</strong>
        </p>
      )}
      <p>We'll notify you once your order is confirmed and on its way. 🚚</p>

      <div className="mt-4">
        <Link to="/" className="btn btn-outline-primary me-2">
          Continue Shopping
        </Link>
        <Link to="/dashboard/orders" className="btn btn-primary">
          View My Orders
        </Link>
      </div>
    </div>
  );
}
