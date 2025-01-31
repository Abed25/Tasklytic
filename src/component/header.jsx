import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/header.css";

function Header() {
  const navigate = useNavigate();
  return (
    <div className="header">
      <button
        onClick={() => navigate("/")}
        style={{
          padding: "10px 15px",
          backgroundColor: "#4C50AF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          margin: "10px",
          float: "left",
        }}
      >
        Home
      </button>
      <button
        onClick={() => navigate("/list-of-tasks")}
        style={{
          padding: "10px 15px",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          margin: "10px",
        }}
      >
        View Tasks
      </button>
      <button
        onClick={() => navigate("/add-tasks")}
        style={{
          padding: "10px 15px",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          margin: "10px",
        }}
      >
        Add Tasks
      </button>
    </div>
  );
}

export default Header;
