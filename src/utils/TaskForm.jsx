import React, { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthProvider";
import "../styles/TaskDetails.css";

const TaskForm = () => {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [status, setStatus] = useState(false);
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
        duration: parseInt(duration, 10),
        status,
        userId: user.uid,
        createdAt: new Date(),
      });

      console.log("Document written with ID: ", docRef.id);
      alert("✅ Task added successfully!");

      setTaskName("");
      setDescription("");
      setDuration("");
      setStatus(false);
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

        <div className="form-group">
          <label>Duration (in hours)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            className="input"
            placeholder="e.g. 2"
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value === "true")}
            className="input"
          >
            <option value={false}>Undone</option>
            <option value={true}>Done</option>
          </select>
        </div>

        <button type="submit" className="btn save-btn">
          Add Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
