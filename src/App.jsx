import { useState } from "react";
import Home from "./pages/Home";
import TaskForm from "./utils/TaskForm";
import FetchTasks from "./utils/FetchTask";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<TaskForm />} path="/add-tasks" />
        <Route element={<FetchTasks />} path="/list-of-tasks" />
      </Routes>
    </>
  );
}

export default App;
