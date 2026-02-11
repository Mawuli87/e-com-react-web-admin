import React, { useState } from "react";

import RightSide from "../../components/admin/Cards/RightSide";
import "./adminDashboard.css";
import SidebarMenu from "../../components/admin/SidebarMenu";
import { SidebarData } from "../../Data/Data";

function AdminDashboard() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Get the active component from SidebarData
  const ActiveComponent = SidebarData[selectedIndex].component;

  return (
    <div className="Admin admin-dashboard-theme">
      <div className="AppGlass">
        <SidebarMenu
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />
        <div className="main-section">
          <ActiveComponent />
        </div>
        <RightSide />
      </div>
    </div>
  );
}

export default AdminDashboard;
