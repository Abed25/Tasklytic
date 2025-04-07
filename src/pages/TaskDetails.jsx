import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import "../styles/TaskDetails.css";

const TaskDetails = () => {
  const { taskName } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    taskName: "",
    description: "",
    duration: "",
    status: false,
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tasks"));
        const tasksData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const foundTask = tasksData.find(
          (task) => task.taskName === taskName.replace(/-/g, " ")
        );

        if (foundTask) {
          setTask(foundTask);
          setFormData(foundTask);
        } else {
          console.error("Task not found");
        }
      } catch (error) {
        console.error("Error fetching task:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskName]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    // Save logic goes here
    setTask(formData);
    setEditMode(false);
  };

  if (loading) return <p>Loading...</p>;
  if (!task) return <p>Task not found</p>;

  return (
    <div className="task-container">
      {editMode ? (
        <>
          <input
            className="input"
            name="taskName"
            value={formData.taskName}
            onChange={handleChange}
          />
          <textarea
            className="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <input
            className="input"
            name="duration"
            type="number"
            value={formData.duration}
            onChange={handleChange}
          />
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="status"
              checked={formData.status}
              onChange={handleChange}
            />
            Done
          </label>
          <div className="button-group">
            <button className="btn save-btn" onClick={handleSave}>
              Save
            </button>
            <button
              className="btn cancel-btn"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h2>{task.taskName}</h2>
          <p>Description: {task.description}</p>
          <p>Duration: {task.duration} hours</p>
          <p>Status: {task.status ? "Done" : "Undone"}</p>
          <button className="btn edit-btn" onClick={() => setEditMode(true)}>
            Edit
          </button>
        </>
      )}
    </div>
  );
};

export default TaskDetails;
