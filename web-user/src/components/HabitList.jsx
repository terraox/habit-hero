import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import HabitCard from './HabitCard';
import { toast } from 'react-toastify';

export default function HabitList({ onSelectHabit }) {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/habits/today');
      setHabits(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load habits', err);
      setError('Could not load your habits. Please check your connection.');
      toast.error('Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  const handleHabitUpdate = (updatedHabit) => {
    setHabits(prevHabits => 
      prevHabits.map(h => h.id === updatedHabit.id ? updatedHabit : h)
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-40 bg-surface rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={loadHabits}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="text-center py-12 bg-surface rounded-2xl border border-dashed border-white/10">
        <p className="text-muted">No habits found for today.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-20">
      {habits.map(habit => (
        <HabitCard 
          key={habit.id} 
          habit={habit} 
          onUpdate={handleHabitUpdate}
          onClick={onSelectHabit}
        />
      ))}
    </div>
  );
}
