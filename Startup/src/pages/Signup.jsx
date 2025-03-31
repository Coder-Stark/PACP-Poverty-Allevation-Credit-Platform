import React, { useState, useContext } from "react";  // ⭐ Import useContext
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils.js";
import { AuthContext } from "../context/AuthContext";  // ⭐ Import AuthContext

function Signup() {
  const [signupInfo, setSignupInfo] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);  // ⭐ Use context login function

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;
    if (!name || !email || !password) {
      return handleError("Name, Email, and Password required");
    }
    try {
      const BASE_URL = "https://loginsignupbackend-dz69.onrender.com";
      const url = `${BASE_URL}/auth/signup`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupInfo),
      });
      const result = await res.json();
      const { success, message, error, jwtToken } = result;

      if (success) {
        handleSuccess(message);
        login(jwtToken, name);  // ⭐ Automatically log in the user using AuthContext
        setTimeout(() => {
          navigate("/portfolio");  // ⭐ Redirect to portfolio directly
        }, 1000);
      } else {
        handleError(error?.details?.[0]?.message || message);
      }
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Signup</h1>
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="name" className="text-lg font-medium">
              Name
            </label>
            <input
              onChange={handleChange}
              type="text"
              value={signupInfo.name}
              name="name"
              autoFocus
              placeholder="Enter Your Name"
              className="w-full text-lg p-2 border-b border-gray-400 outline-none focus:border-purple-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="text-lg font-medium">
              Email
            </label>
            <input
              onChange={handleChange}
              type="email"
              value={signupInfo.email}
              name="email"
              placeholder="Enter Your Email"
              className="w-full text-lg p-2 border-b border-gray-400 outline-none focus:border-purple-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="text-lg font-medium">
              Password
            </label>
            <input
              onChange={handleChange}
              type="password"
              value={signupInfo.password}
              name="password"
              placeholder="Enter Your Password"
              className="w-full text-lg p-2 border-b border-gray-400 outline-none focus:border-purple-500"
            />
          </div>
          <button className="bg-purple-600 text-white text-lg font-medium rounded-md py-2 mt-4 hover:bg-purple-700 transition-all">
            Signup
          </button>
          <span className="text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-600 font-semibold hover:underline">
              Login
            </Link>
          </span>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Signup;
