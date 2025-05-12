import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaListAlt, FaTasks, FaBullseye } from "react-icons/fa";
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
      title: "Milestones",
      icon: <FaBullseye size={40} />,
      onClick: () => navigate("/milestones"),
      tooltip: "View Your archivements",
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
      <h2 className="dashboard-heading">Welcome Back!</h2>
      <p className="dashboard-subtext">
        Plan, track and achieve your goals efficiently.
      </p>

      {/* Summary Section */}
      <div className="summary-cards">
        <div className="summary-card">
          <strong>14</strong>
          <span>Total Activities</span>
        </div>
        <div className="summary-card">
          <strong>8</strong>
          <span>Completed</span>
        </div>
        <div className="summary-card">
          <strong>6</strong>
          <span>Pending</span>
        </div>
      </div>

      {/* Feature Buttons */}
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

      {/* Recent Activity Log */}
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <ul>
          <li>✔️ Submitted Weekly Report</li>
          <li>🕒 Updated Task: Market Research</li>
          <li>🎯 Achieved Milestone: 10 Tasks Done</li>
        </ul>
      </div>

      {/* Tip or Quote */}
      <div className="daily-tip">
        <blockquote>
          “Productivity is never an accident. It is always the result of a
          commitment to excellence.”
        </blockquote>
      </div>
    </div>
  );
}
