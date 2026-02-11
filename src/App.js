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
import AdminOrders from "./components/admin/AdminOrders";
import { Provider } from "react-redux";
import store from "./store";
import DealDetail from "./components/alldeals/DealDetail";
import CreateProducts from "./pages/admin/CreateProducts";
import AdminProductsList from "./pages/admin/AdminProductsList";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Provider store={store}>
          <ToastContainer position="top-right" autoClose={2500} />
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route
                path="/category/:slug/:subslug"
                element={<CategoryPage />}
              />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/thank-you" element={<ThankYouPage />} />
              <Route path="/addresses" element={<AddressBook />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/DealDetail/:id" element={<DealDetail />} />
              <Route
                path="/admin/CreateProducts"
                element={<CreateProducts />}
              />
              <Route
                path="/admin/AdminProductsList"
                element={<AdminProductsList />}
              />
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
        </Provider>
      </CartProvider>
    </AuthProvider>
  );
}
