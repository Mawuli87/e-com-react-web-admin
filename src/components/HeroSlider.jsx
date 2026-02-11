import "./HeroSlider.css";
import Slider from "./Slider";

export default function HeroSlider() {
  return (
    <div className="container-fluid mt-3 px-0">
      <div className="row g-0">
        {/* Slider column */}
        <div className="col-lg-10 col-12 mb-3 mb-lg-0">
          <Slider />
        </div>

        {/* Ad column for large screens */}
        <div className="col-lg-2 d-none d-lg-block">
          <div className="ad-box p-2 h-100  ms-1 mb-2 bg-light border rounded">
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
