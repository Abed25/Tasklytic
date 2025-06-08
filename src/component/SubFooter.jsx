import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaPlus, FaList, FaCheckCircle, FaClock } from "react-icons/fa";
import "../styles/footer.css";

export default function SubFooter() {
  const navigate = useNavigate();
  const location = useLocation();
  const isTaskList = location.pathname === "/list-of-tasks";

  return (
    <div className="subfooter">
      <div className="footer-section">
        <h4>Task Management</h4>
        <div className="quick-actions">
          <button onClick={() => navigate("/add-tasks")} className="footer-btn">
            <FaPlus />
            <span>New Task</span>
          </button>
          <button onClick={() => navigate("/list-of-tasks")} className="footer-btn">
            <FaList />
            <span>View All</span>
          </button>
        </div>
      </div>

      {isTaskList && (
        <div className="footer-section">
          <h4>Task Views</h4>
          <div className="view-actions">
            <button className="view-btn">
              <FaClock />
              <span>Incomplete</span>
            </button>
            <button className="view-btn">
              <FaCheckCircle />
              <span>Completed</span>
            </button>
          </div>
        </div>
      )}

      <div className="footer-section">
        <h4>About</h4>
        <p>Efficiently manage your daily tasks with our intuitive task management system.</p>
        <p>Stay organized and boost your productivity with our easy-to-use features.</p>
      </div>
    </div>
  );
}
