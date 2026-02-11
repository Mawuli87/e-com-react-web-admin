import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Divider } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import "./dealdetail.css";

const DealDetail = () => {
  const { id } = useParams(); // get the product id from the URL
  const { products } = useSelector((state) => state.getproductsdata); // get products from Redux

  const [inddata, setIndedata] = useState(null);

  useEffect(() => {
    // Find the product by ID
    const foundProduct = products.find((p) => p.id === id);
    setTimeout(() => {
      if (foundProduct) {
        setIndedata(foundProduct);
      } else {
        alert("Product not found");
      }
    }, 1000); // simulate loading
  }, [id, products]);

  return (
    <div className="cart_section">
      {!inddata ? (
        <div className="circle">
          <CircularProgress />
          <h2>Loading...</h2>
        </div>
      ) : (
        <div className="cart_container">
          <div className="left_cart">
            <img src={inddata.url} alt="product" />
            <div className="cart_btn">
              <button className="cart_btn1">Add to Cart</button>
              <button className="cart_btn2">Buy Now</button>
            </div>
          </div>
          <div className="right_cart">
            <h3>{inddata.title.shortTitle}</h3>
            <h4>{inddata.title.longTitle}</h4>
            <Divider />
            <p className="mrp">
              M.R.P. : <del>₹{inddata.price.mrp}</del>
            </p>
            <p>
              Deal of the Day :{" "}
              <span style={{ color: "#B12704" }}>₹{inddata.price.cost}.00</span>
            </p>
            <p>
              You save :{" "}
              <span style={{ color: "#B12704" }}>
                ₹{inddata.price.mrp - inddata.price.cost} (
                {inddata.price.discount})
              </span>
            </p>
            <div className="discount_box">
              <h5>
                Discount :{" "}
                <span style={{ color: "#111" }}>{inddata.discount}</span>
              </h5>
              <h4>
                FREE Delivery :{" "}
                <span style={{ fontWeight: 600 }}>Oct 8 - 21</span> Details
              </h4>
              <p>
                Fastest Delivery :{" "}
                <span style={{ fontWeight: 600 }}>Tomorrow 11AM</span>
              </p>
            </div>
            <p className="description">
              About the item :{" "}
              <span
                style={{
                  color: "#565959",
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: "0.4px",
                }}
              >
                {inddata.description}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealDetail;
