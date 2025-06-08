import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../../firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext();

// Define protected routes
const PROTECTED_ROUTES = ['/home', '/list-of-tasks', '/add-tasks', '/profile'];

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);

      // Only redirect to login if trying to access a protected route while not authenticated
      if (!user && PROTECTED_ROUTES.includes(location.pathname)) {
        navigate('/login', { replace: true });
      }
    });

    return unsubscribe;
  }, [navigate, location.pathname]);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
