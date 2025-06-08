import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  FaPlus, 
  FaClipboardList, 
  FaTasks, 
  FaBullseye, 
  FaChartLine, 
  FaCheckCircle, 
  FaClock,
  FaFire,
  FaLightbulb,
  FaBrain,
  FaRegClock,
  FaHome,
  FaCalendarAlt,
  FaUser,
  FaCog
} from "react-icons/fa";
import "../styles/home.css";
import MonthlyCountdown from "../component/MonthlyCountdown";
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
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [productivityScore, setProductivityScore] = useState(85);
  const [streak, setStreak] = useState(7);
  const [focusTime, setFocusTime] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Mobile navigation items
  const navItems = [
    { icon: <FaHome />, label: "Home", path: "/" },
    { icon: <FaCalendarAlt />, label: "Calendar", path: "/calendar" },
    { icon: <FaUser />, label: "Profile", path: "/profile" },
    { icon: <FaCog />, label: "Settings", path: "/settings" }
  ];

  // Handle pull to refresh
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
    if (touchStart - touchEnd > 100) {
      setIsRefreshing(true);
      // Simulate refresh
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1500);
    }
  };

  // Simulated data for productivity trends
  const productivityData = [
    { day: "Mon", score: 75 },
    { day: "Tue", score: 82 },
    { day: "Wed", score: 88 },
    { day: "Thu", score: 85 },
    { day: "Fri", score: 90 },
    { day: "Sat", score: 78 },
    { day: "Sun", score: 85 },
  ];

  const features = [
    {
      title: "Task Management",
      icon: <FaClipboardList size={24} />,
      onClick: () => navigate("/list-of-tasks"),
      tooltip: "View and manage your tasks",
      color: "#4CAF50"
    },
    {
      title: "Milestones",
      icon: <FaBullseye size={24} />,
      onClick: () => navigate("/milestones"),
      tooltip: "Track your achievements",
      color: "#2196F3"
    },
    {
      title: "Analytics",
      icon: <FaChartLine size={24} />,
      onClick: () => navigate("/analytics"),
      tooltip: "View detailed analytics",
      color: "#9C27B0"
    },
  ];

  const stats = [
    { label: "Total Tasks", value: "14", icon: <FaTasks />, color: "#4CAF50" },
    { label: "Completed", value: "8", icon: <FaCheckCircle />, color: "#2196F3" },
    { label: "Pending", value: "6", icon: <FaClock />, color: "#FF9800" },
  ];

  const smartRecommendations = [
    {
      title: "Morning Routine",
      description: "Complete your morning tasks before 10 AM for better productivity",
      icon: <FaRegClock />,
      priority: "high"
    },
    {
      title: "Focus Session",
      description: "Schedule a 25-minute focus session for your pending tasks",
      icon: <FaBrain />,
      priority: "medium"
    },
    {
      title: "Weekly Review",
      description: "Review your weekly progress and plan for next week",
      icon: <FaLightbulb />,
      priority: "low"
    }
  ];

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

  const COLORS = ["#4CAF50", "#FF9800"];

  return (
    <div 
      className="dashboard-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <div className="floating-shape"></div>
      <div className="floating-shape"></div>
      {isRefreshing && (
        <div className="pull-to-refresh active">
          Refreshing...
        </div>
      )}

      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome Back!</h1>
          <p>Track your progress and stay productive</p>
        </div>
        <MonthlyCountdown />
      </div>

      <div className="productivity-overview">
        <div className="productivity-score">
          <div className="score-circle">
            <span>{productivityScore}</span>
            <small>Productivity Score</small>
          </div>
        </div>
        <div className="streak-info">
          <FaFire className="streak-icon" />
          <span>{streak} Day Streak</span>
        </div>
        <div className="focus-time">
          <FaRegClock className="focus-icon" />
          <span>{focusTime} min Focus Time</span>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderColor: stat.color }}>
            <div className="stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div
            key={index}
            className="feature-card"
            onClick={feature.onClick}
            title={feature.tooltip}
            style={{ borderColor: feature.color }}
          >
            <div className="feature-icon" style={{ color: feature.color }}>
              {feature.icon}
            </div>
            <h3>{feature.title}</h3>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="charts-section">
          <div className="chart-card">
            <h3>Productivity Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={productivityData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#4CAF50" fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Task Completion</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  innerRadius={60}
                  fill="#8884d8"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="smart-recommendations">
          <h3>Smart Recommendations</h3>
          <div className="recommendations-list">
            {smartRecommendations.map((rec, index) => (
              <div key={index} className={`recommendation-card ${rec.priority}`}>
                <div className="recommendation-icon">
                  {rec.icon}
                </div>
                <div className="recommendation-content">
                  <h4>{rec.title}</h4>
                  <p>{rec.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-icon">✔️</span>
            <span className="activity-text">Submitted Weekly Report</span>
            <span className="activity-time">2h ago</span>
          </div>
          <div className="activity-item">
            <span className="activity-icon">🕒</span>
            <span className="activity-text">Updated Task: Market Research</span>
            <span className="activity-time">5h ago</span>
          </div>
          <div className="activity-item">
            <span className="activity-icon">🎯</span>
            <span className="activity-text">Achieved Milestone: 10 Tasks Done</span>
            <span className="activity-time">1d ago</span>
          </div>
        </div>
      </div>

      <div className="motivation-quote">
        <blockquote>
          "Productivity is never an accident. It is always the result of a commitment to excellence."
        </blockquote>
      </div>

      {/* Mobile Navigation */}
      <nav className="mobile-nav">
        {navItems.map((item, index) => (
          <a
            key={index}
            href={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              navigate(item.path);
            }}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
