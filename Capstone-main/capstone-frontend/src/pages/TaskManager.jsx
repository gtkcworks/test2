import { useState, useEffect } from "react";
import "./TaskManager.css";

export default function TaskManager() {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, active, completed

  const getTasks = async () => {
    const jwt = localStorage.getItem("jwt")
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      })
      if (!response.ok)
        window.location.href = "/"
      const result = await response.json()
      setTasks(result)
      setLoading(false)
    } catch (error) {
      console.log(error)
      console.log("Error making API call")
      window.location.href = "/";
    }
  }

  const addTasks = async () => {
    const jwt = localStorage.getItem("jwt")
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          'Content-Type': `application/json`,
          'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify({
          title: taskName,
          deadline: taskDeadline
        })
      })
      const result = await response.json()
    } catch (error) {
      console.log(error)
      console.log("Error making Add Task call")
    }
  }

  const updateTask = async (task) => {
    const jwt = localStorage.getItem("jwt")
    try {
      const response = await fetch(`${API_URL}/tasks/${task._id}`, {
        method: "PUT",
        headers: {
          'Content-Type': `application/json`,
          'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify({
          completed: task.completed
        })
      })
      const result = await response.json()
    } catch (error) {
      console.log(error)
      console.log("Error making Update Task call")
    }
  }

  const deleteTask = async (task) => {
    const jwt = localStorage.getItem("jwt")
    try {
      const response = await fetch(`${API_URL}/tasks/${task._id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      })
      if (response.ok) {
        console.log("Deleted successfully")
      }
    } catch (error) {
      console.log(error)
      console.log("Error making Delete Task call")
    }
  }

  useEffect(() => {
    getTasks()
  }, []);

  const addTask = (e) => {
    e.preventDefault();
    if (taskName == "" || taskDeadline == "") { }
    if (taskName.trim()) {
      setTasks([...tasks, { title: taskName, deadline: taskDeadline, completed: false }]);
      setTaskName("");
      setTaskDeadline("");
      addTasks()
    }
  };

  const toggleTask = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    updateTask(newTasks[index])
    setTasks(newTasks);
  };

  const removeTask = (task, index) => {
    deleteTask(task)
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const activeCount = tasks.filter(t => !t.completed).length;
  return (
    <div className="task-container">
      <div className="task-main-card">
        <div className="task-header">
          <h1 className="task-title">✓ My Tasks</h1>
          <div className="task-stats">
            <span>📊 Total: {tasks.length}</span>
            <span>⚡ Active: {activeCount}</span>
            <span>✅ Completed: {completedCount}</span>
          </div>
        </div>

        <div className="task-content">
          <form className="task-form" onSubmit={addTask}>
            <input
              className="task-input"
              type="text"
              placeholder="Add new task..."
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />

            <input
              className="task-date-input"
              type="date"
              value={taskDeadline}
              onChange={(e) => setTaskDeadline(e.target.value)}
              required
            />

            <button type="submit" className="task-add-btn">+ Add</button>
          </form>

          <div className="task-filters">
            {["all", "active", "completed"].map((f) => (
              <button
                key={f}
                className={`task-filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f[0].toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="task-empty">
              <div className="task-empty-icon">⏳</div>
              <p>Loading your tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="task-empty">
              <div className="task-empty-icon">
                {filter === "completed" ? "🎉" :
                 filter === "active" ? "📝" : "📋"}
              </div>
              <p>
                {filter === "completed"
                  ? "No completed tasks yet."
                  : filter === "active"
                    ? "No active tasks. Time to add some!"
                    : "No tasks yet. Start by adding one above!"}
              </p>
            </div>
          ) : (
            <ul className="task-list">
              {filteredTasks.map((task, index) => {
                const isOverdue =
                  !task.completed && new Date(task.deadline) < new Date();

                return (
                  <li
                    key={index}
                    className={
                      `task-item 
                       ${task.completed ? "completed" : ""} 
                       ${isOverdue ? "overdue" : ""}`
                    }
                  >
                    <input
                      type="checkbox"
                      className="task-checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(index)}
                    />

                    <div className={`task-text ${task.completed ? "completed" : ""}`}>
                      <span>{task.title}</span>
                      <span className={`task-deadline ${isOverdue && !task.completed ? "overdue" : ""}`}>
                        {isOverdue && !task.completed ? "⚠️ " : "📅 "}
                        {new Date(task.deadline).toLocaleDateString("en-GB")}
                        {isOverdue && !task.completed ? " - Overdue!" : ""}
                      </span>
                    </div>

                    <button
                      className="task-delete-btn"
                      onClick={() => removeTask(task, index)}
                    >
                      🗑️ Remove
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}