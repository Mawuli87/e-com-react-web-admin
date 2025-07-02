import React, { useEffect, useState } from "react";
import { fetchFeaturedProducts } from "../hooks/api";
import { useNavigate } from "react-router-dom";

export default function Feature() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedProducts().then((res) => {
      if (res.error) setError(res.error);
      else setProducts(res.data || []);
      setLoading(false);
    });
  }, []);

  const handleClick = (product) => {
    navigate(`/product/${product.id}`, { state: product });
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status" />
        <p>Loading featured products...</p>
      </div>
    );
  }

  return (
    <section className="py-4">
      <h2 className="text-center mb-4">🌟 Featured Products</h2>
      <div className="container">
        <div className="row">
          {products.map((product) => {
            const thumbnail =
              product.images?.[0] ||
              "https://via.placeholder.com/300x200?text=No+Image";
            return (
              <div key={product.id} className="col-md-3 col-sm-6 mb-4">
                <div
                  className="card h-100 shadow-sm"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleClick(product)}
                >
                  <img
                    src={thumbnail}
                    alt={product.title}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title">{product.title}</h5>
                    <p className="card-text text-success fw-bold">
                      ${product.price}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          {error && (
            <div className="col-12 text-danger text-center mt-3">{error}</div>
          )}
        </div>
      </div>
    </section>
  );
}
