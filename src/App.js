import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import ProductDetail from "./components/ProductDetail";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ThankYouPage from "./pages/ThankYouPage";
import AddressBook from "./components/AddressBook";

// Dashboards
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import RiderDashboard from "./pages/rider/RiderDashboard";

// Contexts
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

// Components
import CartIcon from "./components/CartIcon";
import ProtectedRoute from "./components/routes/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastContainer position="top-right" autoClose={2500} />
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/category/:slug/:subslug" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="/addresses" element={<AddressBook />} />

            {/* Protected role-based dashboards */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/user"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/rider"
              element={
                <ProtectedRoute allowedRoles={["rider"]}>
                  <RiderDashboard />
                </ProtectedRoute>
              }
            />

            {/* Optional: Auto-redirect root to dashboard */}
            <Route
              path="/redirect"
              element={
                <ProtectedRoute allowedRoles={["admin", "customer", "rider"]}>
                  <Navigate to="/dashboard" />
                </ProtectedRoute>
              }
            />
          </Routes>

          <CartIcon />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
