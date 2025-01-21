import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const buttonStyles = {
    height: "40px",
    width: "300px",
    background: "#4CAF50",
    borderRadius: "20px",
    color: "#fff",
    margin: "20px 35%",
    cursor: "pointer",
    border: "none",
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>TODO APP</h1>
      <button onClick={() => navigate("/add-tasks")} style={buttonStyles}>
        Add Activities{" "}
      </button>{" "}
      <br />
      <button onClick={() => navigate("/list-of-tasks")} style={buttonStyles}>
        View Activities{" "}
      </button>
    </div>
  );
}
