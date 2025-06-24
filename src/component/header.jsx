import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { FaUserCircle, FaSignOutAlt, FaSun, FaMoon } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { auth } from "../../firebase";
import { useAuth } from "../context/AuthProvider";
import "../styles/header.css";

const MySwal = withReactContent(Swal);

export default function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const confirmLogout = async () => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "rgba(128, 222, 234, 0.8)",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
    });

    if (result.isConfirmed) {
      await handleLogout();
    }
  };

  return (
    <div className="header">
      <h2 onClick={() => navigate("/")}>Tasklytic</h2>

      {user && (
        <div className="header-icons">
          {isMobile && (
            <FaSun style={{ marginRight: 8 }} />
          )}
          <FaUserCircle
            title="Profile"
            onClick={() => navigate("/profile")}
          />
          <FaSignOutAlt
            title="Logout"
            onClick={confirmLogout}
          />
        </div>
      )}
    </div>
  );
}
