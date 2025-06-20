import React, { useState } from 'react';
import { FaUserShield, FaPalette, FaBell, FaFileExport, FaTrash, FaSave } from 'react-icons/fa';
import '../styles/settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: {
      taskReminders: true,
      weeklySummary: false,
      appUpdates: true,
    },
    email: 'user@example.com',
    password: '',
  });

  const handleInputChange = (category, key, value) => {
    if (category) {
      setSettings(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [key]: value,
        },
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  const handleSaveChanges = () => {
    // Here you would typically save to your database
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
      // Handle account deletion logic here
      console.log('Account deletion initiated.');
      alert('Account deleted.');
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Customize your experience</p>
      </div>

      <div className="settings-content">
        {/* Account Section */}
        <div className="settings-section">
          <h2 className="section-title">
            <FaUserShield /> Account
          </h2>
          <div className="setting-item">
            <label>Email Address</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => handleInputChange(null, 'email', e.target.value)}
            />
          </div>
          <div className="setting-item">
            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={settings.password}
              onChange={(e) => handleInputChange(null, 'password', e.target.value)}
            />
          </div>
        </div>

        {/* Appearance Section */}
        <div className="settings-section">
          <h2 className="section-title">
            <FaPalette /> Appearance
          </h2>
          <div className="setting-item">
            <label>Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => handleInputChange(null, 'theme', e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">System Default</option>
            </select>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="settings-section">
          <h2 className="section-title">
            <FaBell /> Notifications
          </h2>
          <div className="setting-item">
            <label>Task Reminders</label>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.notifications.taskReminders}
                onChange={(e) => handleInputChange('notifications', 'taskReminders', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <label>Weekly Summary</label>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.notifications.weeklySummary}
                onChange={(e) => handleInputChange('notifications', 'weeklySummary', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <label>App Updates</label>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.notifications.appUpdates}
                onChange={(e) => handleInputChange('notifications', 'appUpdates', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* Data Management Section */}
        <div className="settings-section">
          <h2 className="section-title">
            <FaFileExport /> Data Management
          </h2>
          <div className="setting-item">
            <button className="data-button export-button">
              Export My Data
            </button>
            <button className="data-button delete-button" onClick={handleDeleteAccount}>
              Delete My Account
            </button>
          </div>
        </div>

        <div className="settings-actions">
          <button className="save-button" onClick={handleSaveChanges}>
            <FaSave /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings; 