// components/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/" />; // redirect to home or login

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // redirect to the correct dashboard
    const redirectPath =
      user.role === "admin"
        ? "/admin"
        : user.role === "rider"
        ? "/rider"
        : "/user";

    return <Navigate to={redirectPath} />;
  }

  return children;
}
