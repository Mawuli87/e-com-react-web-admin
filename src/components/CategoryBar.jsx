import React, { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./CategoryBar.css";

export default function CategoryBar() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost/projects/ecom/admin/categories") // Update to match your API
      .then((res) => res.json())
      .then((data) => setCategories(data.categories))
      .catch((err) => console.error("Category fetch error:", err));
  }, []);

  return (
    <Nav
      className="bg-light py-2 px-3 category-bar d-none d-md-flex"
      style={{ overflowX: "auto", whiteSpace: "nowrap" }}
    >
      {categories.map((cat) => (
        <Nav.Link
          key={cat.id}
          className="mx-2 category-item"
          onClick={() => navigate(`/category/${cat.id}`)}
        >
          {cat.name}
        </Nav.Link>
      ))}
    </Nav>
  );
}
