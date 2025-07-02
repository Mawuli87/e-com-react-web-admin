import React, { useEffect, useState, useContext } from "react";
import {
  Navbar,
  Form,
  Button,
  InputGroup,
  Offcanvas,
  Dropdown,
} from "react-bootstrap";
import {
  FaShoppingCart,
  FaUser,
  FaBars,
  FaSearch,
  FaSignInAlt,
  FaAlignJustify,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import { AuthContext } from "../contexts/AuthContext";
import AuthModal from "./modals/AuthModal";
import "./NavbarTop.css";

export default function NavbarTop({ onToggleMenu }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);

  const [showMiniMenu, setShowMiniMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [animate, setAnimate] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const cartCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  useEffect(() => {
    if (cartItems.length > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 400);
      return () => clearTimeout(timer);
    }
  }, [cartItems]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    setShowMiniMenu(false);
  };

  const handleNavigate = (path) => {
    setShowMiniMenu(false);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <Navbar
        bg="dark"
        variant="dark"
        sticky="top"
        className="py-2 px-3 d-flex justify-content-between sticky-shadow"
      >
        <div className="d-flex align-items-center">
          <Button
            variant="outline-light"
            className="me-2 d-md-none"
            onClick={onToggleMenu}
          >
            <FaBars />
          </Button>
          <Navbar.Brand href="/">E-com</Navbar.Brand>
        </div>

        {/* Search Bar (Desktop) */}
        <Form onSubmit={handleSearch} className="w-50 d-none d-md-block">
          <InputGroup>
            <Form.Control
              type="search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit" variant="warning">
              <FaSearch />
            </Button>
          </InputGroup>
        </Form>

        {/* Desktop Nav Right */}
        <div className="d-none d-md-flex align-items-center gap-3 text-white">
          {user ? (
            <>
              <span>Hello, {user.name || user.email}</span>
              <Button size="sm" variant="outline-light" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="outline-light"
              onClick={() => setShowAuth("login")}
            >
              <FaSignInAlt /> Login
            </Button>
          )}

          <div
            className="position-relative d-flex align-items-center nav-hover"
            onClick={() => navigate("/cart")}
            style={{ cursor: "pointer" }}
          >
            <FaShoppingCart />
            <span className="ms-1">Cart</span>
            {cartCount > 0 && (
              <span
                className={`position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger ${
                  animate ? "cart-badge-animate" : ""
                }`}
                style={{ fontSize: "0.7rem" }}
              >
                {cartCount}
              </span>
            )}
          </div>

          {user && (
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                className="text-white nav-hover border-0"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="User"
                    className="rounded-circle"
                    width={30}
                    height={30}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <FaUser />
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => navigate("/profile")}>
                  My Profile
                </Dropdown.Item>
                <Dropdown.Item onClick={() => navigate("/orders")}>
                  Orders
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>

        {/* Toggle Button for Mini Menu */}
        <Button
          className="d-md-none"
          variant="outline-light"
          onClick={() => setShowMiniMenu(true)}
        >
          <FaAlignJustify />
        </Button>
      </Navbar>

      {/* Mobile Offcanvas Menu */}
      <Offcanvas
        show={showMiniMenu}
        onHide={() => setShowMiniMenu(false)}
        placement="end"
        className="offcanvas-custom-width"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form onSubmit={handleSearch} className="mb-4">
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit" variant="warning">
                <FaSearch />
              </Button>
            </InputGroup>
          </Form>

          <div className="d-flex flex-column gap-3">
            {!user && (
              <div
                className="nav-hover text-dark"
                onClick={() => {
                  setShowAuth("login");
                  setShowMiniMenu(false);
                }}
              >
                <FaSignInAlt className="me-2" /> Sign In
              </div>
            )}
            <div
              className="nav-hover text-dark"
              onClick={() => handleNavigate("/cart")}
            >
              <FaShoppingCart className="me-2" /> View Cart
            </div>
            {user && (
              <>
                <div
                  className="nav-hover text-dark"
                  onClick={() => handleNavigate("/profile")}
                >
                  <FaUser className="me-2" /> Profile
                </div>
                <div className="nav-hover text-dark" onClick={handleLogout}>
                  🚪 Logout
                </div>
              </>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Auth Modal */}
      <AuthModal
        show={!!showAuth}
        activeTab={showAuth}
        onHide={() => setShowAuth(false)}
      />
    </>
  );
}
