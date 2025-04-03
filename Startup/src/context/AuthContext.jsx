import { createContext, useEffect, useState } from "react";


const AuthContext = createContext();

function AuthContextProvider({children}){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(()=>{
        const token = localStorage.getItem("token");
        const loggedInUser = localStorage.getItem("loggedInUser");
        const userRole = localStorage.getItem("role");

        if(token){
            setIsLoggedIn(true);
            setUser(loggedInUser);
            setRole(userRole);
        }
    }, []);

    function login(token, name, role){
        localStorage.setItem("token", token);
        localStorage.setItem("loggedInUser", name);
        localStorage.setItem("role", role);
        setIsLoggedIn(true);
        setUser(name);
        setRole(role);
    }

    function logout(){
        localStorage.removeItem("token");
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("role");
        setIsLoggedIn(false);
        setUser(null);
        setRole(null);
    }

    return (
        <AuthContext.Provider value={{isLoggedIn, user, role, login, logout}}>
            {children}
        </AuthContext.Provider>
    )   
}

export {AuthContext, AuthContextProvider};
export default AuthContext;