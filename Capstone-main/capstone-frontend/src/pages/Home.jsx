import { useState, useEffect } from "react"

export default function Home() {
   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")

   const textbox = {
      padding: 5,
      margin: 5,
      placeItems: "center"
   }

   const login = async (e) => {
      e.preventDefault()
      console.log(`Email: ${email}`)
      const response = await fetch("http://localhost:3000/auth/login", {
         method: "POST",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({
            email: email,
            password: password
         })
      })
      const result = await response.json()
      localStorage.setItem("jwt", result.token)
      window.location.href = "/tasks"
   }
   return (
      <div>
         <h1>Welcome to the Task Manager App</h1>
         <p>Please login to use the Task Manager</p>
         <form>
            <input type="email" id="emailInput" onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={textbox} />
            <br />
            <input type="password" id="passwordInput" onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={textbox} />
            <br />
            <input type="submit" id="loginBtn" onClick={login}/>
         </form>
      </div>
   )
}