import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaListAlt, FaTasks } from "react-icons/fa";
import "../styles/home.css";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Add Activities",
      icon: <FaTasks size={40} />,
      onClick: () => navigate("/add-tasks"),
      tooltip: "Create an activity.",
    },
    {
      title: "View Activities",
      icon: <FaListAlt size={40} />,
      onClick: () => navigate("/list-of-tasks"),
      tooltip: "Take a look at your recorded activities.",
    },
    {
      title: "Coming Soon",
      icon: <FaPlus size={40} />,
      onClick: () => alert("More features coming soon!"),
      tooltip: "More features coming...",
      style: {
        background: "#fff",
        color: "#333",
        border: "1px solid #ccc",
      },
    },
  ];

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-heading">Dashboard</h2>
      <div className="dashboard-grid">
        {features.map((feature, index) => (
          <div
            key={index}
            className="dashboard-card"
            onClick={feature.onClick}
            title={feature.tooltip}
            style={feature.style}
          >
            {feature.icon}
            <p>{feature.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
