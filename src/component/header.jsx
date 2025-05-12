import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { auth } from "../../firebase";
import { useAuth } from "../context/AuthProvider"; // ✅ useAuth hook
import "../styles/header.css";

const MySwal = withReactContent(Swal);

export default function Header() {
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ get user from context

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/"); // Optional: redirect to login/home after logout
  };

  const confirmLogout = async () => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4CAF50",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
    });

    if (result.isConfirmed) {
      await handleLogout();
    }
  };

  const iconStyles = {
    marginRight: "8px",
    position: "absolute",
    top: "4px",
    fontSize: "26px",
    cursor: "pointer",
  };

  return (
    <div className="header">
      <h2 onClick={() => navigate("/")}>Todo App</h2>

      {user && (
        <>
          <FaUserCircle
            title="Profile"
            style={{
              ...iconStyles,
              right: "65px",
            }}
          />

          <FaSignOutAlt
            title="Logout"
            onClick={confirmLogout}
            style={{
              ...iconStyles,
              right: "10px",
            }}
          />
        </>
      )}
    </div>
  );
}
