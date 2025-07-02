import React, { useState } from "react";
import { toast } from "react-toastify";
import { registerUser } from "../../hooks/api";
import { ProgressBar, InputGroup, Form, Button } from "react-bootstrap";
import {
  getPasswordStrength,
  getPasswordColor,
  getPasswordRules,
  allRulesPassed,
} from "../../utils/passwordUtils";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function RegisterForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "customer",
  });

  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordRules = getPasswordRules(formData.password);
  const passwordStrength = getPasswordStrength(formData.password);
  const passwordsMatch =
    formData.password === formData.confirm_password && formData.password !== "";

  const isValid =
    formData.name &&
    formData.email &&
    allRulesPassed(formData.password) &&
    passwordsMatch;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await registerUser(formData);
    setLoading(false);

    if (res.success) {
      toast.success("Registered successfully!. Please login to continue.");
      if (onSuccess) onSuccess();
    } else {
      toast.error(res.error || "Registration failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Name */}
      <div className="mb-3">
        <input
          className="form-control"
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
      </div>

      {/* Email */}
      <div className="mb-3">
        <input
          className="form-control"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
      </div>

      {/* Password with visibility toggle */}
      <div className="mb-2">
        <InputGroup>
          <Form.Control
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          <Button
            variant="outline-secondary"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </Button>
        </InputGroup>

        {formData.password && (
          <>
            <ProgressBar
              now={passwordStrength}
              variant={getPasswordColor(passwordStrength)}
              className="mt-1"
              label={
                passwordStrength === 100
                  ? "Strong"
                  : passwordStrength >= 70
                  ? "Medium"
                  : "Weak"
              }
            />
            <ul className="small mt-2 ps-3 text-muted">
              <li
                className={
                  passwordRules.length ? "text-success" : "text-danger"
                }
              >
                Minimum 6 characters
              </li>
              <li
                className={
                  passwordRules.uppercase ? "text-success" : "text-danger"
                }
              >
                At least one uppercase letter
              </li>
              <li
                className={
                  passwordRules.number ? "text-success" : "text-danger"
                }
              >
                At least one number
              </li>
              <li
                className={
                  passwordRules.special ? "text-success" : "text-danger"
                }
              >
                At least one special character
              </li>
            </ul>
          </>
        )}
      </div>

      {/* Confirm Password with toggle */}
      <div className="mb-3">
        <InputGroup>
          <Form.Control
            type={showConfirm ? "text" : "password"}
            name="confirm_password"
            placeholder="Confirm Password"
            value={formData.confirm_password}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            isInvalid={
              touched.confirm_password &&
              formData.confirm_password &&
              !passwordsMatch
            }
            isValid={passwordsMatch}
          />
          <Button
            variant="outline-secondary"
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </Button>
        </InputGroup>
        {touched.confirm_password &&
          formData.confirm_password &&
          !passwordsMatch && (
            <div className="text-danger small mt-1">Passwords do not match</div>
          )}
      </div>

      {/* Role */}
      <div className="mb-3">
        <select
          className="form-select"
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="customer">Customer</option>
          <option value="rider">Rider</option>
        </select>
      </div>

      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={!isValid || loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
