import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { getToken } from "../../utils/auth";
import { toast } from "react-toastify";
import EditProductModal from "../../components/admin/EditProductModal";
import ProductImagesModal from "../../components/admin/ProductImagesModal";
import ConfirmModal from "../../components/admin/ConfirmModal";

export default function AdminProductsList() {
  const { user } = useContext(AuthContext);
  const token = getToken();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [showImagesModal, setShowImagesModal] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);

  const [updatedProductId, setUpdatedProductId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  //delete modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [productToDeleteId, setProductToDeleteId] = useState(null);

  // Detect screen size
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost/projects/ecom/admin/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
        setError("");
      } else {
        setError("No products found.");
      }
    } catch (err) {
      setError("Failed to fetch products.");
    }
    setLoading(false);
  };

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(
        `http://localhost/projects/ecom/admin/product/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (data.message === "Product and images deleted") {
        toast.success("Product deleted successfully");
        fetchProducts();
      } else {
        toast.error(data.message || "Failed to delete product.");
      }
    } catch (err) {
      toast.error("Error deleting product.");
    }
  };

  // Called after update to refresh products and show success
  const handleProductUpdated = () => {
    setSuccessMessage("Product updated successfully!");
    setUpdatedProductId(selectedProduct.id);
    fetchProducts();

    setTimeout(() => {
      setSuccessMessage("");
      setUpdatedProductId(null);
    }, 3000);
  };

  useEffect(() => {
    fetchProducts();
  }, [token]);

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                      onClick={() => {
                        setProductToDeleteId(p.id);
                        setShowConfirm(true);
                      }}
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
                  <td>
                    {/* 🌐 For desktop: Show buttons side by side */}
                    <div className="d-none d-md-flex gap-1">
                      <button
                        onClick={() => openEditModal(p)}
                        className="btn btn-warning btn-sm"
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => {
                          setProductToDeleteId(p.id);
                          setShowConfirm(true);
                        }}
                      >
                        Delete
                      </button>
                    </div>

                    {/* 📱 For mobile: Show dropdown menu */}
                    <div className="dropdown d-md-none">
                      <button
                        className="btn btn-sm btn-secondary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        ⋮ More
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => openEditModal(p)}
                          >
                            ✏️ Edit
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item text-danger"
                            // onClick={() => deleteProduct(p.id)}
                            onClick={() => {
                              setProductToDeleteId(p.id);
                              setShowConfirm(true);
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </li>
                      </ul>
                    </div>
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
      {/* delete modal*/}
      <ConfirmModal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        onConfirm={() => {
          deleteProduct(productToDeleteId);
          setShowConfirm(false);
          setProductToDeleteId(null);
        }}
        title="Confirm Delete"
        body="Are you sure you want to delete this product? This action cannot be undone."
      />
    </div>
  );
}
