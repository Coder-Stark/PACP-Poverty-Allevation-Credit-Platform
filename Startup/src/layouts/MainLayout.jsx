import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'

function MainLayout() {
  return (
    <>
        <Navbar/>
        <main>
            <Outlet/>            {/*this will render the  current route's page */}
        </main>
        <Footer/>
    </>
  )
}

export default MainLayout