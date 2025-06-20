import React from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaCalendarAlt, FaUser, FaPlusCircle } from "react-icons/fa";
import "../styles/bottomnav.css";

const navItems = [
  { to: "/home", icon: <FaTachometerAlt />, label: "Dashboard" },
  { to: "/calendar", icon: <FaCalendarAlt />, label: "Calendar" },
  { to: "/add-tasks", icon: <FaPlusCircle />, label: "Add" },
  { to: "/profile", icon: <FaUser />, label: "Profile" },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            isActive ? "bottom-nav-item active" : "bottom-nav-item"
          }
        >
          <span className="bottom-nav-icon">{item.icon}</span>
          <span className="bottom-nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
} 