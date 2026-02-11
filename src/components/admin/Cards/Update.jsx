import React from "react";
import "./Update.css";
import { UpdatesData } from "../../../Data/Data";

const Updates = () => {
  return (
    <div className="Updates">
      {UpdatesData.map((update, index) => (
        <div className="update" key={index}>
          <img src={update.img} alt={`${update.name}'s profile`} />
          <div className="noti">
            <div>
              <span>{update.name}</span>
              <span> {update.noti}</span>
            </div>
            <span>{update.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Updates;
