import React from "react";
import Footer from "../component/footer";
import { useNavigate } from "react-router-dom";
import { useScreenWidth } from "../context/ScreenWidthProvider";

export default function Home() {
  const screenWidth = useScreenWidth();
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
      {/* <h2>Screen width:{screenWidth}</h2> */}
      <button onClick={() => navigate("/add-tasks")} style={buttonStyles}>
        Add Activities{" "}
      </button>{" "}
      <br />
      <button onClick={() => navigate("/list-of-tasks")} style={buttonStyles}>
        View Activities{" "}
      </button>
      <Footer />
    </div>
  );
}
