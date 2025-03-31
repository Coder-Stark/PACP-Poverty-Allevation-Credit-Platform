import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function PortFolio() {
  const [user, setUser] = useState("");
  const navigate = useNavigate();
  
  useEffect(()=>{
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("loggedInUser");

    if(!token) navigate("/login");
    else setUser(name);
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user}!</h1>
      <p className="text-lg text-gray-700">Your financial stats will appear here in the future.</p>
    </div>
  )
}

export default PortFolio