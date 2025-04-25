import React, { useContext, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'
import ThemeContext from '../context/ThemeContext'

function MainLayout() {
  const {theme} = useContext(ThemeContext);
  useEffect(()=>{
    if(theme === 'dark'){
      document.body.classList.add('dark');
    }else{
      document.body.classList.remove('dark');
    }
  }, [theme]);
  
  return (
    <div className={theme}>
      <Navbar/>
      <main>
          <Outlet/>            {/*this will render the  current route's page */}
      </main>
      <Footer/>
    </div>
  )
}

export default MainLayout