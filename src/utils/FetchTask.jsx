import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useScreenWidth } from "../context/ScreenWidthProvider";
import Footer from "../component/footer";
import Header from "../component/header";
import "../styles/button.css";
import "../styles/fetch.css";

const FetchTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(false);
  const [editableTask, setEditableTask] = useState(null); // Track the task being edited
  const [newDescription, setNewDescription] = useState(""); // Hold the new description
  const [newStatus, setNewStatus] = useState(false); // Hold the new status

  //Hold the size of the screen from a context variable
  const screenWidth = useScreenWidth();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tasks"));
        const tasksData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);
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
    return <p>Loading tasks...</p>;
  }

  if (tasks.length === 0) {
    return <p>No tasks found.</p>;
  }

  const divStyles = {
    width: "49%",
    float: "left",
  };
  const divStylesMobile = {
    width: "99%",
    margin: "20px 0 10px 0",
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <Header />
      <h2 style={{ textAlign: "center" }}>Task List</h2>
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
              <li key={task.id} style={{ marginBottom: "10px" }}>
                <strong>{task.taskName}</strong>
                <p>{task.description}</p>
                {/* Editing UI  */}
                {editableTask && editableTask.id === task.id ? (
                  <div className="editing">
                    <h5>Edit {task.taskName} description</h5>
                    <br />
                    <textarea
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      style={{ width: "80%", height: "100px" }}
                    />
                    <br />
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
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditClick(task)}
                    className="green"
                    style={{ marginTop: "10px" }}
                  >
                    Edit
                  </button>
                )}
                {/* Editing UI ends here  */}
                <p>Duration: {task.duration} hours</p>
                <p>
                  Status:{" "}
                  <label htmlFor="status" style={{ color: "red" }}>
                    Undone
                  </label>
                </p>
                <button
                  className="red"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  Delete
                </button>
              </li>
            ))}
        </ol>
      </div>

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
              <li key={task.id} style={{ marginBottom: "10px" }}>
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
                  onClick={() => handleReDoTask(task.id)}
                >
                  ReDo
                </button>
                <button
                  className="red"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  Delete
                </button>
              </li>
            ))}
        </ol>
      </div>
      <Footer />
    </div>
  );
};

export default FetchTasks;
