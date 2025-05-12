import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaListAlt, FaTasks } from "react-icons/fa";
import "../styles/header.css";
import "../styles/button.css";

export default function Subheader() {
  return (
    <div className="subheader">
      <Link to={"/home"}>
        <button className="normal" style={{ backgroundColor: "#4C50AF" }}>
          <FaHome style={{ marginRight: "8px" }} />
          Home
        </button>
      </Link>

      <Link to={"/list-of-tasks"}>
        <button className="normal" style={{ backgroundColor: "#4CAF50" }}>
          <FaListAlt style={{ marginRight: "8px" }} />
          View Tasks
        </button>
      </Link>

      <Link to={"/add-tasks"}>
        <button className="normal" style={{ backgroundColor: "#4CAF50" }}>
          <FaTasks style={{ marginRight: "8px" }} />
          Add Tasks
        </button>
      </Link>
    </div>
  );
}
