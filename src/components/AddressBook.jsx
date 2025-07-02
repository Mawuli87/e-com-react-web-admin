import React, { useEffect, useState } from "react";
import { getToken } from "../utils/auth"; // Helper to retrieve JWT token
import { addUserAddress, fetchUserAddresses } from "../hooks/address";
// Adjust this path if needed

const AddressBook = ({ token, user_id }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    label: "",
    street_address: "",
    city: "",
    region: "",
    zip_code: "",
    is_default: false,
  });

  useEffect(() => {
    const loadAddresses = async () => {
      const token = getToken();
      const res = await fetchUserAddresses(token);

      if (res.error) {
        setError(res.error);
      } else {
        setAddresses(res.data || []);
      }

      setLoading(false);
    };

    loadAddresses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();

    const res = await addUserAddress(form, token);

    if (res.error) {
      setError(res.error);
      setSuccess("");
    } else {
      setSuccess("Address added successfully!");
      setError("");

      // Re-fetch the updated address list
      const refreshed = await fetchUserAddresses(token);
      setAddresses(refreshed.data || []);

      // Reset the form
      setForm({
        label: "",
        street_address: "",
        city: "",
        region: "",
        zip_code: "",
        is_default: false,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  if (loading) return <p>Loading addresses...</p>;

  return (
    <div className="container mt-4">
      <h4>Your Addresses</h4>
      {error && <div className="alert alert-warning">{error}</div>}

      {addresses.length === 0 ? (
        <p>No saved addresses yet.</p>
      ) : (
        <ul className="list-group">
          {addresses.map((address) => (
            <li
              key={address.id}
              className={`list-group-item ${
                address.is_default ? "list-group-item-success" : ""
              }`}
            >
              <strong>{address.label}</strong>
              <br />
              {address.street_address}, {address.city}, {address.region},{" "}
              {address.zip_code}
              <br />
              {address.is_default ? <small>(Default)</small> : null}
            </li>
          ))}
        </ul>
      )}

      <hr />
      <h5>Add New Address</h5>
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <input
            type="text"
            className="form-control"
            name="label"
            placeholder="Label (e.g. Home, Work)"
            value={form.label}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-2">
          <textarea
            className="form-control"
            name="street_address"
            placeholder="Street Address"
            value={form.street_address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="row mb-2">
          <div className="col">
            <input
              type="text"
              className="form-control"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              name="region"
              placeholder="Region"
              value={form.region}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="mb-2">
          <input
            type="text"
            className="form-control"
            name="zip_code"
            placeholder="ZIP Code"
            value={form.zip_code}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            name="is_default"
            checked={form.is_default}
            onChange={handleChange}
          />
          <label className="form-check-label">Set as default address</label>
        </div>
        <button className="btn btn-primary">Add Address</button>
      </form>
    </div>
  );
};

export default AddressBook;
