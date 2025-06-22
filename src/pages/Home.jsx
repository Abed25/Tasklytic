import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../context/AuthProvider";
import { 
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
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import Sidebar from "../component/Sidebar";
import MonthlyCountdown from "../component/MonthlyCountdown";
import DigitalClock from "../component/DigitalClock";
import BottomNav from "../component/BottomNav";
import "../styles/home.css";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stats State
  const [stats, setStats] = useState({
    completed: 0,
    pending: 0,
    total: 0,
    productivity: 0,
    streak: 0,
    focusTime: 0,
  });

  // Chart and Recommendations Data State
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const [animatedProductivity, setAnimatedProductivity] = useState(0);
  const prevProductivity = useRef(0);

  const [animatedFocus, setAnimatedFocus] = useState(0);
  const prevFocus = useRef(0);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchTasks = async () => {
      try {
        const q = query(collection(db, "tasks"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const tasksData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        }));
        setTasks(tasksData);

        // --- Process Data for Stats and Charts ---
        const completed = tasksData.filter((t) => t.status).length;
        const total = tasksData.length;
        const pending = total - completed;
        const productivity = total > 0 ? Math.round((completed / total) * 100) : 0;
        const focusTime = tasksData.reduce((acc, task) => acc + (task.duration || 0), 0);

        // Streak Calculation
        const completedDates = new Set(
          tasksData
            .filter((t) => t.status)
            .map((t) => t.createdAt?.toLocaleDateString())
        );
        let currentStreak = 0;
        let today = new Date();
        while (completedDates.has(today.toLocaleDateString())) {
            currentStreak++;
            today.setDate(today.getDate() - 1);
        }
        
        setStats({
          completed,
          pending,
          total,
          productivity,
          streak: currentStreak,
          focusTime
        });

        // Process data for Area chart
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toLocaleDateString("en-US", { weekday: "short" });
        }).reverse();

        const dataForChart = last7Days.map((day) => {
          const dayTasks = tasksData.filter(
            (t) => t.createdAt?.toLocaleDateString("en-US", { weekday: "short" }) === day && t.status
          );
          return { name: day, tasks: dayTasks.length };
        });
        setChartData(dataForChart);
        
        // Process data for Pie chart
        setPieData([
            { name: "Completed", value: completed },
            { name: "Pending", value: pending },
        ]);

        // Process Smart Recommendations
        const recs = [];
        if (pending > 0) {
            const oldestTask = tasksData.filter(t => !t.status).sort((a,b) => a.createdAt - b.createdAt)[0];
            recs.push({ title: "Tackle this next!", description: `Your oldest pending task is "${oldestTask.taskName}"`, icon: <FaRegClock/> });
        }
        if (productivity < 50 && total > 5) {
            recs.push({ title: "Boost Your Score", description: "Complete a few tasks to increase your productivity.", icon: <FaChartLine/> });
        }
        if (completed > 0) {
            recs.push({ title: "Great work!", description: `You've completed ${completed} tasks. Keep it up!`, icon: <FaLightbulb/> });
        }
        setRecommendations(recs.slice(0, 3));

      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  useEffect(() => {
    if (stats.productivity !== prevProductivity.current) {
      let start = prevProductivity.current;
      let end = stats.productivity;
      let duration = 900;
      let startTime = null;
      function animateCount(ts) {
        if (!startTime) startTime = ts;
        const progress = Math.min((ts - startTime) / duration, 1);
        setAnimatedProductivity(Math.round(start + (end - start) * progress));
        if (progress < 1) {
          requestAnimationFrame(animateCount);
        } else {
          prevProductivity.current = end;
        }
      }
      requestAnimationFrame(animateCount);
    }
  }, [stats.productivity]);
  
  useEffect(() => {
    if (stats.focusTime !== prevFocus.current) {
      let start = prevFocus.current;
      let end = stats.focusTime;
      let duration = 900;
      let startTime = null;
      function animateCount(ts) {
        if (!startTime) startTime = ts;
        const progress = Math.min((ts - startTime) / duration, 1);
        setAnimatedFocus(Math.round(start + (end - start) * progress));
        if (progress < 1) {
          requestAnimationFrame(animateCount);
        } else {
          prevFocus.current = end;
        }
      }
      requestAnimationFrame(animateCount);
    }
  }, [stats.focusTime]);
  
  // Animation Variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.6,
        type: "spring",
        stiffness: 60,
        damping: 18,
      },
    }),
  };
  
  const featureCardVariants = {
    rest: { scale: 1, boxShadow: "0 0 0 0 #00c6ff00" },
    hover: { scale: 1.08, boxShadow: "0 0 16px 2px #00c6ff88" },
    tap: { scale: 0.97 },
  };

  const PIE_COLORS = ["#10b981", "#f59e0b"];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return <div className="loading-screen"><div></div></div>; // Replace with a better loading spinner later
  }

  return (
    <div className="home-container">
      {!isMobile && <Sidebar />}
      <main className="dashboard-container">
        <header className="dashboard-header">
        <div className="welcome-section">
            <h1>Welcome Back, {user?.displayName || "User"}!</h1>
            <p>Here's your productivity snapshot for today.</p>
        </div>
          <DigitalClock />
        </header>

        <div className="dashboard-grid">
          <motion.div className="grid-card hero-widget" custom={0} variants={cardVariants} initial="hidden" animate="visible">
        <div className="productivity-score">
          <div className="score-circle">
                <div className="score-circle-content">
                  <span>{animatedProductivity}</span><small>%</small>
          </div>
        </div>
              <h3>Productivity</h3>
            </div>
            <div className="streak-info">
              <div className="streak-icon"><FaFire /></div>
              <span>{stats.streak} Day Streak</span>
            </div>
          </motion.div>
          <motion.div className="grid-card countdown-widget" custom={0.5} variants={cardVariants} initial="hidden" animate="visible">
            <MonthlyCountdown />
          </motion.div>
          <motion.div className="grid-card quick-actions" custom={1} variants={cardVariants} initial="hidden" animate="visible">
            <h3 className="widget-title">Quick Actions</h3>
      <div className="features-grid">
              {[
                { icon: <FaTasks />, text: "All Tasks", to: "/list-of-tasks", color: "#3b82f6" },
                { icon: <FaBullseye />, text: "Milestones", to: "/milestones", color: "#8b5cf6" },
                { icon: <FaChartLine />, text: "Analytics", to: "/analytics", color: "#ef4444" },
                { icon: <FaClipboardList />, text: "Add Task", to: "/add-tasks", color: "#10b981" },
                { icon: <FaBrain />, text: "Brainstorm", to: "/brainstorm", color: "#f59e0b" },
              ].map((item, idx) => (
                <motion.div
            className="feature-card"
                  key={item.text}
                  whileHover="hover"
                  whileTap="tap"
                  initial="rest"
                  animate="rest"
                  variants={featureCardVariants}
                  onClick={() => navigate(item.to)}
                >
                  <div className="feature-icon" style={{ color: item.color, background: "rgba(0,0,0,0.04)", borderRadius: "50%", padding: "0.5rem" }}>{item.icon}</div>
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div className="grid-card stats-widget" custom={2} variants={cardVariants} initial="hidden" animate="visible">
            <h3 className="widget-title">Your Statistics</h3>
            <div className="stats-grid">
              <div className="stat-card" onClick={() => navigate('/list-of-tasks')} style={{cursor: 'pointer'}}><div className="stat-icon" style={{color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)'}}><FaTasks /></div><div><h4>{stats.total}</h4><p>Total Tasks</p></div></div>
              <div className="stat-card" onClick={() => navigate('/list-of-tasks?filter=completed')} style={{cursor: 'pointer'}}><div className="stat-icon" style={{color: '#10b981', background: 'rgba(16, 185, 129, 0.1)'}}><FaCheckCircle /></div><div><h4>{stats.completed}</h4><p>Completed</p></div></div>
              <div className="stat-card" onClick={() => navigate('/list-of-tasks?filter=pending')} style={{cursor: 'pointer'}}><div className="stat-icon" style={{color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)'}}><FaClock /></div><div><h4>{stats.pending}</h4><p>Pending</p></div></div>
              <div className="stat-card" onClick={() => navigate('/list-of-tasks?filter=focus')} style={{cursor: 'pointer'}}><div className="stat-icon" style={{color: '#6366f1', background: 'rgba(99, 102, 241, 0.1)'}}><FaRegClock /></div><div><h4>{animatedFocus}</h4><p>Focus (min)</p>
                <div className="focus-progress-bar"><div className="focus-progress-fill" style={{width: `${Math.min(animatedFocus / 120, 1) * 100}%`}}></div></div>
              </div></div>
          </div>
          </motion.div>
          <motion.div className="grid-card charts-widget" custom={3} variants={cardVariants} initial="hidden" animate="visible">
            <h3 className="widget-title">Productivity Trend</h3>
            <div style={{height: '200px'}}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(5px)', border: 'none', borderRadius: '1rem' }} />
                  <Area type="monotone" dataKey="tasks" stroke="#4DD0E1" strokeWidth={2} fillOpacity={0.4} fill="url(#colorUv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          </motion.div>
          <motion.div className="grid-card pie-chart-widget" custom={4} variants={cardVariants} initial="hidden" animate="visible">
            <h3 className="widget-title">Task Breakdown</h3>
            <div style={{height: '200px'}}>
              <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={50} labelLine={false}>
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          </motion.div>
          <motion.div className="grid-card recommendations-widget" custom={5} variants={cardVariants} initial="hidden" animate="visible">
            <h3 className="widget-title">Smart Suggestions</h3>
          <div className="recommendations-list">
              {recommendations.map((rec, i) => (
                <div className="recommendation-card" key={i}>
                  <div className="recommendation-icon">{rec.icon}</div>
                  <div>
                  <h4>{rec.title}</h4>
                  <p>{rec.description}</p>
                </div>
              </div>
            ))}
          </div>
          </motion.div>
          <motion.div className="grid-card recent-activity-widget" custom={6} variants={cardVariants} initial="hidden" animate="visible">
            <h3 className="widget-title">Recent Activity</h3>
        <div className="activity-list">
              {tasks.slice(0, 3).map(task => (
                <div className="activity-item" key={task.id}>
                  <span>{task.status ? "✅" : "🕒"}</span>
                  <p>{task.taskName}</p>
                  <small>{task.createdAt?.toLocaleDateString()}</small>
            </div>
          ))}
        </div>
          </motion.div>
          <motion.div className="grid-card upcoming-deadlines-widget" custom={7} variants={cardVariants} initial="hidden" animate="visible">
            <h3 className="widget-title">Upcoming Deadlines</h3>
            <div className="deadlines-list">
              {tasks
                .filter(task => task.dueDate && new Date(task.dueDate) > new Date())
                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                .slice(0, 3)
                .map(task => (
                  <div className="deadline-item" key={task.id}>
                    <div className="deadline-info">
                      <h4>{task.taskName}</h4>
                      <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
      </div>
                    <div className={`priority-indicator ${task.priority}`}></div>
      </div>
                ))}
            </div>
          </motion.div>
        </div>
      </main>
      {isMobile && <BottomNav />}
    </div>
  );
}
