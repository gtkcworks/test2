import { useState } from "react"
import "./Home.css"

export default function Home() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const login = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Login failed" }))
        throw new Error(errorData.error || "Invalid email or password")
      }
      
      const result = await response.json()
      localStorage.setItem("jwt", result.token)
      localStorage.setItem("userEmail", email)
      
      setError("Login successful! Redirecting...")
      setTimeout(() => {
        window.location.href = "/tasks"
      }, 1000)
      
    } catch (error) {
      setError(error.message || "Unable to connect to server")
      setLoading(false)
    }
  }

  return (
    <div className="home-container">
      <div className="home-card">
        <div className="home-icon">✓</div>
        <h1 className="home-title">Task Manager</h1>
        <p className="home-subtitle">Please login to continue</p>
        
        <form onSubmit={login}>
          <input 
            type="email"
            className="home-input"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <input 
            type="password"
            className="home-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <button 
            type="submit"
            className="home-button"
            disabled={loading}
          >
            {loading ? "🔄 Logging in..." : "🔐 Login"}
          </button>
        </form>

        {error && (
          <div 
            className={
              error.includes("successful") 
                ? "home-message success" 
                : "home-message error"
            }
          >
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
