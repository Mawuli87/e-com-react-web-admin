import { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartIcon() {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/cart")}
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        background: "#ead009",
        color: "white",
        borderRadius: "50%",
        width: 50,
        height: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        cursor: "pointer",
        zIndex: 1000,
      }}
    >
      🛒
      {cartItems.length > 0 && (
        <span
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            background: "red",
            color: "white",
            borderRadius: "50%",
            padding: "2px 6px",
            fontSize: "12px",
          }}
        >
          {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        </span>
      )}
    </div>
  );
}
