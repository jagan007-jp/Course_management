import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const onLogout = ()=>{
    localStorage.removeItem("username");
    navigate("/");
    alert("Logged out");
  }
  return(
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 20px",
        backgroundColor: "#333",
        color: "white",
        fontWeight: "bold",
        position: "relative",
        borderRadius: "10px",
        backgroundImage: "linear-gradient(to bottom right, black, rgb(124, 33, 0), black, rgb(124, 33, 0), black)",
        border: "1px solid gray"
      }}
    >
      <div style={{ display: "flex", gap: 20, flex: 1, color: "rgb(215, 71, 18)" }}>
        <a href="/home" style={{ color: "white", textDecoration: "none" }}>
          Home
        </a>
        <a href="/favourites" style={{ color: "white", textDecoration: "none" }}>
          Favourites
        </a>
        <a href="/roadmap" style={{ color: "white", textDecoration: "none" }}>
          Learning roadmap
        </a>
      </div>
      <div style={{
        fontSize: "x-large",
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        whiteSpace: "nowrap"
      }}>
        Simple Learning App
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, justifyContent: "flex-end" }}>
        <img
          src="https://t3.ftcdn.net/jpg/07/24/59/76/360_F_724597608_pmo5BsVumFcFyHJKlASG2Y2KpkkfiYUU.jpg"
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
            backgroundColor: "rgba(128, 128, 128, 0.4)"
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
    <div 
      style={{backgroundImage:"url('https://media.istockphoto.com/id/1411847689/vector/abstract-black-background-with-neon-light-lines.jpg?s=612x612&w=0&k=20&c=pt7FvjoR38enTYy8nKGHblyeOrdCMlwlTWjDZ9dOLis=')",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      minHeight: "100vh",
      borderRadius:"10px"
    }}>
      <Navbar />
      <CourseGrid />
    </div>
  );
}

