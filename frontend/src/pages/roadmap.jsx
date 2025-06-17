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

function AIRoadmap(){
    const [result, setResult] = useState(null);
    const [subject, setSubject] = useState('');

    const generate = async ()=>{
        if(!subject){
            alert("Fill the subject field");
            return;
        }
        try{
            const response = await fetch("http://localhost:5001/api/ai/roadmap",{
                method: 'POST',
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify({subject})
            });
            const data = await response.json();
            if(response.ok){
                setResult(data);
            }else{
                alert(data.error || "Error");
            }
        }catch(err){
            alert(`Error: ${err}`);
        }
    }

    return(
        <div style={{
            margin: "auto",
            padding: 20,
            color: "white"
        }}>
            <h1 style={{textAlign:"center"}}>Roadmap Generator</h1>
            <input
                placeholder="Enter the subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{ width: "100%", marginBottom: 10, padding: 8, marginRight: "20px" }}
            />
            <button onClick={generate} style={{ padding: "10px 20px", backgroundColor: "lightgreen", borderRadius: "10px", marginLeft:"43%"}}>Generate Roadmap</button>
            {result && (
                    <div style={{
                        marginTop: 20,
                        border: "2px solid black",
                        width: "100%",
                        maxWidth: "880px",
                        marginLeft: "250px",
                        padding: "20px",
                        boxShadow: "1px 6px gray",
                        backgroundColor: "rgba(128,128,128,0.5)"
                    }}>
                        <h2 style={{textAlign:"center"}}>The Roadmap for {subject}</h2>
                        <br></br>
                        <hr></hr>
                        <br></br>
                        <pre>{result.text1}</pre>
                        <br>
                        </br>
                        <a href={result.text2} style={{color:"rgb(0, 119, 255)"}} target="_blank">Click this for learning {subject}</a>
                        <hr/>
                    </div>
            )}
        </div>
    )
}

export default function Roadmap() {
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
      <AIRoadmap />
    </div>
  );
}

