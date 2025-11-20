import React from 'react'
import { useTheme } from '../context/ThemeContext'

export default function Topbar(){
  const logout = ()=>{ localStorage.removeItem('hh_token'); window.location.href='/login' }
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex items-center justify-between mb-6 bg-surface p-4 rounded-lg shadow-sm">
      <h1 className="text-2xl font-semibold text-text">Habit Hero Admin</h1>
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme} 
          className="btn btn-ghost text-text flex items-center gap-2"
          aria-label="Toggle theme"
          aria-pressed={theme === 'dark'}
        >
          <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
          <span className="hidden sm:inline">{theme === 'dark' ? 'Dark' : 'Light'}</span>
        </button>
        <button onClick={logout} className="btn btn-ghost text-muted hover:text-text">Logout</button>
      </div>
    </div>
  )
}
