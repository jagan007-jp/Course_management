import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCallback } from "react";

function Navbar() {
  const user = useSelector((state)=> state.user.user);
  const username = user?.username;
  useEffect(()=>{
    if(username){
        localStorage.setItem("username",username);
    }
  },[username]);
  
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
      <div style={{ display: "flex", gap: 20, flex: 1 }}>
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
  const [page, setPage] = useState(1);
  const limit = 6;
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  useEffect(()=>{
    if (!username) {
        alert("User not logged in.");
        navigate("/");
    }
  },[navigate]);
  
  
  const fetchCourses = useCallback(async()=>{
    try{
        setLoading(true);
        const offset = (page-1)*limit;
        const res = await fetch(`http://localhost:5001/api/home/courses?limit=${limit}&offset=${offset}`);
        if(!res.ok) throw new Error(res.message);
        const data = await res.json();
        if(!data.courses || !data || !Array.isArray(data.courses)||data.courses.length===0){
            setHasMore(false);
            setLoading(false);
            return;
        }
        setCourses(prevCourses => {
            const existingIds = new Set(prevCourses.map(course => course.id))
            const newCourses = data.courses.filter(course => !existingIds.has(course.id))
            return [...prevCourses,...newCourses]
        });
        setLoading(false);
    }catch(err){
        setError(err.message||"Error occured");
        setLoading(false);
    }
  },[page]);

  useEffect(()=>{
    fetchCourses()
  },[fetchCourses]);

  useEffect(()=>{
    const handleScroll = ()=>{
        if(window.innerHeight + window.scrollY >= document.body.scrollHeight - 10 && !loading && hasMore){
            setPage(prev => prev + 1);
        }
    }
    window.addEventListener("scroll",handleScroll);
    return ()=>window.removeEventListener("scroll",handleScroll);
  },[loading,hasMore]);


  if (loading && courses.length === 0) return <p style={{ padding: 20 }}>Loading courses...</p>;
  if (error) return <p style={{ padding: 20, color: "red" }}>Error: {error}</p>;

  const handleFav = async (course)=>{
    const res = await fetch("http://localhost:5001/api/fav/add",{
        method: 'POST',
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({id: course.id, title: course.title, image: course.image, link: course.link,username: username})
    })
    const data = await res.json();
    if(data){
        alert(data.message);
    }else{
        alert("Error adding data");
    }
  }

  function mouseOver(e){
    e.target.style.boxShadow = "2px 2px gray"
  }

  function mouseOut(e){
    e.target.style.boxShadow = "None"
  }

  return (
    <>
    <h1 style={{textAlign: "center", fontStyle:"italic"}}>Available Courses</h1>
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
            style={{ width: "100%", height:"420px", borderRadius: 6, marginBottom: 10, backgroundColor:"white" }}
            onMouseOver={mouseOver}
            onMouseOut={mouseOut}
          /></a>
          <h3 style={{color:"white"}}>{course.title}</h3>
          <button
            style={{
              padding: "8px 16px",
              borderRadius: 5,
              border: "none",
              backgroundColor: "#3498db",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
              marginTop: 10,
            }}
            onClick={() => handleFav(course)}
            onMouseOver={mouseOver}
            onMouseOut={mouseOut}
          >
            Add to Favourites
          </button>
        </div>
      ))}
    </div>
    </>
  );
}

export default function App() {
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
