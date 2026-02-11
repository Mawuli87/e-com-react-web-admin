// components/admin/OrderDetailsModal.jsx
import React, { useEffect, useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { getToken } from "../../utils/auth";

export default function OrderDetailsModal({ show, onHide, orderId }) {
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = getToken();

  useEffect(() => {
    if (!orderId || !show) return;

    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost/projects/ecom/admin/orders/${orderId}/items`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setOrder(data.order || null);
        setItems(data.items || []);
        setAddress(data.delivery_address || null);
      } catch (err) {
        console.error("Failed to fetch order details");
      }
      setLoading(false);
    };

    fetchOrderDetails();
  }, [show, orderId, token]);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Order Details - #{orderId}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
          </div>
        ) : order ? (
          <>
            {/* Order Info */}
            <p>
              <strong>Customer:</strong> {order.customer_name} (
              {order.customer_email})
            </p>
            <p>
              <strong>Placed At:</strong>{" "}
              {new Date(order.placed_at).toLocaleString()}
            </p>
            <p>
              <strong>Total:</strong> ₵
              {parseFloat(order.total_price).toFixed(2)}
            </p>
            <p>
              <strong>Status:</strong> {order.order_status}
            </p>

            {/* Delivery Address */}
            {address && (
              <>
                <h5 className="mt-4">🚚 Delivery Address</h5>
                <p>
                  <strong>{address.label}</strong>
                  <br />
                  {address.street_address}, {address.city}, {address.region}
                </p>
              </>
            )}

            {/* Rider Info */}
            <h5 className="mt-4">🚴 Assigned Rider</h5>
            {order.rider_id ? (
              <div className="d-flex align-items-center">
                <img
                  src={
                    order.rider_image || "/uploads/profile_pictures/default.png"
                  }
                  alt="Rider"
                  width={60}
                  height={60}
                  className="me-3 rounded-circle"
                  style={{ objectFit: "cover" }}
                />
                <div>
                  <p className="mb-1">
                    <strong>{order.rider_name}</strong>
                  </p>
                  <p className="mb-1">{order.rider_email}</p>
                  <p className="mb-1">{order.rider_phone || "No phone"}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted">No rider assigned yet.</p>
            )}

            {/* Items */}
            <h5 className="mt-4">🛍️ Items</h5>
            {items.map((item) => (
              <div
                key={item.product_id}
                className="border rounded p-2 mb-3 d-flex"
              >
                <div className="me-3">
                  {item.image_urls && item.image_urls.length > 0 ? (
                    <img
                      src={item.image_urls[0]}
                      alt="Product"
                      width={80}
                      height={80}
                      style={{ objectFit: "cover", borderRadius: 6 }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        background: "#eee",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      No Image
                    </div>
                  )}
                </div>
                <div>
                  <h6>{item.title}</h6>
                  <p>
                    Quantity: {item.quantity} <br />
                    Price: ₵{parseFloat(item.price_at_time).toFixed(2)}
                  </p>

                  {item.image_urls && item.image_urls.length > 1 && (
                    <div className="d-flex flex-wrap mt-2">
                      {item.image_urls.slice(1).map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt="More"
                          width={60}
                          height={60}
                          className="me-2 mb-2"
                          style={{ objectFit: "cover", borderRadius: 4 }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        ) : (
          <p className="text-danger">Order not found.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
