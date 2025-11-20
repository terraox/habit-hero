import React from 'react';
import useTheme from '../hooks/useTheme';
import { Sun, Moon, User } from 'lucide-react';

export default function TopBar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-md border-b border-border p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Habit Hero
      </h1>
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-bg transition-colors text-text"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
          <User size={18} />
        </div>
      </div>
    </header>
  );
}
