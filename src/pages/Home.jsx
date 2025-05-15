import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaClipboardList, FaTasks, FaBullseye } from "react-icons/fa";
import "../styles/home.css";
import MonthlyCountdown from "../component/MonthlyCountdown";
// At the top of your Home.jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Manage Activities",
      icon: <FaClipboardList size={40} />,
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

  // Dummy data for visualization
  const barData = [
    { name: "Jan", activities: 30 },
    { name: "Feb", activities: 45 },
    { name: "Mar", activities: 60 },
    { name: "Apr", activities: 50 },
  ];

  const pieData = [
    { name: "Completed", value: 65 },
    { name: "Pending", value: 35 },
  ];

  const COLORS = ["#4caf50", "#f44336"];

  return (
    <div className="dashboard-container">
      <div style={{ position: "absolute", top: "40px", right: "20px" }}>
        <MonthlyCountdown />
      </div>
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
      <div className="dashboard-charts">
        <h3>Performance Overview</h3>
        <div className="chart-section">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="activities" fill="#4caf50" />
            </BarChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
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
