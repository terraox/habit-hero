import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, List, Calendar, Settings } from 'lucide-react';
import clsx from 'clsx';

export default function BottomNav() {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/habits', icon: List, label: 'Habits' },
    { to: '/calendar', icon: Calendar, label: 'Calendar' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-lg border-t border-white/10 pb-safe pt-2 px-6 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center gap-1 p-2 transition-colors duration-200',
                isActive ? 'text-primary' : 'text-muted hover:text-text'
              )
            }
          >
            <Icon size={24} strokeWidth={2.5} />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
