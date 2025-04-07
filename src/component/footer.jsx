import React from "react";
import "../styles/footer.css";

function Footer() {
  return (
    <div className="footer">
      <p>
        {" "}
        &copy; {new Date().getFullYear()} superDev | Todo | All rights reserved.
      </p>
    </div>
  );
}

export default Footer;
