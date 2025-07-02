import React from "react";
import { Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./NavbarCategories.css";

export default function NavbarCategories({ categories }) {
  const navigate = useNavigate();

  return (
    <Nav
      className="bg-light py-2 px-3 category-bar d-none d-md-flex"
      style={{ overflowX: "auto", whiteSpace: "nowrap" }}
    >
      {categories.map((cat) => (
        <Nav.Link
          key={cat.id}
          className="mx-2 category-item px-4"
          onClick={() => navigate(`/category/${cat.id}`)}
        >
          {cat.name}
        </Nav.Link>
      ))}
    </Nav>
  );
}
