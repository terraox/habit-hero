import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Sidebar(){
  return (
    <div className="w-60 p-4 bg-surface border-r border-muted/20 min-h-screen flex flex-col">
      <div className="mb-8 flex justify-center">
        {/* Placeholder for logo - ensure it's visible in both themes */}
        <div className="text-2xl font-bold text-primary">HabitHero</div>
      </div>
      <nav className="flex flex-col gap-2">
        <NavLink to="/" className={({isActive})=> `px-4 py-2 rounded-md transition-colors ${isActive ? 'bg-primary text-white' : 'text-muted hover:bg-muted/10 hover:text-text'}`}>Dashboard</NavLink>
        <NavLink to="/users" className={({isActive})=> `px-4 py-2 rounded-md transition-colors ${isActive ? 'bg-primary text-white' : 'text-muted hover:bg-muted/10 hover:text-text'}`}>Users</NavLink>
        <NavLink to="/habits" className={({isActive})=> `px-4 py-2 rounded-md transition-colors ${isActive ? 'bg-primary text-white' : 'text-muted hover:bg-muted/10 hover:text-text'}`}>Habits</NavLink>
        <NavLink to="/coupons" className={({isActive})=> `px-4 py-2 rounded-md transition-colors ${isActive ? 'bg-primary text-white' : 'text-muted hover:bg-muted/10 hover:text-text'}`}>Coupons</NavLink>
      </nav>
    </div>
  )
}
