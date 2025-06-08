import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaList, FaPlus } from "react-icons/fa";
import "../styles/header.css";
import "../styles/button.css";

const Subheader = () => {
  const location = useLocation();
  const isTaskPage = location.pathname === "/list-of-tasks";
  const isHomePage = location.pathname === "/home";
  const isAddTaskPage = location.pathname === "/add-tasks";

  return (
    <div className="subheader">
      <div className="nav-section">
        <Link 
          to="/home" 
          className={`nav-btn ${isHomePage ? 'active' : ''}`} 
          style={{ backgroundColor: isHomePage ? "rgba(128, 222, 234, 1)" : "rgba(128, 222, 234, 0.8)" }}
        >
          <FaHome /> Home
        </Link>
        <Link 
          to="/list-of-tasks" 
          className={`nav-btn ${isTaskPage ? 'active' : ''}`} 
          style={{ backgroundColor: isTaskPage ? "rgba(128, 222, 234, 1)" : "rgba(128, 222, 234, 0.8)" }}
        >
          <FaList /> Tasks
        </Link>
        <Link 
          to="/add-tasks" 
          className={`nav-btn ${isAddTaskPage ? 'active' : ''}`} 
          style={{ backgroundColor: isAddTaskPage ? "rgba(128, 222, 234, 1)" : "rgba(128, 222, 234, 0.8)" }}
        >
          <FaPlus /> New Task
        </Link>
      </div>
    </div>
  );
};

export default Subheader;
