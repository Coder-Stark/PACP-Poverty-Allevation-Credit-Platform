import {createContext, useState, useEffect} from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({children})=>{
    const [theme, setTheme] = useState('dark');

    useEffect(()=>{
        const savedTheme = localStorage.getItem('theme');
        if(savedTheme){
            setTheme(savedTheme);
        }else{
            setTheme('dark');    //default theme is dark
            localStorage.setItem('theme', 'dark');    //save dark as default
        }
    }, []);

    const toggleTheme = ()=>{
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    }

    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeContext;