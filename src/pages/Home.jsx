import React from "react";
import { useNavigate } from "react-router-dom";
//import { useScreenWidth } from "../context/ScreenWidthProvider";
import "../styles/home.css";

export default function Home() {
  // const screenWidth = useScreenWidth();
  const navigate = useNavigate();

  return (
    <div>
      <div className="UI" style={{ height: "60vh" }}>
        {" "}
        <h1 style={{ textAlign: "center" }}>Features</h1>
        <button onClick={() => navigate("/add-tasks")}>
          Add Activities{" "}
        </button>{" "}
        <br />
        <button onClick={() => navigate("/list-of-tasks")}>
          View Activities{" "}
        </button>
      </div>
    </div>
  );
}
