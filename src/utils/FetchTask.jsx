import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../context/AuthProvider";
import { useScreenWidth } from "../context/ScreenWidthProvider";
import { FaCheckCircle, FaRedo, FaTrash, FaSort, FaClock, FaSortAlphaDown, FaCheck, FaCalendarAlt, FaListUl } from "react-icons/fa";
import "../styles/button.css";
import "../styles/fetch.css";

const FetchTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [activeView, setActiveView] = useState(location.state?.initialView || 'all');
  const [incompleteSortOption, setIncompleteSortOption] = useState('newest');
  const [completeSortOption, setCompleteSortOption] = useState('newest');
  const screenWidth = useScreenWidth();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.initialView) {
      setActiveView(location.state.initialView);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      try {
        const querySnapshot = await getDocs(collection(db, "tasks"));
        const tasksData = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((task) => task.userId === user.uid);
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  const handleDeleteTask = async (taskId) => {
    const approval = window.confirm("Are you sure you want to delete this task?");
    if (!approval) return;

    try {
      const taskRef = doc(db, "tasks", taskId);
      await deleteDoc(taskRef);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleToggleTaskStatus = async (taskId, currentStatus) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, { status: !currentStatus });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: !currentStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const handleSort = (option, isCompleted) => {
    if (isCompleted) {
      setCompleteSortOption(option);
    } else {
      setIncompleteSortOption(option);
    }

    const filteredTasks = tasks.filter(task => task.status === isCompleted);
    let sortedTasks;

    switch (option) {
      case 'newest':
        sortedTasks = [...filteredTasks].sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'oldest':
        sortedTasks = [...filteredTasks].sort((a, b) => a.createdAt - b.createdAt);
        break;
      case 'duration':
        sortedTasks = [...filteredTasks].sort((a, b) => b.duration - a.duration);
        break;
      case 'name_asc':
        sortedTasks = [...filteredTasks].sort((a, b) => a.taskName.localeCompare(b.taskName));
        break;
      case 'name_desc':
        sortedTasks = [...filteredTasks].sort((a, b) => b.taskName.localeCompare(a.taskName));
        break;
      case 'priority':
        sortedTasks = [...filteredTasks].sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
        break;
      case 'due_date':
        sortedTasks = [...filteredTasks].sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
        break;
      default:
        sortedTasks = filteredTasks;
    }

    // Update only the tasks for the current section
    const otherTasks = tasks.filter(task => task.status !== isCompleted);
    const updatedTasks = isCompleted 
      ? [...otherTasks, ...sortedTasks]
      : [...sortedTasks, ...otherTasks];
    
    setTasks(updatedTasks);
  };

  const getViewToggleButtons = () => (
    <div className="view-toggle">
      <button 
        className={`toggle-btn ${activeView === 'all' ? 'active' : ''}`}
        onClick={() => handleViewChange('all')}
      >
        <span>
          <FaListUl />
          All Tasks
        </span>
      </button>
      <button 
        className={`toggle-btn ${activeView === 'incomplete' ? 'active' : ''}`}
        onClick={() => handleViewChange('incomplete')}
      >
        <span>
          <FaClock />
          Incomplete
        </span>
      </button>
      <button 
        className={`toggle-btn ${activeView === 'complete' ? 'active' : ''}`}
        onClick={() => handleViewChange('complete')}
      >
        <span>
          <FaCheckCircle />
          Completed
        </span>
      </button>
    </div>
  );

  const getTaskSection = (isCompleted) => {
    const filteredTasks = tasks.filter(task => task.status === isCompleted);
    const sectionClass = `task-section ${activeView !== 'all' && activeView !== (isCompleted ? 'complete' : 'incomplete') ? 'hidden' : ''} ${activeView === (isCompleted ? 'complete' : 'incomplete') ? 'dominant' : ''}`;

    return (
      <div className={sectionClass}>
        <div className="section-header">
          <h2>{isCompleted ? 'Completed Tasks' : 'Incomplete Tasks'}</h2>
          <div className="sort-control">
            <select 
              className="sort-select"
              value={isCompleted ? completeSortOption : incompleteSortOption}
              onChange={(e) => handleSort(e.target.value, isCompleted)}
            >
              <optgroup label="Time">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="duration">Duration</option>
                <option value="due_date">Due Date</option>
              </optgroup>
              <optgroup label="Name">
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
              </optgroup>
              <optgroup label="Priority">
                <option value="priority">Priority Level</option>
              </optgroup>
            </select>
          </div>
        </div>
        <div className="task-grid">
          {filteredTasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onComplete={handleToggleTaskStatus} 
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📝</div>
        <h3>No Tasks Yet</h3>
        <p>Start organizing your day by creating your first task!</p>
        <button className="create-task-btn" onClick={() => navigate('/create-task')}>
          Create Task
        </button>
      </div>
    );
  }

  const TaskCard = ({ task, onComplete, onDelete }) => {
    const navigate = useNavigate();
    
    const handleTaskClick = () => {
      // Create URL-friendly slug from task name
      const formattedTaskName = task.taskName
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-"); // Replace spaces with hyphens
      
      navigate(`/task/${formattedTaskName}`);
    };

    return (
      <div
        className={`task-card ${task.status ? "completed" : "incomplete"}`}
        onClick={handleTaskClick}
      >
        <div className="task-header">
          <h3>{task.taskName}</h3>
          <span className={`status-badge ${task.status ? "completed" : "incomplete"}`}>
            {task.status ? "Completed" : "In Progress"}
          </span>
        </div>
        
        <p className="task-description">{task.description}</p>
        
        <div className="task-meta">
          <span className="duration">
            <FaClock /> {task.duration.value} {task.duration.unit}
          </span>
          <span className="created-at">
            <FaCalendarAlt /> Created: {new Date(task.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="task-actions">
          {task.status ? (
            <button
              className="action-btn redo"
              onClick={(e) => {
                e.stopPropagation();
                onComplete(task.id, true);
              }}
            >
              <FaRedo /> Redo
            </button>
          ) : (
            <button
              className="action-btn complete"
              onClick={(e) => {
                e.stopPropagation();
                onComplete(task.id, false);
              }}
            >
              <FaCheckCircle /> Complete
            </button>
          )}
          <button
            className="action-btn delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1>Your Tasks</h1>
        <div className="task-stats">
          <div className="stat">
            <span className="stat-value">{tasks.filter(t => !t.status).length}</span>
            <span className="stat-label">Incomplete</span>
          </div>
          <div className="stat">
            <span className="stat-value">{tasks.filter(t => t.status).length}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      </div>
      {getViewToggleButtons()}
      <div className="tasks-content">
        {getTaskSection(false)}
        {getTaskSection(true)}
      </div>
    </div>
  );
};

export default FetchTasks;
