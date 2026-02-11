import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../contexts/AuthContext";
import { loginUser } from "../../hooks/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "../../utils/auth";

export default function LoginForm({ onSuccess, onForgotPassword }) {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validate form fields
  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) {
      errs.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      errs.email = "Invalid email format";
    }

    if (!formData.password.trim()) {
      errs.password = "Password is required";
    } else if (formData.password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const res = await loginUser({
      email: formData.email,
      password: formData.password,
    });
    setLoading(false);

    if (res.token) {
      login(res.token);
      if (formData.remember) {
        localStorage.setItem("token", res.token);
      }

      toast.success("Logged in successfully!");
      //redirect based on role
      // const decoded = decodeToken(res.token);
      // switch (decoded.role) {
      //   case "admin":
      //     navigate("/admin");
      //     break;
      //   case "rider":
      //     navigate("/rider");
      //     break;
      //   default:
      //     navigate("/user"); // user
      // }

      if (onSuccess) onSuccess(); // close modal if using modal
      navigate("/");
    } else {
      toast.error(res.error || "Login failed.");
    }
  };

  return (
    <form onSubmit={handleLogin} noValidate>
      {/* Email Field */}
      <div className="mb-3">
        <input
          className={`form-control ${errors.email ? "is-invalid" : ""}`}
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>

      {/* Password Field with Visibility Toggle */}
      <div className="mb-3 position-relative">
        <div className="input-group">
          <input
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.password && (
          <div className="invalid-feedback d-block">{errors.password}</div>
        )}
      </div>

      {/* Forgot Password */}
      <div className="text-end mb-3">
        <button
          type="button"
          className="btn btn-link p-0"
          onClick={onForgotPassword}
        >
          Forgot Password?
        </button>
      </div>

      {/* Remember Me */}
      <div className="form-check mb-3">
        <input
          type="checkbox"
          name="remember"
          checked={formData.remember}
          onChange={handleChange}
          className="form-check-input"
          id="rememberMe"
        />
        <label className="form-check-label" htmlFor="rememberMe">
          Remember Me
        </label>
      </div>

      {/* Submit Button */}
      <button className="btn btn-primary w-100" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
