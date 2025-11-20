import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useHabits } from '../hooks/useHabits';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { api } from '../lib/api';
import { toast } from 'react-toastify';
import { Check } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const { data: habits } = useHabits();
  const queryClient = useQueryClient();
  const [loadingHabitId, setLoadingHabitId] = useState(null);

  // Helper to get completion status for a date
  const getTileContent = ({ date, view }) => {
    if (view !== 'month' || !habits) return null;
    
    const dateStr = date.toISOString().split('T')[0];
    const completedCount = habits.filter(h => h.doneDates && h.doneDates.includes(dateStr)).length;
    
    if (completedCount === 0) return null;
    
    return (
      <div className="flex justify-center mt-1">
        <div className={clsx(
          "w-1.5 h-1.5 rounded-full",
          completedCount >= 3 ? "bg-green-500" : "bg-blue-500"
        )}></div>
      </div>
    );
  };

  const selectedDateStr = date.toISOString().split('T')[0];
  
  const handleToggle = async (habit) => {
    if (loadingHabitId) return;
    setLoadingHabitId(habit.id);
    
    const isDone = habit.doneDates && habit.doneDates.includes(selectedDateStr);
    
    try {
      if (isDone) {
        await api.post(`/api/habits/${habit.id}/unmark`, { date: selectedDateStr });
      } else {
        await api.post(`/api/habits/${habit.id}/mark`, { date: selectedDateStr });
      }
      queryClient.invalidateQueries(['habits']);
    } catch (error) {
      console.error('Failed to toggle habit', error);
      toast.error('Failed to update habit');
    } finally {
      setLoadingHabitId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-text">Calendar</h2>
      
      <div className="bg-surface rounded-2xl p-4 shadow-sm border border-white/5 calendar-wrapper">
        <Calendar 
          onChange={setDate} 
          value={date} 
          tileContent={getTileContent}
          className="w-full border-none bg-transparent text-text font-sans"
        />
      </div>

      <div className="bg-surface rounded-2xl p-6 shadow-sm border border-white/5">
        <h3 className="font-bold text-text mb-4">
          {date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
        </h3>
        
        <div className="space-y-3">
          {habits?.map(h => {
            const isDone = h.doneDates && h.doneDates.includes(selectedDateStr);
            const colorClass = h.color || 'bg-blue-500';
            
            return (
              <div 
                key={h.id} 
                onClick={() => handleToggle(h)}
                className="flex items-center justify-between p-3 rounded-xl bg-background border border-white/5 cursor-pointer hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={clsx(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold",
                    colorClass
                  )}>
                    {h.icon || h.title.charAt(0)}
                  </div>
                  <span className={clsx("font-medium", isDone ? "text-text" : "text-muted")}>
                    {h.title}
                  </span>
                </div>
                
                <div className={clsx(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                  isDone ? "bg-primary border-primary" : "border-muted"
                )}>
                  {loadingHabitId === h.id ? (
                    <div className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  ) : isDone && (
                    <Check size={14} className="text-white" strokeWidth={3} />
                  )}
                </div>
              </div>
            );
          })}
          
          {(!habits || habits.length === 0) && (
            <p className="text-muted text-sm">No habits found.</p>
          )}
        </div>
      </div>
      
      <style>{`
        .calendar-wrapper .react-calendar { 
            background: transparent; 
            width: 100%;
            font-family: inherit;
        }
        .calendar-wrapper .react-calendar__tile {
            color: inherit;
            padding: 10px 0;
        }
        .calendar-wrapper .react-calendar__tile:enabled:hover,
        .calendar-wrapper .react-calendar__tile:enabled:focus {
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
        }
        .calendar-wrapper .react-calendar__tile--now {
            background: rgba(59, 130, 246, 0.2);
            border-radius: 12px;
            color: #60a5fa;
        }
        .calendar-wrapper .react-calendar__tile--active {
            background: var(--primary) !important;
            border-radius: 12px;
            color: white !important;
        }
        .calendar-wrapper .react-calendar__navigation button {
            color: inherit;
            min-width: 44px;
            background: none;
            font-size: 1.2rem;
        }
        .calendar-wrapper .react-calendar__navigation button:enabled:hover,
        .calendar-wrapper .react-calendar__navigation button:enabled:focus {
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
        }
        .calendar-wrapper .react-calendar__month-view__weekdays__weekday {
            color: var(--muted);
            text-decoration: none;
            font-weight: 500;
        }
        .calendar-wrapper .react-calendar__month-view__days__day--neighboringMonth {
            color: var(--muted);
            opacity: 0.5;
        }
      `}</style>
    </div>
  );
}
