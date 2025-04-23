import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
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
  const [incompleteSortOption, setIncompleteSortOption] = useState("new"); // Sort option for Incomplete tasks
  const [completedSortOption, setCompletedSortOption] = useState("new"); // Sort option for Completed tasks
  const screenWidth = useScreenWidth();
  const navigate = useNavigate();

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
    const approval = window.confirm("You will permanently delete this task");
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

  const handleSortChange = (e, section) => {
    if (section === "incomplete") {
      setIncompleteSortOption(e.target.value);
    } else {
      setCompletedSortOption(e.target.value);
    }
  };

  const sortTasks = (tasks, sortOption) => {
    switch (sortOption) {
      case "new":
        return tasks.sort((a, b) => a.createdAt - b.createdAt); // Assuming createdAt exists
      case "duration":
        return tasks.sort((a, b) => a.duration - b.duration);
      case "alphabetical":
        return tasks.sort((a, b) => a.taskName.localeCompare(b.taskName));
      default:
        return tasks;
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

  // Task Card UI
  const TaskCard = ({ task, isCompleted }) => (
    <div
      className={`task-card ${isCompleted ? "completed" : "incomplete"}`}
      onClick={() =>
        navigate(`/task/${task.taskName.replace(new RegExp("\\s+", "g"), "-")}`)
      }
    >
      <h3>{task.taskName}</h3>
      <p>{task.description}</p>
      <p>Duration: {task.duration} hours</p>
      <p>
        Status:{" "}
        {isCompleted ? (
          <span className="status-done">Done</span>
        ) : (
          <span className="status-undone">Undone</span>
        )}
      </p>
      <div className="button-container">
        {isCompleted ? (
          <button
            className="action-btn green"
            style={{ height: "auto" }}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleTaskStatus(task.id, true); // Switch to undone
            }}
          >
            Redo
          </button>
        ) : (
          <button
            className="action-btn blue"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleTaskStatus(task.id, false); // Switch to done
            }}
          >
            Done
          </button>
        )}
        <button
          className="action-btn red"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteTask(task.id);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );

  const IncompleteTasks = () => {
    const incompleteTasks = tasks.filter((task) => !task.status);
    return (
      <div className="task-column incomplete-tasks">
        <h2>Undone Tasks</h2>
        <div>
          <label>Sort by:</label>
          <select
            onChange={(e) => handleSortChange(e, "incomplete")}
            value={incompleteSortOption}
          >
            <option value="new">Newest</option>
            <option value="duration">Duration</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
        {sortTasks(incompleteTasks, incompleteSortOption).map((task) => (
          <TaskCard key={task.id} task={task} isCompleted={false} />
        ))}
      </div>
    );
  };

  const CompletedTasks = () => {
    const completedTasks = tasks.filter((task) => task.status);
    return (
      <div className="task-column completed-tasks">
        <h2>Done Tasks</h2>
        <div>
          <label>Sort by:</label>
          <select
            onChange={(e) => handleSortChange(e, "completed")}
            value={completedSortOption}
          >
            <option value="new">Newest</option>
            <option value="duration">Duration</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
        {sortTasks(completedTasks, completedSortOption).map((task) => (
          <TaskCard key={task.id} task={task} isCompleted={true} />
        ))}
      </div>
    );
  };

  return (
    <div className="task-list-container">
      <IncompleteTasks />
      <CompletedTasks />
    </div>
  );
};

export default FetchTasks;
