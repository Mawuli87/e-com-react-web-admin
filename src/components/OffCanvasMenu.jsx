import { useState } from "react";
import { Offcanvas } from "react-bootstrap";
import "./OffCanvasMenu.css";
import {
  FaBook,
  FaLaptop,
  FaMobileAlt,
  FaTv,
  FaChevronRight,
  FaAngleDown,
  FaAngleRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function OffCanvasMenu({ show, onHide, categories }) {
  const [expanded, setExpanded] = useState({});
  const navigate = useNavigate();

  const getIcon = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes("book")) return <FaBook className="category-icon" />;
    if (lower.includes("phone"))
      return <FaMobileAlt className="category-icon" />;
    if (lower.includes("laptop")) return <FaLaptop className="category-icon" />;
    if (lower.includes("tv") || lower.includes("electronic"))
      return <FaTv className="category-icon" />;
    return <FaChevronRight className="category-icon" />;
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCategoryClick = (slug) => {
    onHide();
    navigate(`/category/${slug}`);
  };

  const handleSubcategoryClick = (parentSlug, subSlug) => {
    onHide();
    navigate(`/category/${parentSlug}/${subSlug}`);
  };

  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      backdrop
      className="offcanvas-custom-width"
    >
      <Offcanvas.Header closeButton closeVariant="dark">
        <Offcanvas.Title>Browse Categories</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {categories.map((cat) => (
          <div key={cat.id} className="mb-2">
            <div
              className="category-item d-flex justify-content-between align-items-center text-dark"
              onClick={() =>
                cat.subcategories?.length
                  ? toggleExpand(cat.id)
                  : handleCategoryClick(cat.slug)
              }
            >
              <div className="d-flex align-items-center">
                {getIcon(cat.name)}
                <span className="ms-2">{cat.name}</span>
              </div>
              {cat.subcategories?.length ? (
                expanded[cat.id] ? (
                  <FaAngleDown />
                ) : (
                  <FaAngleRight />
                )
              ) : null}
            </div>

            {expanded[cat.id] && cat.subcategories?.length > 0 && (
              <div className="subcategory-list">
                {cat.subcategories.map((sub) => (
                  <div
                    key={sub.id}
                    className="subcategory-item text-secondary"
                    onClick={() => handleSubcategoryClick(cat.slug, sub.slug)}
                  >
                    {sub.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </Offcanvas.Body>
    </Offcanvas>
  );
}
