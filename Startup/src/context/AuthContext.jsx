import { createContext, useEffect, useState } from "react";


const AuthContext = createContext();

function AuthContextProvider({children}){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(()=>{
        const token = localStorage.getItem("token");
        const loggedInUser = localStorage.getItem("loggedInUser");

        if(token){
            setIsLoggedIn(true);
            setUser(loggedInUser);
        }
    }, []);

    function login(token, name){
        localStorage.setItem("token", token);
        localStorage.setItem("loggedInUser", name);
        setIsLoggedIn(true);
        setUser(name);
    }

    function logout(){
        localStorage.removeItem("token");
        localStorage.removeItem("loggedInUser");
        setIsLoggedIn(false);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{isLoggedIn, user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )   
}

export {AuthContext, AuthContextProvider};
export default AuthContext;