import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import clsx from 'clsx';

export default function HeadlampCard() {
  const [stats, setStats] = useState({ totalActiveHabits: 0, totalDoneToday: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [dashboardData, habitsData] = await Promise.all([
          api.get('/api/admin/dashboard').catch(() => ({})),
          api.get('/api/habits/today').catch(() => [])
        ]);

        const todayStr = new Date().toISOString().split('T')[0];
        const doneCount = Array.isArray(habitsData) 
          ? habitsData.filter(h => h.doneDates && h.doneDates.includes(todayStr)).length
          : 0;
        
        const totalCount = Array.isArray(habitsData) ? habitsData.length : (dashboardData.totalActiveHabits || 0);

        setStats({
          totalActiveHabits: totalCount,
          totalDoneToday: doneCount
        });
      } catch (error) {
        console.error("Failed to load headlamp data", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-32 bg-surface rounded-2xl animate-pulse mb-6" />
    );
  }

  const total = stats.totalActiveHabits || 1;
  const done = stats.totalDoneToday || 0;
  const percent = Math.min(100, Math.round((done / total) * 100));
  
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-surface rounded-2xl p-6 shadow-lg border border-white/5 mb-6 flex items-center justify-between relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

      <div className="z-10">
        <h2 className="text-2xl font-bold text-text mb-1">Hello, Hero!</h2>
        <p className="text-muted text-sm">
          You've completed <span className="font-bold text-primary">{done}</span> of <span className="font-bold text-text">{total}</span> habits today.
        </p>
      </div>

      <div className="relative w-24 h-24 flex-shrink-0 z-10">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 88 88">
          <circle
            cx="44"
            cy="44"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-white/10"
          />
          <motion.circle
            cx="44"
            cy="44"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeLinecap="round"
            className="text-primary drop-shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
            initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-text">{percent}%</span>
        </div>
      </div>
    </motion.div>
  );
}
