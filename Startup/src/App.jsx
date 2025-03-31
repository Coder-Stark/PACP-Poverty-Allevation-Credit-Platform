import React from 'react'
import { AuthContextProvider } from './context/AuthContext';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home'
import Services from './pages/Services'
// import Schemes from './pages/Schemes'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import Login from './pages/Login';
import Signup from './pages/Signup';
import PortFolio from './pages/PortFolio';

function App() {
  return (
    <>
      <AuthContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<MainLayout/>}>
              <Route index element={<Home />} />              {/* Default route */}
              <Route path='/home' element={<Home/>}/>
              <Route path='/services' element={<Services/>}/>
              {/* <Route path='/schemes' element={<Schemes/>}/> */}
              <Route path='/about' element={<AboutUs/>}/>
              <Route path='/contact' element={<ContactUs/>}/>
              <Route path='/portfolio' element={<PortFolio/>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/signup' element={<Signup />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </>
  )
}

export default App