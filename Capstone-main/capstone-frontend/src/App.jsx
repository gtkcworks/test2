import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import TaskManager from "./pages/TaskManager";
import "./App.css"

function App() {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("jwt");
  
  // Show navbar only if user is logged in and not on home page
  const showNav = isLoggedIn && location.pathname !== "/";

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("userEmail");
    window.location.href = "/";
  };

  return (
    <>
      {showNav && (
        <nav className="navbar">
          <div>
            <Link to="/tasks" className="nav-link">
              📋 My Tasks
            </Link>
          </div>

          <div>
            <span className="nav-email">
              👤 {localStorage.getItem("userEmail")}
            </span>
            <button className="logout-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<TaskManager />} />
      </Routes>
    </>
  );
}

export default App;