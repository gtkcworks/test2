import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import TaskManager from "./pages/TaskManager";
import "./App.css"

function App() {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("jwt");
  
  // Show navbar only if user is logged in and not on home page
  const showNav = isLoggedIn && location.pathname !== "/";

  const navStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '15px 30px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: '500',
    transition: 'background-color 0.3s',
    marginRight: '10px'
  };

  const logoutStyle = {
    ...linkStyle,
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1em'
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("userEmail");
    window.location.href = "/";
  };

  return (
    <>
      {showNav && (
        <nav style={navStyle}>
          <div>
            <Link 
              to="/tasks" 
              style={linkStyle}
              onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
              onMouseOut={(e) => e.target.style.background = 'transparent'}
            >
              📋 My Tasks
            </Link>
          </div>
          <div>
            <span style={{color: 'white', marginRight: '15px'}}>
              👤 {localStorage.getItem("userEmail")}
            </span>
            <button 
              onClick={handleLogout}
              style={logoutStyle}
              onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            >
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