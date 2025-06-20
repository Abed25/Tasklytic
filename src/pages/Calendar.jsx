import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "../styles/calendar.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../context/AuthProvider";

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      try {
        const querySnapshot = await getDocs(collection(db, "tasks"));
        const tasksData = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((task) => task.userId === user.uid)
          .map(task => ({
            ...task,
            // Ensure createdAt is a Date object
            createdAt: task.createdAt.toDate ? task.createdAt.toDate() : new Date(task.createdAt)
          }));
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [user]);

  const handleDateChange = (date) => {
    setDate(date);
    const tasksOnDate = tasks.filter(
      (task) => task.createdAt.toDateString() === date.toDateString()
    );
    setSelectedTasks(tasksOnDate);
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const tasksOnDate = tasks.filter(
        (task) => task.createdAt.toDateString() === date.toDateString()
      );
      if (tasksOnDate.length > 0) {
        return <div className="task-indicator"></div>;
      }
    }
    return null;
  };

  return (
    <div className="calendar-container">
      <h1 className="calendar-header">Your Task Calendar</h1>
      <div className="calendar-wrapper">
        <Calendar
          onChange={handleDateChange}
          value={date}
          tileContent={tileContent}
          className="react-calendar"
        />
      </div>
      <div className="task-list">
        <h2 className="task-list-header">
          Tasks for {date.toLocaleDateString()}
        </h2>
        {selectedTasks.length > 0 ? (
          <ul>
            {selectedTasks.map((task) => (
              <li key={task.id} className="task-item">
                <span className="task-name">{task.taskName}</span>
                <span className={`task-status ${task.status ? "completed" : "pending"}`}>
                  {task.status ? "Completed" : "Pending"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tasks for this date.</p>
        )}
      </div>
    </div>
  );
};

export default CalendarPage; 