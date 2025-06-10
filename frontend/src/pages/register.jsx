import { useState } from "react";
import { setUser, setError } from "../slice/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { user, error } = useSelector((state) => state.user);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      dispatch(setError("Passwords don't match"));
      return;
    }
    try {
      const res = await fetch("http://localhost:5001/api/users/register", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(setError(data.message));
      } else {
        dispatch(setUser(data.user));
      }
    } catch (err) {
      dispatch(setError("Server Error"));
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleRegister} style={styles.form}>
        <h2 style={styles.title}>Register</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter Username"
          required
          style={styles.input}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
          required
          style={styles.input}
        />
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirm Password"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Register</button>
        {error && <p style={styles.error}>Error: {error}</p>}
        {user && <p style={styles.success}>User registered successfully</p>}
        <button type="button" onClick={() => navigate("/")} style={styles.backButton}>
          Back to Login
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f7f7f7",
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
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  backButton: {
    padding: "0.5rem",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  error: {
    color: "red",
    textAlign: "center"
  },
  success: {
    color: "green",
    textAlign: "center"
  }
};
