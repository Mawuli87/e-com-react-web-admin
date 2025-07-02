import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { submitCheckout } from "../hooks/api";
import { fetchUserAddresses } from "../hooks/address";
import AuthModal from "../components/modals/AuthModal";
import { AuthContext } from "../contexts/AuthContext";
import NewAddressModal from "../components/modals/NewAddressModal";
import { toast } from "react-toastify";

export default function CheckoutPage() {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const { cartItems, clearCart } = useContext(CartContext);

  const [addressId, setAddressId] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const productTotal = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.price) || 0;
    const qty = parseInt(item.quantity) || 0;
    return acc + price * qty;
  }, 0);

  const total = productTotal + deliveryFee;

  // Load addresses (outside of useEffect)
  const loadAddresses = async () => {
    if (!user || !token) {
      setLoading(false);
      setError("You must be logged in to view your addresses.");
      return;
    }

    const res = await fetchUserAddresses(user.id, token);

    if (res.error) {
      setError(res.error);
    } else {
      const data = res.data.address;
      setAddresses(data);

      // Set default address
      if (Array.isArray(data)) {
        const defaultAddr = data.find((a) => a.is_default);
        setAddressId(defaultAddr ? defaultAddr.id : data[0]?.id);
      } else if (data && typeof data === "object") {
        setAddressId(data.id);
      }
    }

    setLoading(false);
  };

  // Load addresses on mount
  useEffect(() => {
    if (!user) {
      setShowAuthModal(true);
    }
  }, [user]);

  useEffect(() => {
    if (user && token) {
      loadAddresses();
    }
    // eslint-disable-next-line
  }, [user?.id, token]);

  // Update deliveryFee when addressId or addresses change
  useEffect(() => {
    if (Array.isArray(addresses)) {
      const selected = addresses.find((a) => a.id === addressId);
      setDeliveryFee(parseFloat(selected?.delivery_fee || 0));
    } else if (addresses && typeof addresses === "object") {
      setDeliveryFee(parseFloat(addresses.delivery_fee || 0));
    }
  }, [addresses, addressId]);

  const handleAddAddress = () => {
    if (!user || !token) {
      navigate("/login");
    } else {
      setShowAddModal(true);
    }
  };
  const handleCheckout = async () => {
    if (!addressId) {
      toast.error("Please select an address");
      return;
    }

    const toastId = toast.loading("Placing order...");

    const payload = {
      address_id: addressId,
      payment_method: paymentMethod,
      items: cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    const res = await submitCheckout(payload, token);

    if (res.error) {
      toast.update(toastId, {
        render: res.error || "Checkout failed.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } else {
      toast.update(toastId, {
        render: "Order placed successfully!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      clearCart();
      navigate(`/thank-you?order_id=${res.order_id}`);
    }
  };

  return (
    <>
      {!user ? (
        <>
          <div className="container mt-5 text-center">
            <h2>Please Authenticate</h2>
            <p>You need to login before proceeding to checkout.</p>
            <Link to="/" className="btn btn-outline-primary me-2">
              Continue Shopping
            </Link>
          </div>
          <AuthModal
            show={showAuthModal}
            onHide={() => setShowAuthModal(false)}
          />
        </>
      ) : (
        <div className="container mt-4">
          <h2>Checkout</h2>

          {error && (
            <div className="alert alert-danger text-center">
              <p>{error}</p>
              {!showAddModal && (
                <button
                  className="btn btn-primary mt-2"
                  onClick={handleAddAddress}
                >
                  Add New Address
                </button>
              )}
            </div>
          )}

          {loading ? (
            <p>Loading addresses...</p>
          ) : (
            <div className="row">
              <div className="col-md-6">
                <h4>Select Address</h4>
                {Array.isArray(addresses) && addresses.length > 0 ? (
                  addresses.map((address) => (
                    <div key={address.id} className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="address"
                        value={address.id}
                        checked={addressId === address.id}
                        onChange={() => setAddressId(address.id)}
                      />
                      <label className="form-check-label">
                        {address.label}, {address.street_address},{" "}
                        {address.city}, {address.region}
                        <br />
                        <strong>Delivery Fee: ₵{address.delivery_fee}</strong>
                      </label>
                    </div>
                  ))
                ) : typeof addresses === "object" ? (
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="address"
                      value={addresses.id}
                      checked
                      readOnly
                    />
                    <label className="form-check-label">
                      {addresses.label}, {addresses.street_address},{" "}
                      {addresses.city}, {addresses.region}
                      <br />
                      <strong>Delivery Fee: ₵{addresses.delivery_fee}</strong>
                    </label>
                  </div>
                ) : (
                  !error &&
                  !showAddForm && (
                    <div className="alert alert-info">
                      <p>No saved addresses yet.</p>
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => setShowAddForm(true)}
                      >
                        Add Address
                      </button>
                    </div>
                  )
                )}
              </div>

              <div className="col-md-6">
                <h4>Payment Method</h4>
                <select
                  className="form-control"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="momo">Mobile Money</option>
                  <option value="paystack">Paystack</option>
                  <option value="flutterwave">Flutterwave</option>
                  <option value="creditcard">Credit Card</option>
                </select>

                <h4 className="mt-4">Order Summary</h4>
                <ul className="list-group">
                  {cartItems.map((item) => (
                    <li
                      key={item.id}
                      className="list-group-item d-flex justify-content-between"
                    >
                      {item.title} x {item.quantity}
                      <span>₵{(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                  <li className="list-group-item d-flex justify-content-between">
                    Delivery Fee
                    <span>₵{deliveryFee.toFixed(2)}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between fw-bold">
                    Total <span>₵{total.toFixed(2)}</span>
                  </li>
                </ul>

                <button
                  className="btn btn-primary mt-3 w-100"
                  onClick={handleCheckout}
                >
                  Place Order
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {user && token && (
        <NewAddressModal
          show={showAddModal}
          onHide={() => setShowAddModal(false)}
          token={token}
          user_id={user.id}
          onSuccess={() => {
            setShowAddModal(false);
            loadAddresses(); // ✅ Refresh addresses after adding
          }}
        />
      )}
    </>
  );
}
