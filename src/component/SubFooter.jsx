import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/footer.css";

export default function SubFooter() {
  const navigate = useNavigate();
  return (
    <div className="footer">
      <div className="section1">
        <h4>About the app</h4>
        <p>Am here to manage your daily task efficiently.</p>
        <p>
          You have a task to perform just click add task and register the
          activity.
        </p>
      </div>
      <div className="section3">
        {" "}
        <h4>Quick links</h4>
        <label htmlFor="link" onClick={() => navigate("/add-tasks")}>
          Add tasks
        </label>
        <br />
        <label htmlFor="link" onClick={() => navigate("/list-of-tasks")}>
          View tasks
        </label>
      </div>
    </div>
  );
}
