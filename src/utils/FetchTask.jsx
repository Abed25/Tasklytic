import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useScreenWidth } from "../context/ScreenWidthProvider";
import Footer from "../component/footer";
import Header from "../component/header";
import "../styles/button.css";
import "../styles/fetch.css";

const FetchTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  //Hold the size of the screen from a context variable
  const screenWidth = useScreenWidth();
  const [status, setStatus] = useState(false);

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
  }, [tasks]);

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
                {status ? (
                  <div className="editing">
                    <h5>Edit {task.taskName} description</h5>
                    <br />
                    <textarea width="80%" height="200px">
                      {task.description}
                    </textarea>
                    <br />
                    <button className="green">Save Changes</button>
                  </div>
                ) : null}
                {/* Editing UI ends here  */}

                <p>Duration: {task.duration} hours</p>
                <p>
                  Status:{" "}
                  <label htmlFor="status" style={{ color: "red" }}>
                    Undone
                  </label>
                  {/* Editing UI  */}
                  {status ? (
                    <div className="editing">
                      <select>
                        <option value={false}>Undone</option>
                        <option value={true}>Done</option>
                      </select>
                      <button className="green">Save Changes</button>
                    </div>
                  ) : null}
                  {/* Editing UI ends here  */}
                </p>
              </li>
            ))}
        </ol>
        <button
          onClick={() => setStatus(!status)}
          className="green"
          style={{ margin: "2px 2px 2px 25%", height: "30px" }}
        >
          {status ? "...UPDATING..." : "UPDATE"}
        </button>
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
              </li>
            ))}
        </ol>
      </div>
      <Footer />
    </div>
  );
};

export default FetchTasks;
