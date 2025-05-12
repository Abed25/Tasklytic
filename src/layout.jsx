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
            <Route path="/list-of-tasks" element={<FetchTasks />} />
            <Route path="/task/:taskName" element={<TaskDetails />} />
            <Route path="/milestones" element={<Milestones />} />
            <Route path="/milestones/:date" element={<MilestoneDay />} />{" "}
            {/* ✅ New Route */}
          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
