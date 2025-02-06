import { useState } from "react";
import "./App.css";
import Home from "./pages/Home";
import TaskForm from "./utils/TaskForm";
import FetchTasks from "./utils/FetchTask";
import { Outlet, Route, Routes } from "react-router-dom";
import Header from "./component/header";
import Footer from "./component/footer";

function Layout() {
  return (
    <div>
      <Header />
      <div className="content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <>
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<Layout />}>
          <Route element={<TaskForm />} path="/add-tasks" />
          <Route element={<FetchTasks />} path="/list-of-tasks" />
        </Route>
      </Routes>
    </>
  );
}

export default App;
