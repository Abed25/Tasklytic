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
        <h1>Features</h1>
        <button
          onClick={() => navigate("/add-tasks")}
          title="Create an activity."
        >
          Add Activities{" "}
        </button>
        <button
          onClick={() => navigate("/list-of-tasks")}
          title="Take a look at your recorded activities."
        >
          View Activities{" "}
        </button>

        <button
          style={{
            background: "white",
            border: "1px gray solid",
            color: "black",
          }}
          title="More features coming..."
          onClick={() => alert("More features coming soon!")}
        >
          +
        </button>
      </div>
    </div>
  );
}
