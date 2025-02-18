import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../context/AuthProvider";
import { useScreenWidth } from "../context/ScreenWidthProvider";
import "../styles/button.css";
import "../styles/fetch.css";

const FetchTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editableTask, setEditableTask] = useState(null); // Track the task being edited
  const [newDescription, setNewDescription] = useState(""); // Hold the new description
  const [newStatus, setNewStatus] = useState(false); // Hold the new status

  //Hold the size of the screen from a context variable
  const screenWidth = useScreenWidth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return; // Ensure user is logged in
      try {
        const querySnapshot = await getDocs(collection(db, "tasks"));
        const tasksData = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((task) => task.userId === user.uid); // Only fetch tasks for the logged-in user

        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]); // Re-run when user changes

  const handleEditClick = (task) => {
    setEditableTask(task); // Set the task to edit
    setNewDescription(task.description);
    setNewStatus(task.status);
  };
  const handleSaveChanges = async () => {
    if (!editableTask) return;

    try {
      // Update the task document in Firestore
      const taskRef = doc(db, "tasks", editableTask.id);
      await updateDoc(taskRef, {
        description: newDescription,
        status: newStatus,
      });
      // Update local state to reflect changes
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editableTask.id
            ? { ...task, description: newDescription, status: newStatus }
            : task
        )
      );
      setEditableTask(null); // Reset editing
      setNewDescription("");
      setNewStatus(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      // Confirm before deleting
      const approval = confirm("You will permanently delete this task");
      if (!approval) return;

      // Delete the task from Firestore
      const taskRef = doc(db, "tasks", taskId);
      await deleteDoc(taskRef);

      // Remove the task from the local state
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Function to toggle task status
  const handleReDoTask = async (taskId) => {
    try {
      const approval = confirm("Are you sure you want to redo this task");
      if (!approval) return;

      // Get the task reference
      const taskRef = doc(db, "tasks", taskId);

      // Update the status to false (undone)
      await updateDoc(taskRef, {
        status: false,
      });

      // Update the local state to reflect the change
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: false } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  if (loading) {
    return (
      <div className="emptyDiv">
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="emptyDiv">
        <p>No tasks found.</p>
      </div>
    );
  }

  const divStyles = {
    width: "49%",
    float: "left",
  };
  const divStylesMobile = {
    width: "99%",
    margin: "20px 0 10px 0",
  };

  //INTERFACES
  //EDITING UI
  const EditingUI = (tasking) => {
    return (
      <div className="editing">
        <h5>Edit {tasking.taskName} description</h5>
        <br />
        <textarea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          style={{ width: "80%", height: "100px" }}
        />
        <br />
        <label htmlFor="status">Change status: </label>
        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value === "true")}
        >
          <option value={false}>Undone</option>
          <option value={true}>Done</option>
        </select>
        <br />
        <button className="green" onClick={handleSaveChanges}>
          Save Changes
        </button>
        <button className="green" onClick={() => setEditableTask(null)}>
          Close
        </button>
      </div>
    );
  };

  //Incomplete Tasks UI
  const Incomplete = () => {
    return (
      <div
        style={
          screenWidth > 600
            ? { ...divStyles, background: "#FFEEEE" }
            : { ...divStylesMobile, background: "#FFEEEE" }
        }
      >
        <h3 style={{ textAlign: "center" }}>Undone Tasks</h3>
        <ol>
          {tasks
            .filter((task) => !task.status)
            .map((task) => (
              <li
                key={task.id}
                style={{ marginBottom: "10px" }}
                onClick={(e) => {
                  // Prevent navigation when editing
                  if (editableTask && editableTask.id === task.id) {
                    e.stopPropagation(); // Prevent navigation during editing
                  } else {
                    navigate(
                      `/task/${task.taskName.replace(
                        new RegExp("\\s+", "g"),
                        "-"
                      )}`
                    ); // Trigger navigation when not editing
                  }
                }}
              >
                <strong>{task.taskName}</strong>
                <p>{task.description}</p>
                <p>Duration: {task.duration} hours</p>
                <p>
                  Status:{" "}
                  <label htmlFor="status" style={{ color: "red" }}>
                    Undone
                  </label>
                </p>
                {/* Editing UI  */}
                {editableTask && editableTask.id === task.id ? (
                  <EditingUI tasKing={"task"} />
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(task);
                    }}
                    className="green"
                    style={{ marginTop: "10px" }}
                  >
                    Edit
                  </button>
                )}

                <button
                  className="red"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTask(task.id);
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
        </ol>
      </div>
    );
  };

  //Complete taskUI
  const Complete = () => {
    return (
      <div
        style={
          screenWidth > 600
            ? { ...divStyles, background: "#EEFFEE", float: "right" }
            : { divStylesMobile, background: "#EEFFEE" }
        }
      >
        <h3 style={{ textAlign: "center" }}>Done Tasks</h3>
        <ol>
          {tasks
            .filter((task) => task.status)
            .map((task) => (
              <li
                key={task.id}
                style={{ marginBottom: "10px" }}
                onClick={(e) => {
                  // Prevent navigation when editing
                  if (editableTask && editableTask.id === task.id) {
                    e.stopPropagation(); // Prevent navigation during editing
                  } else {
                    navigate(
                      `/task/${task.taskName.replace(
                        new RegExp("\\s+", "g"),
                        "-"
                      )}`
                    ); // Trigger navigation when not editing
                  }
                }}
              >
                <strong>{task.taskName}</strong>
                <p>{task.description}</p>
                <p>Duration: {task.duration} hours</p>
                <p>
                  Status:{" "}
                  <label htmlFor="status" style={{ color: "green" }}>
                    Done
                  </label>
                </p>

                <button
                  className="green"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReDoTask(task.id);
                  }}
                >
                  ReDo
                </button>
                <button
                  className="red"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTask(task.id);
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
        </ol>
      </div>
    );
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <h2 style={{ textAlign: "center" }}>Task List</h2>
      <Incomplete />
      <Complete />
    </div>
  );
};

export default FetchTasks;
