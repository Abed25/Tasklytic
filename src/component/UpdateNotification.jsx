import React, { useState, useEffect } from 'react';
import { FaSync, FaTimes } from 'react-icons/fa';
import '../styles/updateNotification.css';

const UpdateNotification = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    const handleUpdate = (event) => {
      setRegistration(event.detail);
      setShowNotification(true);
    };

    window.addEventListener('swUpdate', handleUpdate);

    return () => {
      window.removeEventListener('swUpdate', handleUpdate);
    };
  }, []);

  const handleUpdate = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  const handleDismiss = () => {
    setShowNotification(false);
  };

  if (!showNotification) return null;

  return (
    <div className="update-notification">
      <div className="update-content">
        <div className="update-icon">
          <FaSync />
        </div>
        <div className="update-text">
          <h4>New Update Available!</h4>
          <p>A new version of the app is ready to install.</p>
        </div>
        <div className="update-actions">
          <button className="update-button" onClick={handleUpdate}>
            Update Now
          </button>
          <button className="dismiss-button" onClick={handleDismiss}>
            <FaTimes />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateNotification; 