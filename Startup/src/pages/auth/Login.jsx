import React, { useEffect, useState, useContext } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../../utils.js";
import { AuthContext } from "../../context/AuthContext.jsx"; 

function Login() {
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
  const [showWarning, setShowWarning] = useState(false);
  const [timer, setTimer] = useState(45);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);  //Use context login function

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if(token){
      navigate(role === "admin" ? "/admin/dashboard" : "/portfolio");
    }
  }, [navigate]);

  //timer countdown effect
  useEffect(()=>{
    let interval;
    if(showWarning && timer > 0){
      interval = setInterval(() => {
        setTimer((prev)=> prev-1);
      }, 1000);
    }
    return ()=> clearInterval(interval);
  }, [showWarning, timer]);

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

    setShowWarning(true);
    setTimer(45);

    try {
      const BASE_URL = import.meta.env.VITE_BACKEND_URL;
      const url = `${BASE_URL}/auth/login`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password}),
      });
      const result = await res.json();
      // console.log(result);
      const { success, message, error, jwtToken, name, role } = result;

      if (success) {
        handleSuccess(message);
        setShowWarning(false);
        login(jwtToken, name, role);  //Use AuthContext login function instead of localStorage
        setTimeout(() => {
          if(role === "admin"){
            navigate("/admin/dashboard");
          }else{
            navigate("/portfolio");
          }
        }, 1000);
      } else {
        setShowWarning(false);
        handleError(error?.details?.[0]?.message || message);
      }
    } catch (err) {
      setShowWarning(false);
      handleError(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="border border-gray-300 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        {/* Added: Warning message with timer */}
        {showWarning && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700 font-medium">
                  Server is waking up...
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  The server may take up to 45 seconds to respond after inactivity. Please wait... (<span className="font-bold">{timer}</span> seconds)
                </p>
              </div>
            </div>
          </div>
        )}

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
          <button className="bg-purple-600 text-white text-lg font-medium rounded-md py-2 mt-4 hover:bg-purple-700 transition-all cursor-pointer">
            Login
          </button>
          <span className="text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-purple-600 font-semibold hover:underline">
              Signup
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
}

export default Login;
