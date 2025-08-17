import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './AdminPanel/Dashboard/Dashboard'
import AdminLayout from './AdminPanel/AdminLayout'
import PublicLayout from './Components/PublicLayout'
import Home from './Components/HomePage/Home'
import Landing from './Components/LandingPage/Landing'
import Signup from './Components/SignupPage/Signup'
import Login from './Components/Login Page/Login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing/>} />
           <Route path="/signup" element={<Signup/>} />
           <Route path="/login" element={<Login/>} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
