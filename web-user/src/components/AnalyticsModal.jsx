import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Calendar, TrendingUp, Activity, Edit2, Trash2 } from 'lucide-react';
import CalendarHeatmap from 'react-calendar-heatmap';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { api } from '../lib/api';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import 'react-calendar-heatmap/dist/styles.css';

export default function AnalyticsModal({ habit, onClose, onEdit, onUpdate }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (habit) {
      loadAnalytics();
    }
  }, [habit]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/api/habits/${habit.id}/analytics`);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this habit? This action cannot be undone.')) {
      try {
        await api.delete(`/api/habits/${habit.id}`);
        toast.success('Habit deleted');
        onUpdate && onUpdate();
        onClose();
      } catch (error) {
        console.error('Failed to delete habit', error);
        toast.error('Failed to delete habit');
      }
    }
  };

  if (!habit) return null;

  // Generate color based on habit (same logic as HabitCard)
  const colors = [
    'text-red-500', 'text-orange-500', 'text-amber-500', 'text-yellow-500', 
    'text-lime-500', 'text-green-500', 'text-emerald-500', 'text-teal-500', 
    'text-cyan-500', 'text-sky-500', 'text-blue-500', 'text-indigo-500', 
    'text-violet-500', 'text-purple-500', 'text-fuchsia-500', 'text-pink-500', 'text-rose-500'
  ];
  const colorClass = habit.color ? `text-${habit.color.replace('bg-', '')}` : colors[(habit.id || 0) % colors.length];
  const bgClass = colorClass.replace('text-', 'bg-');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-surface rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-surface/80 backdrop-blur-md border-b border-white/5 p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={clsx(
                "w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-lg",
                bgClass
              )}>
                {habit.icon || habit.title.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-text">{habit.title}</h2>
                <p className="text-xs text-muted">Analytics & Progress</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={async () => {
                  const date = prompt("Enter date (YYYY-MM-DD):", new Date().toISOString().split('T')[0]);
                  if (date) {
                    try {
                      await api.post(`/api/habits/${habit.id}/mark`, { date });
                      toast.success('Date marked');
                      onUpdate && onUpdate();
                      loadAnalytics(); // Reload stats
                    } catch (e) {
                      toast.error('Failed to mark date');
                    }
                  }
                }}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-muted hover:text-text transition-colors"
                title="Add Manual Completion"
              >
                <Calendar size={20} />
              </button>
              <button 
                onClick={onEdit}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-muted hover:text-text transition-colors"
                title="Edit Habit"
              >
                <Edit2 size={20} />
              </button>
              <button 
                onClick={handleDelete}
                className="p-2 rounded-full bg-white/5 hover:bg-red-500/20 text-muted hover:text-red-500 transition-colors"
                title="Delete Habit"
              >
                <Trash2 size={20} />
              </button>
              <button 
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-muted hover:text-text transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : analytics ? (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <StatCard 
                    icon={<Trophy size={20} />}
                    label="Current Streak"
                    value={`${analytics.currentStreak} days`}
                    color={colorClass}
                  />
                  <StatCard 
                    icon={<Activity size={20} />}
                    label="Longest Streak"
                    value={`${analytics.longestStreak} days`}
                    color={colorClass}
                  />
                  <StatCard 
                    icon={<Calendar size={20} />}
                    label="Total Done"
                    value={analytics.totalCompletions}
                    color={colorClass}
                  />
                  <StatCard 
                    icon={<TrendingUp size={20} />}
                    label="Completion Rate"
                    value={`${Math.round(analytics.completionRate * 100)}%`}
                    color={colorClass}
                  />
                </div>

                {/* Heatmap */}
                <div className="bg-background rounded-2xl p-4 border border-white/5">
                  <h3 className="text-sm font-semibold text-muted mb-4 uppercase tracking-wider">Yearly Overview</h3>
                  <div className="calendar-heatmap-container">
                    <CalendarHeatmap
                      startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
                      endDate={new Date()}
                      values={Object.entries(analytics.heatmapData || {}).map(([date, count]) => ({ date, count }))}
                      classForValue={(value) => {
                        if (!value) return 'color-empty';
                        return `color-scale-${Math.min(value.count, 4)}`;
                      }}
                      showWeekdayLabels
                    />
                  </div>
                </div>

                {/* Weekly Chart */}
                <div className="bg-background rounded-2xl p-4 border border-white/5">
                  <h3 className="text-sm font-semibold text-muted mb-4 uppercase tracking-wider">Weekly Performance</h3>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.weeklyData}>
                        <XAxis 
                          dataKey="day" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#94a3b8', fontSize: 12 }} 
                        />
                        <Tooltip 
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                          contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {analytics.weeklyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.count > 0 ? 'var(--primary)' : 'rgba(255,255,255,0.1)'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-muted py-10">
                Failed to load analytics data.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-background p-4 rounded-2xl border border-white/5 flex flex-col gap-2">
      <div className={clsx("p-2 rounded-lg w-fit bg-white/5", color)}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted font-medium uppercase tracking-wide">{label}</p>
        <p className="text-xl font-bold text-text">{value}</p>
      </div>
    </div>
  );
}
