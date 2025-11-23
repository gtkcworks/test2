import { useState } from "react"

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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Login failed" }))
        throw new Error(errorData.error || "Invalid email or password")
      }
      
      const result = await response.json()
      localStorage.setItem("jwt", result.token)
      localStorage.setItem("userEmail", email)
      
      // Show success message briefly before redirect
      setError("Login successful! Redirecting...")
      setTimeout(() => {
        window.location.href = "/tasks"
      }, 1000)
      
    } catch (error) {
      setError(error.message || "Unable to connect to server")
      setLoading(false)
    }
  }

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px'
  }

  const cardStyle = {
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    maxWidth: '400px',
    width: '100%'
  }

  const titleStyle = {
    color: '#333',
    fontSize: '2em',
    marginBottom: '10px',
    textAlign: 'center'
  }

  const subtitleStyle = {
    color: '#666',
    fontSize: '1em',
    marginBottom: '30px',
    textAlign: 'center'
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    margin: '10px 0',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '1em',
    transition: 'border-color 0.3s',
    boxSizing: 'border-box'
  }

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    margin: '20px 0 10px 0',
    background: loading ? '#999' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1em',
    fontWeight: 'bold',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
  }

  const errorStyle = {
    color: error.includes('successful') ? '#4caf50' : '#f44336',
    background: error.includes('successful') ? '#e8f5e9' : '#ffebee',
    padding: '10px',
    borderRadius: '8px',
    marginTop: '15px',
    textAlign: 'center',
    fontSize: '0.9em'
  }

  const iconStyle = {
    fontSize: '3em',
    textAlign: 'center',
    marginBottom: '20px'
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={iconStyle}>✓</div>
        <h1 style={titleStyle}>Task Manager</h1>
        <p style={subtitleStyle}>Please login to continue</p>
        
        <form onSubmit={login}>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email address" 
            style={inputStyle}
            required
            disabled={loading}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
          
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
            style={inputStyle}
            required
            disabled={loading}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
          
          <button 
            type="submit" 
            disabled={loading}
            style={buttonStyle}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)'
              }
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)'
            }}
          >
            {loading ? '🔄 Logging in...' : '🔐 Login'}
          </button>
        </form>
        
        {error && <div style={errorStyle}>{error}</div>}
      </div>
    </div>
  )
}