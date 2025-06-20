import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaUser,
  FaCog,
  FaChevronLeft,
  FaChevronRight,
  FaSignOutAlt,
  FaSun,
  FaMoon,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthProvider';
import { useTheme } from '../context/ThemeContext';
import '../styles/sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navItems = [
    { to: '/home', icon: <FaTachometerAlt />, text: 'Dashboard' },
    { to: '/calendar', icon: <FaCalendarAlt />, text: 'Calendar' },
    { to: '/profile', icon: <FaUser />, text: 'Profile' },
    { to: '/settings', icon: <FaCog />, text: 'Settings' },
  ];

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h1 className="sidebar-logo">{isCollapsed ? 'T' : 'Tasklytic'}</h1>
        <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.text}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="theme-switcher">
            <span className="nav-icon">{theme === 'light' ? <FaSun /> : <FaMoon />}</span>
            <span className="nav-text">
                <div className="switch-container">
                    <span>{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
                    <label className="switch">
                        <input type="checkbox" onChange={toggleTheme} checked={theme === 'dark'} />
                        <span className="slider round"></span>
                    </label>
                </div>
            </span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <span className="nav-icon">
            <FaSignOutAlt />
          </span>
          <span className="nav-text">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 