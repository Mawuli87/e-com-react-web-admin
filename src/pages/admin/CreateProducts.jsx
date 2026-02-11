import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./createproducts.css";

export default function AdminAddProduct() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category_id: "",
    price: "",
    discount: "",
    stock: "",
    is_featured: false,
  });

  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [categories, setCategories] = useState([]);

  //fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost/projects/ecom/categories");
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      formData.append(key, val);
    });

    images.forEach((img) => {
      formData.append("images[]", img);
    });

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost/projects/ecom/admin/products/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.message) {
        toast.success("Product created successfully!");
        setForm({
          title: "",
          description: "",
          category_id: "",
          price: "",
          discount: "",
          stock: "",
          is_featured: false,
        });
        setImages([]);
        setPreviewUrls([]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create product");
    }
  };

  return (
    <div className="create-product-container">
      <h2 className="form-title">➕ Add New Product</h2>
      <form
        onSubmit={handleSubmit}
        className="product-form"
        encType="multipart/form-data"
      >
        <div className="form-grid">
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Price *</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              step="10"
              required
            />
          </div>

          <div className="form-group">
            <label>Discount</label>
            <input
              type="number"
              name="discount"
              value={form.discount}
              onChange={handleChange}
              step="5"
            />
          </div>

          <div className="form-group">
            <label>Stock</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Category ID</label>
            <input
              type="number"
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
            />
          </div>

          <div className="form-group checkbox">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_featured"
                checked={form.is_featured}
                onChange={handleChange}
              />
              <span>Featured Product</span>
            </label>
          </div>

          {/* <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                name="is_featured"
                checked={form.is_featured}
                onChange={handleChange}
              />
              Featured Product
            </label>
          </div> */}

          <div className="form-group full-width">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-group full-width">
            <label>Images</label>
            <input
              type="file"
              name="images"
              multiple
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>

          {previewUrls.length > 0 && (
            <div className="image-preview-container full-width">
              {previewUrls.map((src, index) => (
                <div className="image-preview" key={index}>
                  <img src={src} alt={`Preview ${index}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit">Create Product</button>
        </div>
      </form>
    </div>
  );
}
