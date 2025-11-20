import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useHabits } from '../hooks/useHabits';

export default function WeeklyProgressChart() {
  const { data: habits } = useHabits();

  const data = useMemo(() => {
    if (!habits) return [];

    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      
      let completedCount = 0;
      habits.forEach(h => {
        if (h.doneDates && h.doneDates.includes(dateStr)) {
          completedCount++;
        }
      });

      days.push({ name: dayName, completed: completedCount });
    }
    return days;
  }, [habits]);

  if (!habits || habits.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Weekly Progress</h3>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12 }} 
              dy={10}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="completed" radius={[4, 4, 4, 4]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 6 ? '#3b82f6' : '#cbd5e1'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
