import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { 
  FaUser, 
  FaEnvelope, 
  FaCalendarAlt, 
  FaEdit, 
  FaSave, 
  FaTimes,
  FaSignOutAlt,
  FaCog,
  FaBell,
  FaFire,
  FaChartLine,
  FaTrophy
} from "react-icons/fa";
import "../styles/profile.css";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
    bio: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    notifications: true,
    theme: "light"
  });
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    streak: 0,
    productivityScore: 0
  });

  useEffect(() => {
    loadUserStats();
  }, [user]);

  const loadUserStats = async () => {
    if (!user) return;

    try {
      const q = query(collection(db, "tasks"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const tasksData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      
      const totalTasks = tasksData.length;
      const completedTasks = tasksData.filter(task => task.status).length;
      const productivityScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      // Calculate streak
      const completedDates = tasksData
        .filter(task => task.status)
        .map(task => new Date(task.createdAt.seconds * 1000).toDateString());
      
      const uniqueDates = [...new Set(completedDates)].map(dateStr => new Date(dateStr));
      uniqueDates.sort((a, b) => b - a);

      let currentStreak = 0;
      if (uniqueDates.length > 0) {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        // Check if the most recent task was completed today or yesterday
        if (uniqueDates[0].toDateString() === today.toDateString() || uniqueDates[0].toDateString() === yesterday.toDateString()) {
          currentStreak = 1;
          for (let i = 0; i < uniqueDates.length - 1; i++) {
            const currentDate = uniqueDates[i];
            const nextDate = uniqueDates[i+1];
            
            const diffTime = currentDate - nextDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
              currentStreak++;
            } else {
              break;
            }
          }
        }
      }

      setStats({
        totalTasks,
        completedTasks,
        streak: currentStreak,
        productivityScore
      });

    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Here you would typically save to your database
    console.log("Saving profile data:", profileData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setProfileData({
      displayName: user?.displayName || "",
      email: user?.email || "",
      bio: "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      notifications: true,
      theme: "light"
    });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile</h1>
        <p>Manage your account and preferences</p>
      </div>

      <div className="profile-content">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-circle">
              <span className="avatar-text">
                {getInitials(profileData.displayName)}
              </span>
            </div>
            {!isEditing && (
              <button className="edit-button" onClick={handleEdit}>
                <FaEdit /> Edit Profile
              </button>
            )}
          </div>

          <div className="profile-info">
            {isEditing ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>Display Name</label>
                  <input
                    type="text"
                    value={profileData.displayName}
                    onChange={(e) => handleInputChange("displayName", e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="disabled"
                  />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Tell us about yourself"
                    rows="3"
                  />
                </div>
                <div className="form-actions">
                  <button className="save-button" onClick={handleSave}>
                    <FaSave /> Save Changes
                  </button>
                  <button className="cancel-button" onClick={handleCancel}>
                    <FaTimes /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-details">
                <h2>{profileData.displayName || "User"}</h2>
                <p className="email">
                  <FaEnvelope /> {profileData.email}
                </p>
                {profileData.bio && (
                  <p className="bio">{profileData.bio}</p>
                )}
                <p className="member-since">
                  <FaCalendarAlt /> Member since {user?.metadata?.creationTime ? 
                    new Date(user.metadata.creationTime).toLocaleDateString() : 
                    "Recently"
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <h3>Your Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <FaChartLine />
              </div>
              <div className="stat-content">
                <h4>{stats.totalTasks}</h4>
                <p>Total Tasks</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FaTrophy />
              </div>
              <div className="stat-content">
                <h4>{stats.completedTasks}</h4>
                <p>Completed</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FaFire />
              </div>
              <div className="stat-content">
                <h4>{stats.streak}</h4>
                <p>Day Streak</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FaChartLine />
              </div>
              <div className="stat-content">
                <h4>{stats.productivityScore}%</h4>
                <p>Productivity</p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="settings-section">
          <h3>Settings</h3>
          <div className="settings-grid">
            <div className="setting-item">
              <div className="setting-info">
                <FaBell />
                <div>
                  <h4>Notifications</h4>
                  <p>Receive task reminders and updates</p>
                </div>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={profileData.notifications}
                  onChange={(e) => handleInputChange("notifications", e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <FaCog />
                <div>
                  <h4>Theme</h4>
                  <p>Choose your preferred appearance</p>
                </div>
              </div>
              <select
                value={profileData.theme}
                onChange={(e) => handleInputChange("theme", e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="account-actions">
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile; 