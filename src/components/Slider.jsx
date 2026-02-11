import React, { useState, useEffect, useRef } from "react";
import "./slider.css";
import { Alert, Button } from "react-bootstrap";
import { FaRedo } from "react-icons/fa";
import noDataImg from "../assets/no-data.png"; // Adjust as needed

const Slider = () => {
  const [sliders, setSliders] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const intervalRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const loadSliders = () => {
    setLoading(true);
    setErrorMsg("");
    fetch("http://localhost/projects/ecom/sliders")
      .then((res) => res.json())
      .then((data) => {
        if (data.sliders && data.sliders.length) {
          const sorted = data.sliders.sort(
            (a, b) => a.display_order - b.display_order
          );
          setSliders(sorted);
        } else {
          setErrorMsg("No sliders found.");
        }
        setLoading(false);
      })
      .catch(() => {
        setErrorMsg("Failed to load sliders. Please try again.");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadSliders();
  }, []);

  // Autoplay with pause on hover
  useEffect(() => {
    if (sliders.length && !isHovered) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev === sliders.length - 1 ? 0 : prev + 1));
      }, 2000);
    }

    return () => clearInterval(intervalRef.current);
  }, [sliders, isHovered]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? sliders.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === sliders.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <div className="hero-slider-container slider-skeleton p-4">
        <div className="skeleton-image mb-3"></div>
        <div className="skeleton-text mb-2"></div>
        <div className="skeleton-text short"></div>
      </div>
    );
  }

  if (!loading && errorMsg) {
    return (
      <div className="hero-slider-container text-center my-4">
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
    );
  }

  const { title, description, image_url } = sliders[currentIndex];

  return (
    <div
      className="hero-slider-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="hero-slide fade-slide"
        style={{ backgroundImage: `url(${image_url})` }}
      >
        <div className="slider-overlay">
          <h2 className="slider-title">{title}</h2>
          <p className="slider-description">{description}</p>
        </div>

        <button className="slider-btn prev" onClick={prevSlide}>
          &#10094;
        </button>
        <button className="slider-btn next" onClick={nextSlide}>
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default Slider;
