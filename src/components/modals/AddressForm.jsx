// components/AddressForm.js
import React, { useContext, useState } from "react";
import { addUserAddress } from "../../hooks/address";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const AddressForm = ({ onSuccess }) => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token"); // manually get token if needed

  console.log("USER DATA NEW.  " + user.id + "======" + user.email);
  const [form, setForm] = useState({
    label: "",
    street_address: "",
    city: "",
    region: "",
    zip_code: "",
    is_default: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await addUserAddress(form, token, user.id);
    console.log("Add address response:", res);

    setLoading(false);

    if (!res || typeof res !== "object") {
      setError("Unexpected error occurred.");
      return;
    }

    if (res.error) {
      setError(res.error);
    } else {
      setError("");
      toast.success("Address added successfully!");
      onSuccess(); // callback to reload or close
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-2">
        <input
          className="form-control"
          name="label"
          placeholder="Label (e.g., Home)"
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
          className="form-control"
          name="zip_code"
          placeholder="ZIP Code"
          value={form.zip_code}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          name="is_default"
          checked={form.is_default}
          onChange={handleChange}
        />
        <label className="form-check-label">Set as default</label>
      </div>

      <button className="btn btn-success w-100" disabled={loading}>
        {loading ? "Saving..." : "Save Address"}
      </button>
    </form>
  );
};

export default AddressForm;
