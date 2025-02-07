import { useAuth } from "../context/AuthProvider";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header>
      <h1>Task Manager</h1>
      {user ? (
        <div>
          <span>Welcome, {user.email}!</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <span>Please log in</span>
      )}
    </header>
  );
};

export default Header;
