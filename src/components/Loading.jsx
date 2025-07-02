import React from "react";

const Loading = ({ text = "Loading..." }) => {
  return (
    <div style={{ textAlign: "center", padding: "1rem" }}>
      <p>
        <i
          className="fas fa-spinner fa-spin"
          style={{ marginRight: "8px" }}
        ></i>
        {text}
      </p>
    </div>
  );
};

export default Loading;
