import { useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import ThemeContext from "../context/ThemeContext";
import { Sun, Moon } from 'lucide-react';

function Navbar() {
  const {isLoggedIn, role, logout} = useContext(AuthContext);
  const {theme, toggleTheme} = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = ()=>{
    logout();
    navigate("/login");
  }
  return (
    <header className="sticky top-0 text-black bg-purple-200 shadow-md z-50">
      <div className="container mx-auto flex flex-wrap p-2 items-center md:flex-row relative">
        
        {/* Logo*/}
        <div className="flex items-center justify-center w-full md:w-auto md:justify-start">
          <Link to="/" className="flex items-center">
            <img 
              src="https://raw.githubusercontent.com/Coder-Stark/assets/refs/heads/master/newlogo.png" 
              alt="Logo" 
              className="w-12 h-12 rounded-full shadow-lg"
            />
          </Link>
          <span className="text-xl text-black ml-2 md:ml-3 text-center md:text-left">PACP</span>
        </div>

        {/* Navigation Links (Centered on All Screens) */}
        <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-lg justify-center w-full md:w-auto mt-2 md:mt-0">
          <Link to="/home" className="sm:mx-3 lg:mx-8 hover:underline hover:bg-purple-300 rounded-lg px-3 py-1 transition duration-300">Home</Link>
          <Link to="/services" className="sm:mx-3 lg:mx-8 hover:underline hover:bg-purple-300 rounded-lg px-3 py-1 transition duration-300">Services</Link>
          <Link to="/about" className="sm:mx-3 lg:mx-8 hover:underline hover:bg-purple-300 rounded-lg px-3 py-1 transition duration-300">About</Link>
          <Link to="/contact" className="sm:mx-3 lg:mx-8 hover:underline hover:bg-purple-300 rounded-lg px-3 py-1 transition duration-300">Contact</Link>

          {/* Show MyPortFolio if logged in  */}
          {isLoggedIn && role && (
            role === "admin" ? (
              <Link to="/admin/dashboard" className="sm:mx-3 lg:mx-8 hover:underline hover:bg-purple-300 rounded-lg px-3 py-1 transition duration-300">
                Admin Dashboard
              </Link>
            ) : (
              <Link to="/portfolio" className="sm:mx-3 lg:mx-8 hover:underline hover:bg-purple-300 rounded-lg px-3 py-1 transition duration-300">
                My Portfolio
              </Link>
            )
          )}
        </nav>

        {/* Button Container */}
        <div className="absolute top-2 right-4 md:static md:ml-auto flex items-center gap-2">

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="text-purple-500 hover:text-purple-600 transition duration-300 cursor-pointer"
          >
            <span title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}>
              {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
            </span>
          </button>

          {/* Login / Logout Button */}
          {
            isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white sm:px-4 sm:py-2 px-2 py-1 text-sm sm:text-base rounded-lg flex items-center gap-2 hover:bg-red-600 transition duration-300 cursor-pointer"
              >
                LogOut →
              </button>
            ) : (
              <Link to="/login">
                <button className="bg-purple-500 text-white sm:px-4 sm:py-2 px-2 py-1 text-sm sm:text-base rounded-lg flex items-center gap-2 hover:bg-purple-600 transition duration-300 cursor-pointer">
                  Login →
                </button>
              </Link>
            )
          }
        </div>
        
      </div>
    </header>
  );
}

export default Navbar;
