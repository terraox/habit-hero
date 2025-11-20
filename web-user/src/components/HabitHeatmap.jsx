import React, { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { X } from 'lucide-react';

export default function HabitHeatmap({ habitId, onClose }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!habitId) return;

    async function fetchStats() {
      setLoading(true);
      try {
        const data = await api.get(`/api/habits/${habitId}/stats`);
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch habit stats", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [habitId]);

  if (!habitId) return null;

  const today = new Date();
  const startDate = new Date();
  startDate.setFullYear(today.getFullYear() - 1);

  const values = (stats?.heatmapDates || []).map(dateStr => ({
    date: dateStr,
    count: 1
  }));

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 mt-4 relative overflow-hidden"
    >
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors"
      >
        <X size={20} />
      </button>

      {loading ? (
        <div className="h-32 animate-pulse bg-slate-100 dark:bg-slate-700 rounded-lg" />
      ) : stats ? (
        <>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">{stats.title}</h3>
            <div className="flex gap-4 mt-2 text-sm">
              <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full font-medium">
                Current Streak: {stats.currentStreak}
              </div>
              <div className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full font-medium">
                Longest: {stats.longestStreak}
              </div>
            </div>
          </div>

          <div className="w-full overflow-x-auto pb-2">
            <div className="min-w-[600px]">
              <CalendarHeatmap
                startDate={startDate}
                endDate={today}
                values={values}
                classForValue={(value) => {
                  if (!value) return 'color-empty';
                  return `color-scale-${value.count}`;
                }}
                showWeekdayLabels={true}
                gutterSize={2}
              />
            </div>
          </div>
          
          <div className="flex justify-end items-center gap-2 mt-2 text-xs text-slate-400">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-slate-100 dark:bg-slate-800 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
            </div>
            <span>More</span>
          </div>
        </>
      ) : (
        <div className="text-center text-slate-500">Stats unavailable</div>
      )}
    </motion.div>
  );
}
