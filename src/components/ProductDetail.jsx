import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductById } from "../hooks/api";
import { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { toast } from "react-toastify";

export default function ProductDetail() {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductById(id).then((res) => {
      if (res.error) setError(res.error);
      else setProduct(res.data);
      setLoading(false);
    });
  }, [id]);

  if (!product) {
    return (
      <div className="text-center mt-5">
        <p className="text-danger">Product not found.</p>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Go Back
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status" />
        <p>Loading featured products...</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="row">
        <div className="col-md-6">
          <img
            src={
              product.images?.[0] ||
              "https://via.placeholder.com/500x400?text=No+Image"
            }
            alt={product.title}
            className="img-fluid"
            style={{
              borderRadius: "10px",
              maxHeight: "400px",
              objectFit: "cover",
            }}
          />
        </div>

        <div className="col-md-6">
          <h2>{product.title}</h2>
          <p className="text-muted">{product.description}</p>
          <h4 className="text-success">${product.price}</h4>
        </div>
      </div>

      {product.images?.length > 1 && (
        <>
          <h5 className="mt-5">More Images</h5>
          <div className="d-flex overflow-auto gap-3 mt-2">
            {product.images.slice(1).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Extra ${idx}`}
                style={{
                  height: "100px",
                  width: "150px",
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
              />
            ))}
          </div>
        </>
      )}
      {error && (
        <div className="col-12 text-danger text-center mt-3">{error}</div>
      )}
      <button
        className="btn btn-primary mt-3"
        onClick={() => {
          addToCart(product);
          toast.success(`${product.title} added to cart!`);
        }}
        disabled={product.stock === 0}
      >
        🛒 Add to Cart
      </button>
    </div>
  );
}
