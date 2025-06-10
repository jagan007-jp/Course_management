import { Route, Routes } from "react-router-dom";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import Home from "./pages/home.jsx";
import Favourites from "./pages/favourites.jsx";

export default function App(){
  return(
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />}/>
      <Route path="/home" element={<Home />}/>
      <Route path="/favourites" element={<Favourites />}/>
    </Routes>
  )
}