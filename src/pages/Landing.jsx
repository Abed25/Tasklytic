import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
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
      <h1>Welcome to the To-Do App</h1>
      <p>Organize your tasks efficiently.</p>
      {user ? (
        <button onClick={() => navigate("/home")} className="green">
          Manage tasks
        </button>
      ) : null}
      {user ? (
        <button onClick={handleLogout} className="green">
          Logout
        </button>
      ) : (
        <button onClick={() => navigate("/login")} className="green">
          Login
        </button>
      )}
    </div>
  );
}
