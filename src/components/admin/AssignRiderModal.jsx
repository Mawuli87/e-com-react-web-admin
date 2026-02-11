// components/admin/AssignRiderModal.jsx
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { getToken } from "../../utils/auth";

export default function AssignRiderModal({
  show,
  onHide,
  orderId,
  token,
  riders,
  onAssigned,
}) {
  const [selectedRider, setSelectedRider] = useState("");
  const [submitting, setSubmitting] = useState(false);

  console.log("Order ID " + orderId + token);

  const handleAssign = async () => {
    if (!selectedRider) {
      toast.error("Please select a rider");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(
        `http://localhost/projects/ecom/admin/orders/${orderId}/assign-rider`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rider_id: selectedRider }),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Rider assigned successfully");
        onAssigned(); // callback to refresh orders
        onHide(); // close modal
      } else {
        toast.error(res.data?.message || "Failed to assign rider");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || err.response?.data?.message || err.message;
      toast.error("Error : " + errorMsg);
    }
    setSubmitting(false);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Assign Rider to Order #{orderId}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Select
          className="mb-3"
          value={selectedRider}
          onChange={(e) => setSelectedRider(e.target.value)}
        >
          <option value="">Select a Rider</option>
          {riders.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} ({r.email})
            </option>
          ))}
        </Form.Select>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={submitting}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleAssign} disabled={submitting}>
          {submitting ? "Assigning..." : "Assign"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
