import { useState } from "react";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useAuth } from "../context/AuthProvider";
import { toast } from "react-toastify";
import "../styles/login.css";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("User created successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(`Error signing up: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleSignUp();
  };

  const handleGoogleSignUp = async () => {
    try {
      await loginWithGoogle();
      toast.success("Google sign up successful!");
      navigate("/home");
    } catch (error) {
      toast.error("Google sign up failed: " + error.message);
    }
  };

  return (
    <div className="login">
      <h2>Sign Up</h2>
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">
          Sign Up
        </button>
      </form>
      <div className="divider">
        <span>OR</span>
      </div>
      <button 
        onClick={handleGoogleSignUp} 
        className="google-btn"
        type="button"
      >
        <FaGoogle /> Sign up with Google
      </button>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default SignUp;
