//import Cards from "../Cards/Cards";
//import Table from "../Table/Table";
import "./MainDashboard.css";
import Cards from "./Cards/Cards";
const MainDashboard = () => {
  return (
    <div className="MainDash">
      <h1>Dashboard</h1>
      <Cards />
      {/* <Table /> */}
    </div>
  );
};

export default MainDashboard;
