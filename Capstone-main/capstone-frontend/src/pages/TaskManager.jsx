import { useState, useEffect } from "react";

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");

  const getTasks = async () => {
    const jwt = localStorage.getItem("jwt")
    try{
      const response = await fetch("http://localhost:3000/tasks", {
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      })
      if(!response.ok)
        window.location.href = "/"
      const result = await response.json()
      setTasks(result)
    }catch(error){
      console.log(error)
      console.log("Error making API call")
      window.location.href = "/";
    }
  }

  const addTasks = async () => {
    const jwt = localStorage.getItem("jwt")
    try{
      const response = await fetch("http://localhost:3000/tasks", {
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
      console.log(response)
      const result = await response.json()
    }catch(error){
      console.log(error)
      console.log("Error making Add Task call")
    }
  }

  const updateTask = async (task) => {
    const jwt = localStorage.getItem("jwt")
    try{
      const response = await fetch(`http://localhost:3000/tasks/${task._id}`, {
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
      console.log(result)
    }catch(error){
      console.log(error)
      console.log("Error making Update Task call")
    }
  }

  const deleteTask = async (task) => {
    const jwt = localStorage.getItem("jwt")
    console.log(task)
    try{
      const delUrl = `http://localhost:3000/tasks/${task._id}`
      console.log(delUrl)
      const response = await fetch(delUrl, {
        method: "DELETE",
        headers: {
          // 'Content-Type': `application/json`,
          'Authorization': `Bearer ${jwt}`
        }
      })
      console.log(response)
      if(response.ok){
        console.log("Deleted successfully")
      }
    }catch(error){
      console.log(error)
      console.log("Error making Delete Task call")
    }
  }

  // Load tasks from localStorage on component mount
  useEffect(() => {
    getTasks()
    // const savedTasks = localStorage.getItem("tasks");
    // if (savedTasks) {
    //   setTasks(JSON.parse(savedTasks));
    // }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if(taskName == "" || taskDeadline == ""){}
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

  const textboxStyle = {padding: 5, margin: 10}

  return (
    <div>
      <h2>My Tasks</h2>
      <form onSubmit={addTask}>
        <input
          type="taskName"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Add new task"
          style={textboxStyle}
          required
        />
        <input 
            type="date"
            value={taskDeadline}
            onChange={(e) => setTaskDeadline(e.target.value)}
            placeholder="Deadline"
            style={textboxStyle}
            required
        />
        <button type="submit" style={{padding: 5}}>Add</button>
      </form>

      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <ul>
          {tasks.map((task, index) => (
            <li key={index}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(index)}
                style={textboxStyle}
              />
              <span style={{ 
                textDecoration: task.completed ? "line-through" : "",
                color: (!task.completed && new Date(task.deadline) < new Date()) ? "red" : "inherit",
                padding: 5,
                margin: 5,
              }}>
                {task.title}, {new Date(task.deadline).toLocaleDateString('en-GB')}              </span>
              <button onClick={() => removeTask(task, index)}>Remove</button>
            </li>
          ))}        </ul>
      )}
    </div>
  );
}
