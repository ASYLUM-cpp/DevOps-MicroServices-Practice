import React, { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchGatewayStatus();
    checkAuth();
  }, []);

  const fetchGatewayStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/`);
      const json = await res.json();
      setData(json.message);
    } catch (err) {
      console.error("Gateway error:", err);
      setData("Unable to connect to API Gateway");
    }
  };

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      fetchTasks(token);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
    const body = isRegister 
      ? { username, email, password }
      : { email, password };

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      
      if (res.ok) {
        localStorage.setItem("token", json.token);
        localStorage.setItem("user", JSON.stringify(json.user));
        setIsAuthenticated(true);
        setUser(json.user);
        setEmail("");
        setPassword("");
        setUsername("");
        fetchTasks(json.token);
      } else {
        alert(json.error || "Authentication failed");
      }
    } catch (err) {
      console.error("Auth error:", err);
      alert("Authentication error. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    setTasks([]);
  };

  const fetchTasks = async (token) => {
    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${token || localStorage.getItem("token")}`,
        },
      });

      const json = await res.json();
      if (res.ok) {
        setTasks(json.tasks || []);
      }
    } catch (err) {
      console.error("Fetch tasks error:", err);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: taskTitle, description: taskDescription }),
      });

      const json = await res.json();
      if (res.ok) {
        setTaskTitle("");
        setTaskDescription("");
        fetchTasks(token);
      } else {
        alert(json.error || "Failed to create task");
      }
    } catch (err) {
      console.error("Create task error:", err);
    }
  };

  const deleteTask = async (taskId) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchTasks(token);
      }
    } catch (err) {
      console.error("Delete task error:", err);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px", padding: "20px" }}>
      <h1>🔐 Secure MERN Microservices App</h1>
      <p>{data || "Loading..."}</p>

      {!isAuthenticated ? (
        <div style={{ maxWidth: "400px", margin: "0 auto" }}>
          <h2>{isRegister ? "Register" : "Login"}</h2>
          <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {isRegister && (
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ padding: "10px", fontSize: "16px" }}
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ padding: "10px", fontSize: "16px" }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: "10px", fontSize: "16px" }}
            />
            <button type="submit" style={{ padding: "10px", fontSize: "16px", cursor: "pointer" }}>
              {isRegister ? "Register" : "Login"}
            </button>
          </form>
          <p style={{ marginTop: "20px" }}>
            {isRegister ? "Already have an account?" : "Don't have an account?"}
            <button
              onClick={() => setIsRegister(!isRegister)}
              style={{ marginLeft: "10px", cursor: "pointer" }}
            >
              {isRegister ? "Login" : "Register"}
            </button>
          </p>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: "20px" }}>
            <h2>Welcome, {user?.username}!</h2>
            <button onClick={handleLogout} style={{ padding: "10px", cursor: "pointer" }}>
              Logout
            </button>
          </div>

          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <h3>Create New Task</h3>
            <form onSubmit={createTask} style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "30px" }}>
              <input
                type="text"
                placeholder="Task Title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                required
                style={{ padding: "10px", fontSize: "16px" }}
              />
              <textarea
                placeholder="Task Description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                style={{ padding: "10px", fontSize: "16px", minHeight: "80px" }}
              />
              <button type="submit" style={{ padding: "10px", fontSize: "16px", cursor: "pointer" }}>
                Add Task
              </button>
            </form>

            <h3>Your Tasks ({tasks.length})</h3>
            {tasks.length === 0 ? (
              <p>No tasks yet. Create one above!</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    style={{
                      border: "1px solid #ccc",
                      padding: "15px",
                      borderRadius: "5px",
                      textAlign: "left",
                    }}
                  >
                    <h4>{task.title}</h4>
                    <p>{task.description}</p>
                    <p style={{ fontSize: "12px", color: "#666" }}>
                      Status: {task.status} | Created: {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => deleteTask(task.id)}
                      style={{ padding: "5px 10px", cursor: "pointer", backgroundColor: "#ff4444", color: "white", border: "none", borderRadius: "3px" }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

