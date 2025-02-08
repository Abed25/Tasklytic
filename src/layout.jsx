import { Routes, Route } from "react-router-dom";
import Header from "./component/header";
import Footer from "./component/footer";
import ProtectedRoute from "./utils/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import SignUp from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import TaskForm from "./utils/TaskForm";
import FetchTasks from "./utils/FetchTask";
import ProtectedLayout from "./Layouts/protectedLayout"; // Import Protected Layout

function Layout() {
  return (
    <div>
      <Header name="props" />
      <div className="content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<NotFound />} />

          {/* Protected Routes with SubHeader & SubFooter */}
          <Route
            element={
              <ProtectedRoute>
                <ProtectedLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/home" element={<Home />} />
            <Route path="/add-tasks" element={<TaskForm />} />
            <Route path="/list-of-tasks" element={<FetchTasks />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
