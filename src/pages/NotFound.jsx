import React from "react";
import { NavLink } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{ textAlign: "center" }}>
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <NavLink to="/"> Go back Home </NavLink>
    </div>
  );
};

export default NotFound;
