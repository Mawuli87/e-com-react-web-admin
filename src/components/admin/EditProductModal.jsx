import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Image } from "react-bootstrap";
import { toast } from "react-toastify";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { getToken } from "../../utils/auth";

export default function EditProductModal({ show, onHide, product, onUpdated }) {
  const token = getToken();
  // Initial empty states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [stock, setStock] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [deleteImageId, setDeleteImageId] = useState(null);

  // Sync all fields when a product is passed in or changed
  useEffect(() => {
    if (product) {
      setTitle(product.title || "");
      setDescription(product.description || "");
      setCategoryId(product.category_id || "");
      setPrice(product.price || "");
      setDiscount(product.discount || "");
      setStock(product.stock || "");
      setIsFeatured(product.is_featured === 1);
      setExistingImages(product.images || []);
    }
  }, [product]);

  useEffect(() => {
    if (product?.images) {
      setExistingImages(product.images);
    }
  }, [product]);

  console.log("Existing Images" + JSON.stringify(product));
  //console.log("Incoming Product Images:", product?.images);
  //console.log("State Existing Images:", existingImages);

  useEffect(() => {
    fetch("http://localhost/projects/ecom/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []));
  }, []);

  //handle delete single image
  const handleDeleteImage = async () => {
    try {
      const res = await fetch(
        `http://localhost/projects/ecom/admin/products/delete-image/${deleteImageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();

      if (data.message === "Image deleted") {
        toast.success("Image deleted");
        setExistingImages(
          existingImages.filter((img) => img.id !== deleteImageId)
        );
        setDeleteImageId(null);
      } else {
        toast.error(data.message || "Failed to delete image");
      }
    } catch (err) {
      toast.error("Error deleting image");
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !price) return toast.error("Title and price are required");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category_id", categoryId);
    formData.append("price", price);
    formData.append("discount", discount);
    formData.append("stock", stock);
    formData.append("is_featured", isFeatured ? 1 : 0);

    for (const img of images) {
      formData.append("images[]", img);
    }

    try {
      const res = await fetch(
        `http://localhost/projects/ecom/admin/products/${product.id}/update`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Product updated");
        onHide();
        onUpdated();
      } else {
        toast.error(data.message || "Failed to update product");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product #{product?.id}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Modal.Body>
            <Form.Group>
              <Form.Label>Title *</Form.Label>
              <Form.Control
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Price *</Form.Label>
                  <Form.Control
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Discount</Form.Label>
                  <Form.Control
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Check
              type="checkbox"
              label="Featured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="mb-3"
            />

            <Form.Group>
              <Form.Label>Upload New Images</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={(e) => setImages([...e.target.files])}
              />
            </Form.Group>

            {existingImages.length > 0 && (
              <div className="mt-3">
                <strong>Existing Images:</strong>
                <div className="d-flex flex-wrap gap-3 mt-2">
                  {existingImages.map((img, index) => (
                    <div key={index} style={{ position: "relative" }}>
                      <Image src={img.url} width={100} height={100} rounded />
                      <Button
                        size="sm"
                        variant="danger"
                        style={{ position: "absolute", top: 0, right: 0 }}
                        onClick={() => setDeleteImageId(img.id)}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <DeleteConfirmModal
        show={!!deleteImageId}
        onHide={() => setDeleteImageId(null)}
        onConfirm={handleDeleteImage}
        title="Delete Image"
        message="Are you sure you want to delete this image?"
      />
    </>
  );
}
