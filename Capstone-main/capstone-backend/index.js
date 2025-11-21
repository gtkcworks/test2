const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
require("dotenv").config();

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");

   const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/taskmanager";
   const PORT = process.env.PORT || 3000;
   const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

mongoose.connect(MONGODB_URI)
    .then(() => {
        const app = express();
        app.use(cors({
            origin: FRONTEND_URL, 
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            credentials: true, // if you send cookies or auth headers
        }));
        app.use(express.json());

        app.use("/auth", authRoutes);
        app.use("/tasks", taskRoutes);
        
        app.get("/", (req, res) => {
               res.json({ message: "Task Manager API is running" });
           });

           app.listen(PORT, () => console.log(`Task Manager API running on port ${PORT}`));
       })
       .catch(err => {
           console.error("MongoDB connection error:", err);
           process.exit(1);
       });