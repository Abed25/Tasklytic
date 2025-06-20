import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../context/AuthProvider";
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
import Sidebar from "../component/Sidebar";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productivityScore, setProductivityScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [focusTime, setFocusTime] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Fetch tasks from Firestore
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      try {
        const querySnapshot = await getDocs(collection(db, "tasks"));
        const tasksData = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((task) => task.userId === user.uid);
        setTasks(tasksData);
        
        // Calculate productivity metrics
        const completedTasks = tasksData.filter(task => task.status).length;
        const totalTasks = tasksData.length;
        const productivityScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        setProductivityScore(productivityScore);

        // Calculate focus time (sum of all task durations)
        const totalFocusTime = tasksData.reduce((acc, task) => acc + (task.duration || 0), 0);
        setFocusTime(totalFocusTime);

        // Calculate streak (simplified version - can be enhanced)
        const today = new Date();
        const lastWeekTasks = tasksData.filter(task => {
          const taskDate = new Date(task.createdAt);
          return (today - taskDate) <= 7 * 24 * 60 * 60 * 1000;
        });
        setStreak(lastWeekTasks.length > 0 ? 1 : 0);

      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

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
      // Refresh data
      fetchTasks();
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1500);
    }
  };

  // Generate productivity trend data from actual tasks
  const generateProductivityData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }).reverse();

    return last7Days.map(day => {
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        return taskDate.toLocaleDateString('en-US', { weekday: 'short' }) === day;
      });
      const completedTasks = dayTasks.filter(task => task.status).length;
      const totalTasks = dayTasks.length;
      const score = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      return { day, score };
    });
  };

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

  const handleStatClick = (view) => {
    // Navigate to list-of-tasks with the selected view
    navigate('/list-of-tasks', { 
      state: { 
        initialView: view 
      }
    });
  };

  // Calculate stats from actual tasks
  const stats = [
    { 
      label: "Total Tasks", 
      value: tasks.length.toString(), 
      icon: <FaTasks />, 
      color: "#4CAF50",
      view: 'all'
    },
    { 
      label: "Completed", 
      value: tasks.filter(t => t.status).length.toString(), 
      icon: <FaCheckCircle />, 
      color: "#2196F3",
      view: 'complete'
    },
    { 
      label: "Pending", 
      value: tasks.filter(t => !t.status).length.toString(), 
      icon: <FaClock />, 
      color: "#FF9800",
      view: 'incomplete'
    },
  ];

  // Generate smart recommendations based on actual tasks
  const generateSmartRecommendations = () => {
    const incompleteTasks = tasks.filter(task => !task.status);
    const recommendations = [];

    if (incompleteTasks.length > 0) {
      const oldestTask = incompleteTasks.sort((a, b) => a.createdAt - b.createdAt)[0];
      recommendations.push({
        title: "Complete Pending Task",
        description: `Don't forget to complete "${oldestTask.taskName}"`,
        icon: <FaRegClock />,
        priority: "high"
      });
    }

    if (tasks.length > 0) {
      recommendations.push({
        title: "Task Review",
        description: `You have ${incompleteTasks.length} tasks pending completion`,
        icon: <FaBrain />,
        priority: "medium"
      });
    }

    if (tasks.filter(t => t.status).length > 0) {
      recommendations.push({
        title: "Progress Check",
        description: `You've completed ${tasks.filter(t => t.status).length} tasks so far`,
        icon: <FaLightbulb />,
        priority: "low"
      });
    }

    return recommendations;
  };

  const pieData = [
    { name: "Completed", value: tasks.filter(t => t.status).length },
    { name: "Pending", value: tasks.filter(t => !t.status).length },
  ];

  const COLORS = ["#4CAF50", "#FF9800"];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <Sidebar />
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
            <div 
              key={index} 
              className="stat-card" 
              style={{ borderColor: stat.color }}
              onClick={() => handleStatClick(stat.view)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleStatClick(stat.view);
                }
              }}
            >
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
                <AreaChart data={generateProductivityData()}>
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
              {generateSmartRecommendations().map((rec, index) => (
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
            {tasks.slice(0, 3).map((task, index) => (
              <div key={index} className="activity-item">
                <span className="activity-icon">{task.status ? "✔️" : "🕒"}</span>
                <span className="activity-text">
                  {task.status ? "Completed" : "Updated"}: {task.taskName}
                </span>
                <span className="activity-time">
                  {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
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
    </div>
  );
}
