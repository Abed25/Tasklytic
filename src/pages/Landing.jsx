import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaRocket, FaChartLine, FaBell, FaStar, FaUsers, FaShieldAlt, FaSync } from "react-icons/fa";
import { motion } from "framer-motion";
import image from "../assets/todo-app-preview.webp";
import "../styles/landing.css";
import "../styles/button.css";

export default function Landing() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
  };

  const features = [
    {
      icon: <FaCheckCircle />,
      title: "Smart Task Management",
      description: "AI-powered task organization that adapts to your workflow",
      color: "#4CAF50"
    },
    {
      icon: <FaRocket />,
      title: "Boost Productivity",
      description: "Achieve 40% more with our intelligent productivity tools",
      color: "#2196F3"
    },
    {
      icon: <FaChartLine />,
      title: "Progress Analytics",
      description: "Real-time insights and performance tracking",
      color: "#FF9800"
    },
    {
      icon: <FaBell />,
      title: "Smart Reminders",
      description: "Context-aware notifications that never miss a beat",
      color: "#9C27B0"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users", icon: <FaUsers /> },
    { number: "98%", label: "Satisfaction", icon: <FaStar /> },
    { number: "24/7", label: "Support", icon: <FaShieldAlt /> },
    { number: "99.9%", label: "Uptime", icon: <FaSync /> }
  ];

  const testimonials = [
    {
      quote: "This app has completely transformed how I manage my tasks. The interface is beautiful and the features are exactly what I needed.",
      author: "Sarah Johnson",
      role: "Product Manager",
      company: "TechCorp"
    },
    {
      quote: "The productivity insights have helped me optimize my workflow and achieve more in less time. Highly recommended!",
      author: "Michael Chen",
      role: "Software Engineer",
      company: "InnovateX"
    }
  ];

  return (
    <div className="landing">
      <div className="landing-content">
        <div className="hero-section">
          <div className="hero-text">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Transform Your Productivity
            </motion.h1>
            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Experience the future of task management with our intelligent To-Do app.
              Stay organized, focused, and achieve more every day.
            </motion.p>
            <motion.div
              className="cta-buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <button
                onClick={() => navigate(user ? "/home" : "/signup")}
                className="cta-button primary"
              >
                {user ? "Go to Dashboard" : "Get Started Free"}
              </button>
              {!user && (
                <button
                  onClick={() => navigate("/login")}
                  className="cta-button secondary"
                >
                  Sign In
                </button>
              )}
            </motion.div>
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="stat-item"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.div
            className="hero-image"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <img src={image} alt="App Preview" className="app-preview" />
            <div className="floating-badge">
              <span>✨ Trusted by 10,000+ users</span>
            </div>
            <div className="floating-features">
              <div className="feature-bubble">
                <FaCheckCircle /> Smart Tasks
              </div>
              <div className="feature-bubble">
                <FaChartLine /> Analytics
              </div>
              <div className="feature-bubble">
                <FaBell /> Reminders
              </div>
            </div>
          </motion.div>
        </div>

        <div className="features-section">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Why Choose Our App?
          </motion.h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                style={{ "--feature-color": feature.color }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="testimonial-section">
          <div className="testimonial-grid">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="testimonial-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="quote-icon">"</div>
                <p className="quote">{testimonial.quote}</p>
                <div className="testimonial-author">
                  <div className="author-info">
                    <strong>{testimonial.author}</strong>
                    <span>{testimonial.role}</span>
                    <span className="company">{testimonial.company}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="landing-footer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {user ? (
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          ) : (
            <div className="footer-cta">
              <h3>Ready to boost your productivity?</h3>
              <p>Join thousands of users who have transformed their workflow</p>
              <button
                onClick={() => navigate("/signup")}
                className="cta-button primary"
              >
                Create Free Account
              </button>
              <div className="trust-badges">
                <span>🔒 Secure & Private</span>
                <span>⚡ Fast & Reliable</span>
                <span>💎 Premium Features</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
