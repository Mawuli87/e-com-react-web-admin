// components/forms/ForgotPasswordForm.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import { sendResetPasswordEmail } from "../../hooks/api"; // you’ll define this

export default function ForgotPasswordForm({ onBackToLogin }) {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await sendResetPasswordEmail(email);
    if (res.success) {
      toast.success("Reset link sent to your email.");
    } else {
      toast.error(res.error || "Failed to send reset link.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h5 className="mb-3">🔐 Forgot Password</h5>
      <input
        className="form-control mb-3"
        type="email"
        placeholder="Enter your email"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="btn btn-primary w-100">Send Reset Link</button>
      <div className="text-center mt-2">
        <button type="button" className="btn btn-link" onClick={onBackToLogin}>
          Back to Login
        </button>
      </div>
    </form>
  );
}
