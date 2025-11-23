import { useState, useEffect } from "react";

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

  // Styles
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px'
  };

  const mainCardStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    overflow: 'hidden'
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '30px',
    textAlign: 'center'
  };

  const titleStyle = {
    margin: '0 0 10px 0',
    fontSize: '2em'
  };

  const statsStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    fontSize: '0.9em',
    opacity: '0.9'
  };

  const contentStyle = {
    padding: '30px'
  };

  const formStyle = {
    display: 'flex',
    gap: '10px',
    marginBottom: '25px'
  };

  const inputStyle = {
    flex: '2',
    padding: '12px 15px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '1em',
    transition: 'border-color 0.3s'
  };

  const dateInputStyle = {
    ...inputStyle,
    flex: '1'
  };

  const addButtonStyle = {
    padding: '12px 25px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1em',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
  };

  const filterStyle = {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    justifyContent: 'center'
  };

  const filterButtonStyle = (isActive) => ({
    padding: '8px 20px',
    border: 'none',
    borderRadius: '20px',
    background: isActive ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f0f0f0',
    color: isActive ? 'white' : '#666',
    cursor: 'pointer',
    fontWeight: isActive ? 'bold' : 'normal',
    transition: 'all 0.3s'
  });

  const taskListStyle = {
    listStyle: 'none',
    padding: '0',
    margin: '0'
  };

  const taskItemStyle = (completed, isOverdue) => ({
    background: completed ? '#f0f9ff' : (isOverdue ? '#fff5f5' : 'white'),
    border: `2px solid ${completed ? '#bfdbfe' : (isOverdue ? '#fecaca' : '#e0e0e0')}`,
    borderRadius: '12px',
    padding: '15px 20px',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    transition: 'all 0.3s',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
  });

  const checkboxStyle = {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    accentColor: '#667eea'
  };

  const taskTextStyle = (completed) => ({
    flex: '1',
    textDecoration: completed ? "line-through" : "none",
    color: completed ? '#999' : '#333',
    fontSize: '1em',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  });

  const deadlineStyle = (isOverdue, completed) => ({
    fontSize: '0.85em',
    color: isOverdue && !completed ? '#ef4444' : '#666',
    fontWeight: isOverdue && !completed ? 'bold' : 'normal'
  });

  const deleteButtonStyle = {
    padding: '8px 15px',
    background: '#fee',
    color: '#e11',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.3s'
  };

  const emptyStateStyle = {
    textAlign: 'center',
    padding: '40px',
    color: '#999'
  };

  const emptyIconStyle = {
    fontSize: '4em',
    marginBottom: '10px'
  };

  return (
    <div style={containerStyle}>
      <div style={mainCardStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>✓ My Tasks</h1>
          <div style={statsStyle}>
            <span>📊 Total: {tasks.length}</span>
            <span>⚡ Active: {activeCount}</span>
            <span>✅ Completed: {completedCount}</span>
          </div>
        </div>

        <div style={contentStyle}>
          <form onSubmit={addTask} style={formStyle}>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Add new task..."
              style={inputStyle}
              required
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
            <input
              type="date"
              value={taskDeadline}
              onChange={(e) => setTaskDeadline(e.target.value)}
              style={dateInputStyle}
              required
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
            <button
              type="submit"
              style={addButtonStyle}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
              }}
            >
              ➕ Add
            </button>
          </form>

          <div style={filterStyle}>
            <button
              style={filterButtonStyle(filter === "all")}
              onClick={() => setFilter("all")}
              onMouseOver={(e) => {
                if (filter !== "all") e.target.style.background = '#e5e5e5';
              }}
              onMouseOut={(e) => {
                if (filter !== "all") e.target.style.background = '#f0f0f0';
              }}
            >
              All Tasks
            </button>
            <button
              style={filterButtonStyle(filter === "active")}
              onClick={() => setFilter("active")}
              onMouseOver={(e) => {
                if (filter !== "active") e.target.style.background = '#e5e5e5';
              }}
              onMouseOut={(e) => {
                if (filter !== "active") e.target.style.background = '#f0f0f0';
              }}
            >
              Active
            </button>
            <button
              style={filterButtonStyle(filter === "completed")}
              onClick={() => setFilter("completed")}
              onMouseOver={(e) => {
                if (filter !== "completed") e.target.style.background = '#e5e5e5';
              }}
              onMouseOut={(e) => {
                if (filter !== "completed") e.target.style.background = '#f0f0f0';
              }}
            >
              Completed
            </button>
          </div>

          {loading ? (
            <div style={emptyStateStyle}>
              <div style={emptyIconStyle}>⏳</div>
              <p>Loading your tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div style={emptyStateStyle}>
              <div style={emptyIconStyle}>
                {filter === "completed" ? "🎉" : filter === "active" ? "📝" : "📋"}
              </div>
              <p>
                {filter === "completed" ? "No completed tasks yet." :
                  filter === "active" ? "No active tasks. Time to add some!" :
                    "No tasks yet. Start by adding one above!"}
              </p>
            </div>
          ) : (
            <ul style={taskListStyle}>
              {filteredTasks.map((task, index) => {
                const isOverdue = !task.completed && new Date(task.deadline) < new Date();
                return (
                  <li
                    key={index}
                    style={taskItemStyle(task.completed, isOverdue)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(index)}
                      style={checkboxStyle}
                    />
                    <div style={taskTextStyle(task.completed)}>
                      <span>{task.title}</span>
                      <span style={deadlineStyle(isOverdue, task.completed)}>
                        {isOverdue && !task.completed ? "⚠️ " : "📅 "}
                        {new Date(task.deadline).toLocaleDateString('en-GB')}
                        {isOverdue && !task.completed ? " - Overdue!" : ""}
                      </span>
                    </div>
                    <button
                      onClick={() => removeTask(task, index)}
                      style={deleteButtonStyle}
                      onMouseOver={(e) => {
                        e.target.style.background = '#fcc';
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = '#fee';
                        e.target.style.transform = 'scale(1)';
                      }}
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