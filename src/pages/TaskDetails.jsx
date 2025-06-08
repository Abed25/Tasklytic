import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../context/AuthProvider";
import { FaClock, FaCalendarAlt, FaFlag, FaCheckCircle, FaEdit, FaTrash, FaArrowLeft, FaCheck, FaTimes } from "react-icons/fa";
import "../styles/TaskDetails.css";
import TaskScheduler from '../components/TaskScheduler';

const TaskDetails = () => {
  const { taskName } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      if (!user) return;

      try {
        const tasksRef = collection(db, "tasks");
        const q = query(tasksRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        
        // Convert URL slug back to original task name format
        const decodedTaskName = taskName.replace(/-/g, " ");
        
        const foundTask = querySnapshot.docs.find(
          (doc) => doc.data().taskName.toLowerCase() === decodedTaskName.toLowerCase()
        );

        if (foundTask) {
          const taskData = { id: foundTask.id, ...foundTask.data() };
          setTask(taskData);
          setEditedTask(taskData);
        } else {
          setError("Task not found");
        }
      } catch (error) {
        console.error("Error fetching task:", error);
        setError("Error fetching task details");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskName, user]);

  const handleStatusToggle = async () => {
    if (!task) return;

    try {
      const taskRef = doc(db, "tasks", task.id);
      await updateDoc(taskRef, {
        status: !task.status,
      });

      setTask((prev) => ({ ...prev, status: !prev.status }));
      setEditedTask((prev) => ({ ...prev, status: !prev.status }));
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleDelete = async () => {
    if (!task) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmDelete) return;

    try {
      const taskRef = doc(db, "tasks", task.id);
      await deleteDoc(taskRef);
      navigate("/list-of-tasks");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleSave = async () => {
    if (!editedTask) return;

    try {
      const taskRef = doc(db, "tasks", editedTask.id);
      await updateDoc(taskRef, {
        taskName: editedTask.taskName,
        description: editedTask.description,
        duration: editedTask.duration,
        priority: editedTask.priority,
        dueDate: editedTask.dueDate,
      });

      setTask(editedTask);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleScheduleUpdate = async (scheduleData) => {
    try {
      await updateDoc(doc(db, 'tasks', task.id), {
        schedule: scheduleData
      });
      setTask(prev => ({ ...prev, schedule: scheduleData }));
    } catch (err) {
      console.error('Error updating task schedule:', err);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading task details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>{error}</h2>
        <button onClick={() => navigate("/list-of-tasks")} className="btn">
          Back to Tasks
        </button>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="error-container">
        <h2>Task not found</h2>
        <button onClick={() => navigate("/list-of-tasks")} className="btn">
          Back to Tasks
        </button>
      </div>
    );
  }

  return (
    <div className="task-details-container">
      <div className="task-details-header">
        <button onClick={() => navigate("/list-of-tasks")} className="back-button">
          <FaArrowLeft /> Back to Tasks
        </button>
        <div className="task-actions">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="action-button edit"
          >
            <FaEdit /> {isEditing ? "Cancel" : "Edit"}
          </button>
          <button onClick={handleDelete} className="action-button delete">
            <FaTrash /> Delete
          </button>
        </div>
      </div>

      <div className="task-details-content">
        <div className="task-main-info">
          {isEditing ? (
            <input
              type="text"
              value={editedTask.taskName}
              onChange={(e) =>
                setEditedTask({ ...editedTask, taskName: e.target.value })
              }
              className="edit-input"
            />
          ) : (
            <h1>{task.taskName}</h1>
          )}
          <div className="task-status">
            <button
              onClick={handleStatusToggle}
              className={`status-button ${task.status ? "completed" : "incomplete"}`}
            >
              <FaCheckCircle />
              {task.status ? "Completed" : "In Progress"}
            </button>
          </div>
        </div>

        <div className="task-meta-grid">
          <div className="meta-item">
            <FaClock />
            <div>
              <label>Duration</label>
              {isEditing ? (
                <div className="duration-edit">
                  <input
                    type="number"
                    value={editedTask.duration.value}
                    onChange={(e) =>
                      setEditedTask({
                        ...editedTask,
                        duration: { ...editedTask.duration, value: e.target.value },
                      })
                    }
                    className="edit-input"
                    min="1"
                  />
                  <select
                    value={editedTask.duration.unit}
                    onChange={(e) =>
                      setEditedTask({
                        ...editedTask,
                        duration: { ...editedTask.duration, unit: e.target.value },
                      })
                    }
                    className="edit-input"
                  >
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>
              ) : (
                <p>{task.duration.value} {task.duration.unit}</p>
              )}
            </div>
          </div>

          <div className="meta-item">
            <FaCalendarAlt />
            <div>
              <label>Due Date</label>
              {isEditing ? (
                <input
                  type="date"
                  value={editedTask.dueDate ? new Date(editedTask.dueDate).toISOString().split('T')[0] : ''}
                  onChange={(e) =>
                    setEditedTask({
                      ...editedTask,
                      dueDate: e.target.value ? new Date(e.target.value).toISOString() : null,
                    })
                  }
                  className="edit-input"
                />
              ) : (
                <p>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</p>
              )}
            </div>
          </div>

          <div className="meta-item">
            <FaFlag />
            <div>
              <label>Priority</label>
              {isEditing ? (
                <select
                  value={editedTask.priority}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, priority: e.target.value })
                  }
                  className="edit-input"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              ) : (
                <p className={`priority-${task.priority}`}>{task.priority}</p>
              )}
            </div>
          </div>
        </div>

        <div className="task-description-section">
          <h3>Description</h3>
          {isEditing ? (
            <textarea
              value={editedTask.description}
              onChange={(e) =>
                setEditedTask({ ...editedTask, description: e.target.value })
              }
              className="edit-textarea"
            />
          ) : (
            <p>{task.description}</p>
          )}
        </div>

        {isEditing && (
          <div className="edit-actions">
            <button onClick={handleSave} className="save-button">
              Save Changes
            </button>
          </div>
        )}

        <TaskScheduler
          task={task}
          onScheduleUpdate={handleScheduleUpdate}
        />
      </div>
    </div>
  );
};

export default TaskDetails;
