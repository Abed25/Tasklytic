import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaRocket, FaChartLine, FaBell, FaStar, FaUsers, FaShieldAlt, FaSync } from "react-icons/fa";
import { motion, useReducedMotion } from "framer-motion";
import image from "../assets/todo-app-preview.webp";
import "../styles/landing.css";
import "../styles/button.css";

export default function Landing() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const handleLogout = async () => {
    await signOut(auth);
  };

  const track = (action, params = {}) => {
    try {
      if (window.gtag) window.gtag("event", action, params);
      else if (window.dataLayer) window.dataLayer.push({ event: action, ...params });
    } catch (e) {}
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

  const heroInitial = prefersReducedMotion ? {} : { opacity: 0, y: 20 };
  const heroAnimate = prefersReducedMotion ? {} : { opacity: 1, y: 0 };
  const heroTransitionFast = prefersReducedMotion ? { duration: 0 } : { duration: 0.8 };

  return (
    <div className="landing">
      <div className="landing-content">
        <div className="hero-section">
          {/* Decorative blobs */}
          <div className="blob cyan b1" />
          <div className="blob purple b2" />
          <div className="blob pink b3" />

          <div className="hero-text">
            <motion.h1
              initial={heroInitial}
              animate={heroAnimate}
              transition={heroTransitionFast}
            >
              Transform Your Productivity
            </motion.h1>
            <motion.p
              className="hero-subtitle"
              initial={heroInitial}
              animate={heroAnimate}
              transition={{ ...heroTransitionFast, delay: 0.2 }}
            >
              Experience the future of task management with our intelligent To-Do app.
              Stay organized, focused, and achieve more every day.
            </motion.p>
            <motion.div
              className="cta-buttons"
              initial={heroInitial}
              animate={heroAnimate}
              transition={{ ...heroTransitionFast, delay: 0.4 }}
            >
              <button
                onClick={() => { track("cta_primary_click", { location: "hero" }); navigate(user ? "/home" : "/signup"); }}
                className="cta-button primary neon"
                aria-label={user ? "Go to Dashboard" : "Get Started Free"}
              >
                {user ? "Go to Dashboard" : "Get Started Free"}
              </button>
              {!user && (
                <button
                  onClick={() => { track("cta_secondary_click", { location: "hero" }); navigate("/login"); }}
                  className="cta-button secondary"
                  aria-label="Sign In"
                >
                  Sign In
                </button>
              )}
            </motion.div>
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="stat-item glass glow"
                  initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.8 }}
                  whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.div
            className="hero-image hero-visual gradient-border glow"
            initial={prefersReducedMotion ? {} : { opacity: 0, x: 50 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
            transition={heroTransitionFast}
          >
            <div className="frame glass">
              <picture>
                <source srcSet={image} type="image/webp" />
                <img src={image} alt="Tasklytic app preview" className="app-preview" loading="lazy" decoding="async" />
              </picture>
            </div>
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
            initial={heroInitial}
            whileInView={heroAnimate}
            transition={heroTransitionFast}
            viewport={{ once: true }}
          >
            Why Choose Our App?
          </motion.h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card glass glow"
                initial={heroInitial}
                whileInView={heroAnimate}
                transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: index * 0.1 }}
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
            {[...Array(2)].map((_, index) => (
              <motion.div
                key={index}
                className="testimonial-card glass glow"
                initial={heroInitial}
                whileInView={heroAnimate}
                transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="quote-icon">"</div>
                <p className="quote">{index === 0 ? "This app has completely transformed how I manage my tasks. The interface is beautiful and the features are exactly what I needed." : "The productivity insights have helped me optimize my workflow and achieve more in less time. Highly recommended!"}</p>
                <div className="testimonial-author">
                  <div className="author-info">
                    <strong>{index === 0 ? "Sarah Johnson" : "Michael Chen"}</strong>
                    <span>{index === 0 ? "Product Manager" : "Software Engineer"}</span>
                    <span className="company">{index === 0 ? "TechCorp" : "InnovateX"}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="landing-footer"
          initial={heroInitial}
          whileInView={heroAnimate}
          transition={heroTransitionFast}
          viewport={{ once: true }}
        >
          {user ? (
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          ) : (
            <div className="footer-cta glass glow">
              <h3>Ready to boost your productivity?</h3>
              <p>Join thousands of users who have transformed their workflow</p>
              <button
                onClick={() => { track("cta_primary_click", { location: "footer" }); navigate("/signup"); }}
                className="cta-button primary neon"
                aria-label="Create Free Account"
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
