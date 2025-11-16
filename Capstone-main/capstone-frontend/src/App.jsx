import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import TaskManager from "./pages/TaskManager";
import "./App.css"

function App() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link> | <Link to="/tasks">Tasks</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<TaskManager />} />
      </Routes>
    </>
  );
}

export default App;
