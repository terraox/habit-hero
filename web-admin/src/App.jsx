import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Coupons from './pages/Coupons'
import Habits from './pages/Habits'
import Topbar from './components/Topbar'
import Sidebar from './components/Sidebar'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

function RequireAuth({ children }){
  const { auth } = useAuth()
  if(!auth) return <Navigate to='/login' replace />
  return children
}

function Layout() {
  return (
    <div className="min-h-screen flex bg-bg text-text transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <Topbar />
        <Routes>
          <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/users" element={<RequireAuth><Users /></RequireAuth>} />
          <Route path="/coupons" element={<RequireAuth><Coupons /></RequireAuth>} />
          <Route path="/habits" element={<RequireAuth><Habits /></RequireAuth>} />
        </Routes>
      </div>
    </div>
  )
}

export default function App(){
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<Layout />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}
