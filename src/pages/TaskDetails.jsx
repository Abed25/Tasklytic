import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const TaskDetails = () => {
  const { taskName } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>Loading...</p>;
  if (!task) return <p>Task not found</p>;

  return (
    <div>
      <h2>{task.taskName}</h2>
      <p>Description: {task.description}</p>
      <p>Duration: {task.duration} hours</p>
      <p>Status: {task.status ? "Done" : "Undone"}</p>
    </div>
  );
};

export default TaskDetails;
