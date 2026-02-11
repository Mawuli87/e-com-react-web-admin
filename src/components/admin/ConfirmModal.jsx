import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmModal = ({ show, onHide, onConfirm, title, body }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title || "Confirm Action"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body || "Are you sure you want to proceed?"}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Yes, Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
