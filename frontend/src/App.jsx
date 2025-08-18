import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './AdminPanel/Dashboard/Dashboard'
import AdminLayout from './AdminPanel/AdminLayout'
import PublicLayout from './Components/PublicLayout'
import Home from './Components/HomePage/Home'
import Landing from './Components/LandingPage/Landing'
import Signup from './Components/SignupPage/Signup'
import Login from './Components/Login Page/Login'
import UserManagement from './AdminPanel/Usermanagement/UserManagement'
import SocialMediaHome from './Components/HomePage/SocialMediaHome'
import { AuthProvider } from './ContextApi/AuthContext'
import { UserProvider } from './ContextApi/UserContext'
import './app.css';

function App() {
  return (
    <BrowserRouter>
    {/* <AuthProvider> */}
    
      <UserProvider>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/social" element={<SocialMediaHome/>} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<UserManagement/>} />
        </Route>
      </Routes>
      </UserProvider>
      {/* </AuthProvider> */}
     
    </BrowserRouter>
  )
}

export default App
