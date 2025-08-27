import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { FaHome, FaList, FaPlus, FaCalendarAlt, FaBrain, FaUser, FaCog, FaArrowLeft } from "react-icons/fa";
import "../styles/header.css";
import "../styles/button.css";
import "../styles/subheader.css";

const Subheader = () => {
  const location = useLocation();
  const params = useParams();
  const path = location.pathname;

  const isActive = (to) => {
    if (to.includes(":")) return false; // skip param routes in exact match
    if (to === "/milestones/:date") return path.startsWith("/milestones/");
    return path === to;
  };

  const backToTasks = { to: "/list-of-tasks", text: "Back to Tasks", icon: <FaArrowLeft /> };

  const navForRoute = () => {
    if (path === "/list-of-tasks") {
      return [
        { to: "/add-tasks", text: "New Task", icon: <FaPlus /> },
        { to: "/calendar", text: "Calendar", icon: <FaCalendarAlt /> },
        { to: "/brainstorm", text: "Brainstorm", icon: <FaBrain /> },
      ];
    }
    if (path === "/add-tasks") {
      return [backToTasks, { to: "/calendar", text: "Calendar", icon: <FaCalendarAlt /> }];
    }
    if (path === "/calendar") {
      return [backToTasks, { to: "/add-tasks", text: "New Task", icon: <FaPlus /> }];
    }
    if (path === "/milestones") {
      return [
        { to: "/calendar", text: "Calendar", icon: <FaCalendarAlt /> },
      ];
    }
    if (path.startsWith("/milestones/") && params?.date) {
      return [
        { to: "/milestones", text: "All Milestones", icon: <FaList /> },
        { to: "/calendar", text: "Calendar", icon: <FaCalendarAlt /> },
      ];
    }
    if (path === "/brainstorm") {
      return [
        { to: "/list-of-tasks", text: "Tasks", icon: <FaList /> },
        { to: "/add-tasks", text: "New Task", icon: <FaPlus /> },
      ];
    }
    if (path === "/profile") {
      return [
        { to: "/settings", text: "Settings", icon: <FaCog /> },
      ];
    }
    if (path === "/settings") {
      return [
        { to: "/profile", text: "Profile", icon: <FaUser /> },
      ];
    }
    if (path.startsWith("/task/")) {
      return [backToTasks, { to: "/add-tasks", text: "New Task", icon: <FaPlus /> }];
    }
    // Fallback for any other protected route
    return [
      { to: "/list-of-tasks", text: "Tasks", icon: <FaList /> },
    ];
  };

  let navItems = navForRoute();
  // Ensure Dashboard is always present (except when already on /home)
  const hasDashboard = navItems.some((i) => i.to === "/home");
  if (!hasDashboard) {
    const dashboardItem = { to: "/home", text: "Dashboard", icon: <FaHome /> };
    if (path === "/home") {
      // On /home, still include for consistency (will render as active)
      navItems = [dashboardItem, ...navItems];
    } else {
      navItems = [dashboardItem, ...navItems];
    }
  }

  return (
    <div className="subheader glass-subheader">
      <div className="nav-section">
        {navItems.map((item) => (
          <Link
            key={item.to + item.text}
            to={item.to}
            className={`nav-btn ${isActive(item.to) ? "active" : ""}`}
            aria-current={isActive(item.to) ? "page" : undefined}
          >
            {item.icon} {item.text}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Subheader;
