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
import TaskDetails from "./pages/TaskDetails";
import ProtectedLayout from "./Layouts/protectedLayout";
import Milestones from "./milestones/pages/Milestones";
import MilestoneDay from "./milestones/pages/MilestoneDay"; // ✅ Import this
import CalendarPage from "./pages/Calendar";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Brainstorm from "./pages/Brainstorm";

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

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <ProtectedLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/home" element={<Home />} />
            <Route path="/add-tasks" element={<TaskForm />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/list-of-tasks" element={<FetchTasks />} />
            <Route path="/task/:taskName" element={<TaskDetails />} />
            <Route path="/milestones" element={<Milestones />} />
            <Route path="/milestones/:date" element={<MilestoneDay />} />{" "}
            {/* ✅ New Route */}
            <Route path="/brainstorm" element={<Brainstorm />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
