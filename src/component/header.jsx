import React from "react";
import { useNavigate } from "react-router-dom";

function Header(props) {
  const navigate = useNavigate();
  const { name } = props;
  return (
    <div className="header">
      <h2 onClick={() => navigate("/")}>Todo App</h2>
    </div>
  );
}

export default Header;
