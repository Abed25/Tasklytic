import React from "react";

function Header(props) {
  const { name } = props;
  return (
    <div className="header">
      <h2>Todo App</h2>
    </div>
  );
}

export default Header;
