import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Flame } from 'lucide-react';
import { api } from '../lib/api';
import { toast } from 'react-toastify';
import clsx from 'clsx';

export default function HabitCard({ habit, onUpdate, onClick }) {
  const [loading, setLoading] = useState(false);
  
  const todayStr = new Date().toISOString().split('T')[0];
  const isDone = habit.doneDates && habit.doneDates.includes(todayStr);
  
  // Calculate streak (simple version, backend does better)
  const streak = habit.doneDates ? habit.doneDates.length : 0;

  const handleToggle = async (e) => {
    e.stopPropagation();
    if (loading) return;

    setLoading(true);
    try {
      let updatedHabit;
      if (isDone) {
        updatedHabit = await api.post(`/api/habits/${habit.id}/unmark`, { date: todayStr });
      } else {
        updatedHabit = await api.post(`/api/habits/${habit.id}/mark`, { date: todayStr });
      }
      onUpdate(updatedHabit);
    } catch (error) {
      console.error('Toggle failed', error);
      toast.error('Failed to update habit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Generate a consistent color based on habit ID or title if not provided
  const colors = [
    'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 
    'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 
    'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500', 
    'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'
  ];
  const colorClass = habit.color || colors[(habit.id || 0) % colors.length];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick && onClick(habit)}
      className="group relative flex flex-col justify-between p-4 rounded-2xl bg-surface border border-white/5 dark:border-white/10 cursor-pointer overflow-hidden"
    >
      {/* Background Glow */}
      <div className={clsx(
        "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500",
        colorClass
      )} />

      <div className="flex justify-between items-start mb-4">
        <div className={clsx(
          "w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-lg",
          colorClass
        )}>
          {habit.icon || habit.title.charAt(0).toUpperCase()}
        </div>
        
        <button
          onClick={handleToggle}
          disabled={loading}
          className={clsx(
            "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
            isDone ? colorClass : "bg-white/10 hover:bg-white/20"
          )}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
          ) : (
            <Check size={16} className={isDone ? "text-white" : "text-muted"} strokeWidth={3} />
          )}
        </button>
      </div>

      <div>
        <h3 className="font-bold text-lg text-text mb-1 truncate">
          {habit.title}
        </h3>
        <div className="flex items-center gap-1 text-xs text-muted">
          <Flame size={12} className={streak > 0 ? "text-orange-500" : "text-muted"} />
          <span>{streak} completions</span>
        </div>
      </div>
      
      {/* Mini Heatmap (Visual only for now) */}
      <div className="flex gap-1 mt-4 opacity-50">
        {[...Array(7)].map((_, i) => (
          <div key={i} className={clsx(
            "h-1 flex-1 rounded-full",
            // Mock logic for visual flair - in real app use actual history
            Math.random() > 0.5 ? colorClass : "bg-white/10"
          )} />
        ))}
      </div>
    </motion.div>
  );
}
