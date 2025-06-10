import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const onLogout = ()=>{
    localStorage.removeItem("username");
    navigate("/");
    alert("Logged out");
  }
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#333",
        color: "white",
        fontWeight: "bold",
      }}
    >
      <div style={{ display: "flex", gap: 20 }}>
        <a href="/home" style={{ color: "white", textDecoration: "none" }}>
          Home
        </a>
        <a href="/favourites" style={{ color: "white", textDecoration: "none" }}>
          Favourites
        </a>
      </div>
      <div style={{display:"flex",alignItems:"center",fontSize:"x-large"}}>Simple Learning App</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img
          src="https://media.istockphoto.com/id/1317551891/vector/account-avatar-member-person-profle-user-icon-eps-vector.jpg?s=612x612&w=0&k=20&c=wsVtFuxw-tZOIrLIff8gY8b49xNxeGCnXqM8OGJyiS8="
          alt="profile"
          style={{ borderRadius: "50%", height: "40px", width: "40px" }}
        />
        <button
          style={{
            padding: "6px 12px",
            backgroundColor: "#e74c3c",
            border: "none",
            borderRadius: 4,
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onClick={() => onLogout()}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

function CourseGrid() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  if (!username) {
  alert("User not logged in.");
  navigate("/");
  }
  useEffect(() => {
    fetch(`http://localhost:5001/api/fav/get/${username}`)
      .then((res) => {
        if (!res.ok) throw new Error(res.message);
        return res.json();
      })
      .then((data) => {
        setCourses(data.favCourses);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Unknown error");
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Loading courses...</p>;
  if (error) return <p style={{ padding: 20, color: "red" }}>Error: {error}</p>;


  return (
    <>
    <h1 style={{textAlign: "center", fontStyle:"italic"}}>Your Favourite Courses</h1>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 20,
        padding: 20,
      }}
    >
      {courses && courses.map((course) => (
        <div
          key={course.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 10,
            textAlign: "center",
          }}
        >
          <a href={course.link} target="_blank"><img
            src={course.image}
            alt={course.title}
            style={{ width: "100%", height:"420px", borderRadius: 6, marginBottom: 10 }}
          /></a>
          <h3>{course.title}</h3>
        </div>
      ))}
    </div>
    </>
  );
}

export default function Favourites() {
  return (
    <div>
      <Navbar />
      <CourseGrid />
    </div>
  );
}

