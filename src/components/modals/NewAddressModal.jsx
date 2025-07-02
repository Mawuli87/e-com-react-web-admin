// components/NewAddressModal.js
import React from "react";
import { Modal } from "react-bootstrap";
import AddressForm from "./AddressForm";

export default function NewAddressModal({
  show,
  onHide,
  token,
  userId,
  onSuccess,
}) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Address</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddressForm
          token={token}
          userId={userId}
          onSuccess={() => {
            onSuccess(); // reload address
            onHide(); // close modal
          }}
        />
      </Modal.Body>
    </Modal>
  );
}
