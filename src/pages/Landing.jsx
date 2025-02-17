import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import image from "../assets/todo-app-preview.webp";
import "../styles/landing.css";
import "../styles/button.css";

export default function Landing() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="landing">
      <header className="landing-header">
        {/* <h1>Boost Your Productivity</h1> */}
        <p>Manage tasks effortlessly with our To-Do App.</p>
      </header>

      <section className="landing-content">
        <button
          onClick={() => navigate(user ? "/home" : "/signup")}
          className="cta-button"
        >
          {user ? "Go to Dashboard" : "Get Started"}
        </button>
      </section>

      <footer className="landing-footer">
        {user ? (
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        ) : (
          <button onClick={() => navigate("/login")} className="login-button">
            Login
          </button>
        )}
      </footer>
    </div>
  );
}
