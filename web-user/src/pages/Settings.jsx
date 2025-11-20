import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, LogOut, User } from 'lucide-react';
import useTheme from '../hooks/useTheme';

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h2>
      
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
            <User size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white">{user?.name || 'User'}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
            <button 
                onClick={toggleTheme}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
                <div className="flex items-center space-x-3">
                    {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                    <span className="font-medium">Dark Mode</span>
                </div>
                <div className={`w-10 h-6 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-blue-500' : 'bg-slate-300'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
            </button>
            
            <button 
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
                <LogOut size={20} />
                <span className="font-medium">Log Out</span>
            </button>
        </div>
      </div>
    </div>
  );
}
