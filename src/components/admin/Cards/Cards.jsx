import React, { useContext } from "react";
import "./Cards.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Card from "./Card";
import { AuthContext } from "../../../contexts/AuthContext";
import { fetchAdminStats, fetchSalesSummary } from "../../../hooks/api";
import { FaUsers } from "react-icons/fa6";
// Analytics Cards imports
import { UilUsdSquare, UilClipboardAlt } from "@iconscout/react-unicons";
import { FaCalendarDay, FaCalendarAlt } from "react-icons/fa";

const Cards = () => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const [statData, setStats] = useState([]); // ✅ this prevents the error
  const [salesSummary, setSalesSummary] = useState({
    today_sales: 0,
    month_sales: 0,
  });

  //console.log("StatsData " + JSON.stringify(statData));

  useEffect(() => {
    const loadStats = async () => {
      const res = await fetchAdminStats(token);
      if (res.error) {
        toast.error(res.error);
      } else {
        const stats = res.data;

        setStats([
          {
            title: "Total Sales",
            color: {
              backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
              boxShadow: "0px 10px 20px 0px #e0c6f5",
            },
            barValue: 70,
            value: `₵${stats.total_sales}`,
            png: UilUsdSquare,
            series: {
              name: "Total Sales",
              data: stats.sales_trend.data,
              labels: stats.sales_trend.labels,
            },
          },
          {
            title: "Users",
            color: {
              backGround: "linear-gradient(180deg, #FF919D 0%, #FC929D 100%)",
              boxShadow: "0px 10px 20px 0px #FDC0C7",
            },
            barValue: 50,
            value: stats.total_users,
            png: FaUsers,
            series: {
              name: "Users",
              data: stats.user_trend.data,
              labels: stats.user_trend.labels,
            },
          },
          {
            title: "Orders",
            color: {
              backGround:
                "linear-gradient(rgb(248, 212, 154) -146.42%, rgb(255 202 113) -46.42%)",
              boxShadow: "0px 10px 20px 0px #F9D59B",
            },
            barValue: 60,
            value: stats.total_orders,
            png: UilClipboardAlt,
            series: {
              name: "Orders",
              data: stats.order_trend.data,
              labels: stats.order_trend.labels,
            },
          },
        ]);
      }
    };

    if (token && user?.role === "admin") {
      loadStats();
    }
  }, [token, user]);

  useEffect(() => {
    const loadSalesSummary = async () => {
      if (!token) return;
      const res = await fetchSalesSummary(token);
      if (res.data) {
        setSalesSummary(res.data);
      }
    };

    loadSalesSummary();
  }, [token]);

  console.log("DATA " + JSON.stringify(salesSummary));

  return (
    <div className="container">
      <div className="Cards">
        {statData.map((stat, id) => {
          return (
            <div className="parentContainer" key={id}>
              <Card
                title={stat.title}
                color={stat.color}
                barValue={stat.barValue}
                value={stat.value}
                png={stat.png}
                series={stat.series}
              />
            </div>
          );
        })}
      </div>
      <div className="row mt-4">
        {/* Today’s Sales */}
        {/* Today’s Sales */}
        <div className="col-md-6 mb-3">
          <div
            className="card text-white shadow-sm h-100"
            style={{
              background: "linear-gradient(135deg, #00c9ff 0%, #92fe9d 100%)",
              border: "none",
              borderRadius: "1rem",
            }}
          >
            <div className="card-body text-center">
              <FaCalendarDay size={36} className="mb-2" />
              <h5 className="card-title">Today’s Sales</h5>
              <h3 className="card-text">
                ₵{salesSummary.today_sales.toFixed(2)}
              </h3>
            </div>
          </div>
        </div>

        {/* This Month’s Sales */}
        <div className="col-md-6 mb-3">
          <div
            className="card text-white shadow-sm h-100"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              borderRadius: "1rem",
            }}
          >
            <div className="card-body text-center">
              <FaCalendarAlt size={36} className="mb-2" />
              <h5 className="card-title">This Month’s Sales</h5>
              <h3 className="card-text">
                ₵{salesSummary.month_sales.toFixed(2)}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
