import { useState } from "react";
import { setUser, setError } from "../slice/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { user, error } = useSelector((state) => state.user);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5001/api/users/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(setError(data.message));
      } else {
        dispatch(setUser(data.user));
        navigate("/home");
      }
    } catch (error) {
      dispatch(setError("Server Error"));
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.title}>Login</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => { setUsername(e.target.value) }}
          placeholder="Enter Username"
          required
          style={styles.input}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value) }}
          placeholder="Enter Password"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Login</button>
        <p style={styles.text}>New here? <Link to={"/register"}>Register</Link></p>
        {error && <p style={styles.error}>Error: {error}</p>}
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#f0f0f0",
  },
  form: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    width: "300px"
  },
  title: {
    textAlign: "center",
    marginBottom: "1rem",
  },
  input: {
    padding: "0.5rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1rem"
  },
  button: {
    padding: "0.5rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  error: {
    color: "red",
    textAlign: "center"
  },
  text: {
    textAlign: "center"
  }
};
