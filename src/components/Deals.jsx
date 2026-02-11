// import { Divider } from '@mui/material'
import React, { useEffect } from "react";
import "./deals.css";

import { useDispatch, useSelector } from "react-redux";
import Slide from "./deals/Slide";
import { getProducts } from "../redux/actions/actions";

const Deals = () => {
  const { products } = useSelector((state) => state.getproductsdata);
  console.log("Products " + products);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <div className="home_section">
      <div className="slide_part">
        <div className="left_slide">
          <Slide title="Deal Of The Day" products={products} />
        </div>
        <div className="right_slide">
          <h4>Festival latest launches</h4>
          <img
            src="https://images-eu.ssl-images-amazon.com/images/G/31/img21/Wireless/Jupiter/Launches/T3/DesktopGateway_CategoryCard2x_758X608_T3._SY608_CB639883570_.jpg"
            alt="rightimg"
          />
          <a href="/#">See More</a>
        </div>
      </div>

      <Slide title="Today's Deal" products={products} />
      <div className="center_img">
        <img
          src="https://m.media-amazon.com/images/G/31/AMS/IN/970X250-_desktop_banner.jpg"
          alt=""
        />
      </div>
      <Slide title="Best Seller" products={products} />
      <Slide title="Upto 80% off" products={products} />
    </div>
  );
};

export default Deals;
