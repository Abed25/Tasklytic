import { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import "../styles/login.css";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Login successful!");
      navigate("/home");
    } catch (error) {
      toast.error("Login failed: " + error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      toast.success("Google login successful!");
      navigate("/home");
    } catch (error) {
      toast.error("Google login failed: " + error.message);
    }
  };

  const handleForgotPassword = async (email) => {
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Check your inbox.");
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Failed to send reset email. Check if the email typed is correct.");
    }
  };

  return (
    <div className="login">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <div className="divider">
        <span>OR</span>
      </div>
      <button 
        onClick={handleGoogleSignIn} 
        className="google-btn"
        type="button"
      >
        <FaGoogle /> Sign in with Google
      </button>
      <p>
        Forgot password?{" "}
        <Link onClick={() => handleForgotPassword(email)}>Reset password</Link>
      </p>
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;
