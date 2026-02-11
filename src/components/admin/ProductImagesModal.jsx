import React from "react";

export default function ProductImagesModal({ show, onHide, images = [] }) {
  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Product Images</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onHide}
            ></button>
          </div>
          <div className="modal-body d-flex flex-wrap gap-3">
            {images.length > 0 ? (
              images.map((imgUrl, index) => (
                <img
                  key={index}
                  src={imgUrl.url}
                  alt={`Product ${index}`}
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
              ))
            ) : (
              <p>No images available for this product.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
