import React, { useEffect, useState, useRef } from "react";
import { Button, Spinner, Alert } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight, FaRedo } from "react-icons/fa";

import "./HeroSlider.css";
import { fetchSliders } from "../hooks/api";
import noDataImg from "../assets/no-data.png"; // Make sure you have this image

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const sliderRef = useRef(null);

  const loadSliders = async () => {
    setLoading(true);
    setErrorMsg(null);

    const { data, error } = await fetchSliders();

    if (error) {
      setErrorMsg("Failed to load sliders. Please try again.");
      setSlides([]);
    } else {
      const sorted = data
        .filter((s) => s.is_active)
        .sort((a, b) => a.display_order - b.display_order);

      if (sorted.length === 0) {
        setErrorMsg("No sliders available at the moment.");
      }

      setSlides(sorted);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadSliders();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides]);

  const prevSlide = () =>
    setIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  const nextSlide = () => setIndex((prev) => (prev + 1) % slides.length);

  const handleImageLoad = (id) =>
    setLoadedImages((prev) => ({ ...prev, [id]: true }));

  return (
    <div className="container-fluid mt-3 px-0">
      <div className="row g-0">
        {/* Slider column */}
        <div className="col-lg-10 col-12 mb-3 mb-lg-0">
          <div className="slider-container" ref={sliderRef}>
            {/* Skeleton loader */}
            {loading && (
              <div className="slider-skeleton p-4">
                <div className="skeleton-image mb-3"></div>
                <div className="skeleton-text mb-2"></div>
                <div className="skeleton-text short"></div>
              </div>
            )}

            {/* Error or Empty message */}
            {!loading && errorMsg && (
              <div className="text-center my-4">
                <img
                  src={noDataImg}
                  alt="No Data"
                  style={{ width: "150px", opacity: 0.8 }}
                  className="mb-3"
                />
                <Alert variant="warning">{errorMsg}</Alert>
                <Button
                  variant="outline-primary"
                  onClick={loadSliders}
                  className="d-inline-flex align-items-center retry-btn"
                >
                  <FaRedo className="me-2 rotate-on-hover" />
                  Retry
                </Button>
              </div>
            )}

            {/* Real Slider */}
            {!loading && !errorMsg && slides.length > 0 && (
              <>
                {slides.map((slide, i) => (
                  <div
                    key={slide.id}
                    className={`slide ${i === index ? "active" : ""}`}
                  >
                    {!loadedImages[slide.id] && (
                      <div className="spinner-container">
                        <Spinner animation="border" variant="light" />
                      </div>
                    )}
                    <img
                      src={slide.image_url}
                      alt={slide.title}
                      onLoad={() => handleImageLoad(slide.id)}
                      className={`slider-img ${
                        loadedImages[slide.id] ? "loaded" : ""
                      }`}
                    />
                    {loadedImages[slide.id] && (
                      <div className="overlay">
                        <h2>{slide.title}</h2>
                        <p>{slide.description}</p>
                      </div>
                    )}
                  </div>
                ))}
                <Button className="nav-btn prev" onClick={prevSlide}>
                  <FaChevronLeft />
                </Button>
                <Button className="nav-btn next" onClick={nextSlide}>
                  <FaChevronRight />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Ad column for large screens */}
        <div className="col-lg-2 d-none d-lg-block">
          <div className="ad-box p-2 h-100 mt-2 ms-1 mb-2 bg-light border rounded">
            <img
              src="https://images.unsplash.com/photo-1588131153911-a4ea5189fe19?q=80&w=1162&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Promo Ad"
              className="w-100 h-100 object-fit-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
