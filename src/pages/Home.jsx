import React, { useState, useEffect } from "react";
import NavbarTop from "../components/NavbarTop";
import NavbarCategories from "../components/NavbarCategories";
import OffCanvasMenu from "../components/OffCanvasMenu";
import { fetchCategories } from "../hooks/api";
import Loading from "../components/Loading"; // Make sure this shows spinner + optional text
import HeroSlider from "../components/HeroSlider";
import Feature from "../components/Feature";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      const { data, error } = await fetchCategories();
      setCategories(data);
      setError(error);
      setLoading(false);
    };
    loadCategories();
  }, []);

  return (
    <>
      <NavbarTop onToggleMenu={() => setMenuOpen(true)} />

      {loading && (
        <div className="container mt-4 text-center">
          <Loading text="Loading categories..." />
        </div>
      )}

      {error && (
        <div className="container mt-4 text-center">
          <p style={{ color: "red" }}>Error: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <NavbarCategories categories={categories} />

          <OffCanvasMenu
            show={menuOpen}
            onHide={() => setMenuOpen(false)}
            categories={categories}
          />

          <div className="container-fluid mt-3 px-2">
            <h3 className="ms-4">Welcome to E-com</h3>
            {/* 👇 Add the Hero Slider here */}
            <HeroSlider />
            <Feature />
            {/* You can render featured products, promotions, or banners here */}
          </div>
        </>
      )}
    </>
  );
}
