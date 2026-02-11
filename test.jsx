import React, { useState, useEffect } from "react";

import { toast } from "react-toastify";
import ProductImagesModal from "../../components/admin/ProductImagesModal";
import EditProductModal from "../../components/admin/EditProductModal";

export default function AdminProducts({ products, loading, error, token }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtered, setFiltered] = useState(products || []);
  const [updatedProductId, setUpdatedProductId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);

  // Detect screen size
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFiltered(
      products.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          (p.category_name || "").toLowerCase().includes(term)
      )
    );
  }, [searchTerm, products]);

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      const res = await fetch(
        `http://localhost/projects/ecom/admin/products/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Product deleted");
        setFiltered((prev) => prev.filter((p) => p.id !== id));
      } else {
        toast.error(data.message || "Failed to delete");
      }
    } catch (err) {
      toast.error("Error deleting product");
      console.error(err);
    }
  };

  const handleProductUpdated = (updatedProduct) => {
    setUpdatedProductId(updatedProduct.id);
    setFiltered((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setShowEditModal(false);
    setSuccessMessage("Product updated successfully!");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">🛒 Admin Products</h2>

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by title or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : isMobile ? (
        // 🔸 Mobile view (cards)
        <div className="row">
          {filtered.map((p) => (
            <div className="col-12 mb-3" key={p.id}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{p.title}</h5>
                  <p className="card-text">
                    <strong>Price:</strong> ₵{parseFloat(p.price).toFixed(2)}{" "}
                    <br />
                    <strong>Category:</strong> {p.category_name || "N/A"} <br />
                    <strong>Stock:</strong> {p.stock} <br />
                    <strong>Featured:</strong> {p.is_featured ? "Yes" : "No"}
                  </p>
                  <div className="d-flex gap-2 flex-wrap">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => {
                        setImageUrls(p.images || []);
                        setShowImagesModal(true);
                      }}
                    >
                      View Images
                    </button>
                    <button
                      onClick={() => openEditModal(p)}
                      className="btn btn-warning btn-sm"
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => deleteProduct(p.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // 🔹 Desktop view (table)
        <div
          className="table-responsive"
          style={{ maxHeight: "80vh", overflowX: "auto" }}
        >
          <table className="table table-striped table-hover">
            <thead className="table-dark sticky-top">
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th className="d-none d-md-table-cell">Category</th>
                <th className="d-none d-sm-table-cell">Price (₵)</th>
                <th className="d-none d-md-table-cell">Stock</th>
                <th className="d-none d-sm-table-cell">Featured</th>
                <th>Images</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className={
                    p.id === updatedProductId ? "table-success fw-bold" : ""
                  }
                >
                  <td>{p.id}</td>
                  <td>{p.title}</td>
                  <td className="d-none d-md-table-cell">
                    {p.category_name || "N/A"}
                  </td>
                  <td className="d-none d-sm-table-cell">
                    {parseFloat(p.price).toFixed(2)}
                  </td>
                  <td className="d-none d-md-table-cell">{p.stock}</td>
                  <td className="d-none d-sm-table-cell">
                    {p.is_featured ? (
                      <span className="badge bg-success">Yes</span>
                    ) : (
                      <span className="badge bg-secondary">No</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => {
                        setImageUrls(p.images || []);
                        setShowImagesModal(true);
                      }}
                    >
                      View Images
                    </button>
                  </td>
                  <td className="d-flex flex-column gap-1">
                    <button
                      onClick={() => openEditModal(p)}
                      className="btn btn-warning btn-sm"
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteProduct(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <ProductImagesModal
        show={showImagesModal}
        onHide={() => setShowImagesModal(false)}
        images={imageUrls}
      />

      <EditProductModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        product={selectedProduct}
        onUpdated={handleProductUpdated}
      />
    </div>
  );
}
