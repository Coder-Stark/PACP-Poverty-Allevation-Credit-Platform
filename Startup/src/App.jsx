import React from 'react'
import { AuthContextProvider } from './context/AuthContext';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from "react-toastify";

import MainLayout from './layouts/MainLayout';
import Home from './pages/Home'
import Services from './pages/Services'
// import Schemes from './pages/Schemes'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'

import PortFolio from './pages/PortFolio';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

import AdminDashboard from './pages/adminView/AdminDashboard';
import ManageUsers from './pages/adminView/ManageUsers';
import FinanceOverview from './pages/adminView/FinanceOverview';

import AdminUserProfile from './pages/adminView/AdminUserProfile';

function App() {
  return (
    <>
      <AuthContextProvider>
        <BrowserRouter>
        <ToastContainer position='top-right' />
          <Routes>
            <Route path='/' element={<MainLayout/>}>
              <Route index element={<Home />} />              {/* Default route */}
              <Route path='/home' element={<Home/>}/>
              <Route path='/services' element={<Services/>}/>
              {/* <Route path='/schemes' element={<Schemes/>}/> */}
              <Route path='/about' element={<AboutUs/>}/>
              <Route path='/contact' element={<ContactUs/>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/signup' element={<Signup />} />

              {/* User routes  */}
              <Route path='/portfolio' element={<PortFolio/>}/>

              {/* admin routes  */}
              <Route path='/admin/dashboard' element={<AdminDashboard/>} />
              <Route path='/admin/manage-users' element={<ManageUsers />} />
              <Route path='/admin/finance-overview' element={<FinanceOverview/>} />
              <Route path='/admin/user/:id' element={<AdminUserProfile />}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </>
  )
}

export default App