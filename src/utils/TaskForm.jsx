import React, { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthProvider";
import { FaClock, FaCalendarAlt, FaFlag, FaCheckCircle } from "react-icons/fa";
import "../styles/TaskDetails.css";

const TaskForm = () => {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [durationUnit, setDurationUnit] = useState("hours");
  const [status, setStatus] = useState(false);
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to add tasks.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        taskName,
        description,
        duration: {
          value: parseInt(duration, 10),
          unit: durationUnit
        },
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        userId: user.uid,
        createdAt: new Date(),
      });

      console.log("Document written with ID: ", docRef.id);
      alert("✅ Task added successfully!");

      // Reset form
      setTaskName("");
      setDescription("");
      setDuration("");
      setDurationUnit("hours");
      setStatus(false);
      setPriority("medium");
      setDueDate("");
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("❌ Failed to add task.");
    }
  };

  return (
    <div className="task-container">
      <h2 className="form-title">Add an Activity</h2>
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label>Task Name</label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
            className="input"
            placeholder="e.g. Morning Meeting"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="textarea"
            placeholder="Briefly describe the task..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              <FaClock /> Duration
            </label>
            <div className="duration-input-group">
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
                className="input duration-input"
                placeholder="e.g. 2"
                min="1"
              />
              <select
                value={durationUnit}
                onChange={(e) => setDurationUnit(e.target.value)}
                className="input duration-unit"
              >
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>
              <FaCalendarAlt /> Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              <FaFlag /> Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="input"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              <FaCheckCircle /> Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value === "true")}
              className="input"
            >
              <option value={false}>In Progress</option>
              <option value={true}>Completed</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn save-btn">
          Add Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
