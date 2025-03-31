import React, { useEffect, useState, useContext } from "react";  // ⭐ Import useContext
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils.js";
import { AuthContext } from "../context/AuthContext";  // ⭐ Import AuthContext

function Login() {
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);  // ⭐ Use context login function

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/portfolio");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError("Email and Password required");
    }
    try {
      const BASE_URL = "https://loginsignupbackend-dz69.onrender.com";
      const url = `${BASE_URL}/auth/login`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo),
      });
      const result = await res.json();
      const { success, message, error, jwtToken, name } = result;

      if (success) {
        handleSuccess(message);
        login(jwtToken, name);  // ⭐ Use AuthContext login function instead of localStorage
        setTimeout(() => {
          navigate("/portfolio");
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
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-lg font-medium">
              Email
            </label>
            <input
              onChange={handleChange}
              type="email"
              value={loginInfo.email}
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
              value={loginInfo.password}
              name="password"
              placeholder="Enter Your Password"
              className="w-full text-lg p-2 border-b border-gray-400 outline-none focus:border-purple-500"
            />
          </div>
          <button className="bg-purple-600 text-white text-lg font-medium rounded-md py-2 mt-4 hover:bg-purple-700 transition-all">
            Login
          </button>
          <span className="text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-purple-600 font-semibold hover:underline">
              Signup
            </Link>
          </span>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Login;
