import React, { useState, useContext } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../../utils.js";
import { AuthContext } from "../../context/AuthContext.jsx"; 

function Signup() {
  const [signupInfo, setSignupInfo] = useState({ name: "", email: "", password: "", phone: "", role: "user", adminPassword: ""});
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);  //Use context login function

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password, phone, role, adminPassword} = signupInfo;
    
    if (!name || !email || !password || !phone) {
      return handleError("All fields are required.");
    }

    const payload = {name, email, password, phone, role};

    // Only add adminPassword if role is "admin"
    if (role === "admin") {
        if (!adminPassword) {
            return handleError("Admin password is required");
        }
        payload.adminPassword = adminPassword;
    }

    try {
      const BASE_URL = import.meta.env.VITE_BACKEND_URL;
      const url = `${BASE_URL}/auth/signup`;

      const res = await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      // console.log(result);
      const { success, message, error, jwtToken, role } = result;

      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        handleError(error?.details?.[0]?.message || message);
      }
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="border border-gray-300 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Signup</h1>
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          
          {/* Name Field  */}
          <div className="flex flex-col">
            <label htmlFor="name" className="text-lg font-medium">
              Name
            </label>
            <input
              onChange={handleChange} value={signupInfo.name} 
              type="text" name="name" autoFocus placeholder="Enter Your Name" className="w-full text-lg p-2 border-b border-gray-400 outline-none focus:border-purple-500"
            />
          </div>

          {/* Email Field  */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-lg font-medium">
              Email
            </label>
            <input
              onChange={handleChange} value={signupInfo.email} 
              type="email" name="email" placeholder="Enter Your Email" className="w-full text-lg p-2 border-b border-gray-400 outline-none focus:border-purple-500"
            />
          </div>

          {/* Password Field  */}
          <div className="flex flex-col">
            <label htmlFor="password" className="text-lg font-medium">
              Password
            </label>
            <input
              onChange={handleChange} value={signupInfo.password} 
              type="password" name="password" placeholder="Enter Your Password" className="w-full text-lg p-2 border-b border-gray-400 outline-none focus:border-purple-500"
            />
          </div>

          {/* Phone Field  */}
          <div className="flex flex-col">
            <label htmlFor="phone" className="text-lg font-medium">
              Phone
            </label>
            <input
              onChange={handleChange}
              value={signupInfo.phone} type="phone" name="phone" placeholder="Enter Your Phone number" className="w-full text-lg p-2 border-b border-gray-400 outline-none focus:border-purple-500"
            />
          </div>

          {/* Role Selection */}
          <div className="flex flex-col">
            <label className="text-lg font-medium">Select Role:</label>
            <div className="flex gap-4">
              <label>
                <input type="radio" name="role" value="user" checked={signupInfo.role === "user"} onChange={handleChange} />
                <span className="ml-2">User</span>
              </label>
              <label>
                <input type="radio" name="role" value="admin" checked={signupInfo.role === "admin"} onChange={handleChange} />
                <span className="ml-2">Admin</span>
              </label>
            </div>
          </div>

          {/* Admin Password Field (Conditional) */}
          {signupInfo.role === "admin" && (
            <div className="flex flex-col">
              <label htmlFor="adminPassword" className="text-lg font-medium">Admin Password</label>
              <input onChange={handleChange} value={signupInfo.adminPassword} 
              type="password"  name="adminPassword" placeholder="Enter Admin Password" className="w-full text-lg p-2 border-b border-gray-400 outline-none focus:border-purple-500"/>
            </div>
          )}

          {/* Signup Button  */}
          <button className="bg-purple-600 text-white text-lg font-medium rounded-md py-2 mt-4 hover:bg-purple-700 transition-all cursor-pointer">
            Signup
          </button>

          <span className="text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-600 font-semibold hover:underline">
              Login
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
}

export default Signup;
