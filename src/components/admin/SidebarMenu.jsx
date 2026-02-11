import React, { useState } from "react";
import "./Sidebar.css";
import Logo from "../../assets/logo.png";
import { UilSignOutAlt, UilBars } from "@iconscout/react-unicons";
import { motion } from "framer-motion";
import { SidebarData } from "../../Data/Data";
import { Link } from "react-router-dom";

const SidebarMenu = ({ selectedIndex, setSelectedIndex }) => {
  const [expanded, setExpanded] = useState(true);

  const sidebarVariants = {
    true: { left: "0" },
    false: { left: "-60%" },
  };

  return (
    <>
      <div
        className="bars"
        style={expanded ? { left: "60%" } : { left: "5%" }}
        onClick={() => setExpanded(!expanded)}
      >
        <UilBars />
      </div>
      <motion.div
        className="sidebar"
        variants={sidebarVariants}
        animate={window.innerWidth <= 768 ? `${expanded}` : ""}
      >
        {/* logo */}
        <Link to="/" className="text-decoration-none">
          <div className="logo">
            <img src={Logo} alt="logo" />
            <span>
              Sh<span>o</span>ps
            </span>
          </div>
        </Link>

        <div className="menu">
          {SidebarData.map((item, index) => (
            <div
              className={
                selectedIndex === index ? "menuItem active" : "menuItem"
              }
              key={index}
              onClick={() => setSelectedIndex(index)}
            >
              <item.icon />
              <span>{item.heading}</span>
            </div>
          ))}
          {/* signout */}
          <div className="menuItem">
            <UilSignOutAlt />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SidebarMenu;
