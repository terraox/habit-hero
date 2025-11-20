import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem('auth');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (auth) {
      // Set default auth header for all requests
      const token = btoa(`${auth.email}:${auth.password}`);
      axios.defaults.headers.common['Authorization'] = `Basic ${token}`;
      localStorage.setItem('auth', JSON.stringify(auth));
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('auth');
    }
  }, [auth]);

  const login = async (email, password) => {
    // Verify credentials by calling an endpoint (e.g. dashboard)
    const token = btoa(`${email}:${password}`);
    try {
      await axios.get('/admin/dashboard', {
        headers: { Authorization: `Basic ${token}` }
      });
      setAuth({ email, password });
      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  const logout = () => {
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
