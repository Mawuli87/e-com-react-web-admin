import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { getToken } from "../../utils/auth";
import { toast } from "react-toastify";
import OrderDetailsModal from "./OrderDetailsModal";
import AssignRiderModal from "./AssignRiderModal";
import emptyBox from "../../assets/empty-box.png";
import { Button, Modal } from "react-bootstrap";

export default function AdminOrders() {
  const { user } = useContext(AuthContext);
  const token = getToken();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  //const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [riders, setRiders] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [currentAssignOrderId, setCurrentAssignOrderId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  // At the top of your component
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("pending"); // or "all"

  const [selectedStatus, setSelectedStatus] = useState("all");

  const isMobile = window.innerWidth < 768;

  const openAssignModal = (orderId) => {
    setCurrentAssignOrderId(orderId);
    setShowAssignModal(true);
  };

  const openModal = (id) => {
    setSelectedOrderId(id);
    setShowModal(true);
  };

  useEffect(() => {
    fetchOrders(statusFilter);
  }, [statusFilter]);

  const fetchOrders = async (status = "") => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (status) params.append("status", status);

      const url = `http://localhost/projects/ecom/admin/orders?${params.toString()}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.orders) {
        setOrders(data.orders);
        setError("");
      } else {
        // setError("No orders found.");
        toast.error(data.message || "No orders found.");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || err.response?.data?.message || err.message;
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const fetchRiders = async () => {
    try {
      const res = await fetch("http://localhost/projects/ecom/admin/riders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.riders) {
        setRiders(data.riders);
      }
    } catch (err) {
      console.error("Failed to fetch riders.");
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchRiders();
  }, [token]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost/projects/ecom/admin/order/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // if needed
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to update");

      toast.success(`✅ Status updated to ${newStatus}`);
      fetchOrders(); // refresh orders list
    } catch (err) {
      toast.error(`❌ ${err.message}`);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost/projects/ecom/admin/order/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update order status.");
      }

      toast.success(`✅ Order status updated to "${status}"!`);

      // 🔄 Refresh orders after update
      fetchOrders(currentStatus); // Pass the current status if you're filtering
    } catch (error) {
      console.error("Error updating order status:", error.message);
      toast.error(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const statuses = [
    "",
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "completed",
    "cancelled",
  ];
  const statusTransitions = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["processing", "cancelled"],
    processing: ["shipped", "cancelled"],
    shipped: ["completed"],
    completed: [],
    cancelled: [],
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return "bg-warning text-dark";
      case "confirmed":
        return "bg-primary";
      case "processing":
        return "bg-info text-dark";
      case "shipped":
        return "bg-secondary";
      case "completed":
        return "bg-success";
      case "cancelled":
        return "bg-danger";
      default:
        return "bg-light text-dark";
    }
  };

  return (
    <div className="container">
      <h2 className="mb-3">📦 All Orders</h2>

      <div className="btn-group my-3 flex-wrap">
        {statuses.map((status) => (
          <button
            key={status || "all"}
            onClick={() => {
              setStatusFilter(status);
              fetchOrders(status);
            }}
            className={`btn btn-sm ${
              statusFilter === status ? "btn-primary" : "btn-outline-primary"
            }`}
          >
            {status ? status.toLowerCase() : "all"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-3 text-muted">Loading orders...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center my-5">
          <img
            src={emptyBox}
            alt="No orders"
            width="150"
            style={{ opacity: 0.7 }}
          />
          <p className="mt-3 text-muted">No orders found for this status.</p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div
            className="table-responsive d-none d-md-block"
            style={{ maxHeight: "70vh", overflowY: "auto" }}
          >
            <table className="table table-hover align-middle">
              <thead className="table-dark sticky-top">
                <tr>
                  <th>#ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th className="d-none d-lg-table-cell">Placed At</th>
                  <th className="d-none d-lg-table-cell">Rider</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>
                      <strong>{order.user_id}</strong>
                      <br />
                      <small className="text-muted">{order.email}</small>
                    </td>
                    <td>
                      <span className="fw-bold text-success">
                        ₵{parseFloat(order.total_price).toFixed(2)}
                      </span>
                    </td>
                    <td className="text-capitalize">{order.payment_method}</td>
                    <td>
                      <span
                        className={`badge ${getStatusBadge(
                          order.order_status
                        )} text-capitalize`}
                      >
                        {order.order_status}
                      </span>
                    </td>
                    <td className="d-none d-lg-table-cell">
                      <small>
                        {new Date(order.placed_at).toLocaleString()}
                      </small>
                    </td>
                    <td className="d-none d-lg-table-cell">
                      {order.rider_id ? (
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={order.rider_profile_image_url}
                            alt="Rider"
                            width={40}
                            height={40}
                            className="rounded-circle object-fit-cover"
                          />
                          <div>
                            <small className="text-muted d-block">
                              Assigned
                            </small>
                            <span>{order.rider_name}</span>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => openAssignModal(order.id)}
                        >
                          Assign Rider
                        </button>
                      )}
                    </td>
                    <td>
                      <div className="d-flex flex-column gap-1">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openModal(order.id)}
                        >
                          View
                        </button>
                        {statusTransitions[order.order_status]?.length > 0 ? (
                          <select
                            className="form-select form-select-sm"
                            onChange={(e) => {
                              const selected = e.target.value;
                              if (selected) {
                                setSelectedOrderId(order.id);
                                setNewStatus(selected);
                                setShowConfirmModal(true);
                              }
                            }}
                          >
                            <option disabled selected>
                              {order.order_status.charAt(0).toUpperCase() +
                                order.order_status.slice(1)}{" "}
                              (Current)
                            </option>
                            {statusTransitions[order.order_status].map(
                              (nextStatus) => (
                                <option key={nextStatus} value={nextStatus}>
                                  Mark as{" "}
                                  {nextStatus.charAt(0).toUpperCase() +
                                    nextStatus.slice(1)}
                                </option>
                              )
                            )}
                          </select>
                        ) : (
                          <span className="text-muted small">
                            No further action
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="d-block d-md-none">
            {orders.map((order) => (
              <div className="card mb-3" key={order.id}>
                <div className="card-body">
                  <h5 className="card-title">Order #{order.id}</h5>
                  <p className="mb-1">
                    <strong>Customer:</strong> {order.user_id}
                    <br />
                    <small className="text-muted">{order.email}</small>
                  </p>
                  <p className="mb-1">
                    <strong>Total:</strong>{" "}
                    <span className="text-success">
                      ₵{parseFloat(order.total_price).toFixed(2)}
                    </span>
                  </p>
                  <p className="mb-1 text-capitalize">
                    <strong>Payment:</strong> {order.payment_method}
                  </p>
                  <p className="mb-1">
                    <strong>Status:</strong>{" "}
                    <span
                      className={`badge ${getStatusBadge(order.order_status)}`}
                    >
                      {order.order_status}
                    </span>
                  </p>
                  <div className="d-flex justify-content-between mt-3">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => openModal(order.id)}
                    >
                      View
                    </button>
                    {order.rider_id ? (
                      <span className="badge bg-success">Assigned</span>
                    ) : (
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => openAssignModal(order.id)}
                      >
                        Assign Rider
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modals */}
      <OrderDetailsModal
        show={showModal}
        onHide={() => setShowModal(false)}
        orderId={selectedOrderId}
      />
      <AssignRiderModal
        show={showAssignModal}
        onHide={() => setShowAssignModal(false)}
        orderId={currentAssignOrderId}
        token={token}
        riders={riders}
        onAssigned={() => fetchOrders(statusFilter)}
      />
      {showConfirmModal && (
        <Modal show centered onHide={() => setShowConfirmModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Status Update</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to mark this order as{" "}
            <strong>{newStatus}</strong>?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowConfirmModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                updateStatus(selectedOrderId, newStatus);
                setShowConfirmModal(false);
                fetchOrders();
              }}
            >
              Yes, Update
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
