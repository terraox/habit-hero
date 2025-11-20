import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import useTheme from './hooks/useTheme';
import Login from './pages/Login';
import Home from './pages/Home';
import Habits from './pages/Habits';
import CalendarPage from './pages/Calendar';
import Settings from './pages/Settings';
import { AuthProvider, useAuth } from './context/AuthContext';

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-background text-muted">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function Layout({ children }) {
  return (
    <div className="min-h-screen pb-24 bg-background text-text transition-colors duration-300 font-sans">
      <TopBar />
      <main className="p-4 max-w-lg mx-auto pt-4">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

export default function App() {
  useTheme();

  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <RequireAuth>
            <Layout><Home /></Layout>
          </RequireAuth>
        } />
        <Route path="/habits" element={
          <RequireAuth>
            <Layout><Habits /></Layout>
          </RequireAuth>
        } />
        <Route path="/calendar" element={
          <RequireAuth>
            <Layout><CalendarPage /></Layout>
          </RequireAuth>
        } />
        <Route path="/settings" element={
          <RequireAuth>
            <Layout><Settings /></Layout>
          </RequireAuth>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer position="bottom-center" theme="colored" hideProgressBar />
    </AuthProvider>
  );
}
