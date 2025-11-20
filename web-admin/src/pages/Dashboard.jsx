import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import TrendChart from '../components/TrendChart';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalActiveHabits: 0,
    totalCoupons: 0,
    premiumUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/admin/dashboard')
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-text">Loading dashboard...</div>;

  // Mock trend data for now as backend doesn't provide it yet
  const sampleTrend = [
    { date: '2023-10-01', count: 12 },
    { date: '2023-10-02', count: 19 },
    { date: '2023-10-03', count: 3 },
    { date: '2023-10-04', count: 5 },
    { date: '2023-10-05', count: 2 },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-text">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface rounded-lg shadow p-6">
          <div className="text-muted text-sm font-medium uppercase">Total Users</div>
          <div className="text-3xl font-bold text-text mt-2">{stats.totalUsers}</div>
        </div>
        <div className="bg-surface rounded-lg shadow p-6">
          <div className="text-muted text-sm font-medium uppercase">Active Habits</div>
          <div className="text-3xl font-bold text-green-500 mt-2">{stats.totalActiveHabits}</div>
        </div>
        <div className="bg-surface rounded-lg shadow p-6">
          <div className="text-muted text-sm font-medium uppercase">Premium Users</div>
          <div className="text-3xl font-bold text-accent mt-2">{stats.premiumUsers}</div>
        </div>
        <div className="bg-surface rounded-lg shadow p-6">
          <div className="text-muted text-sm font-medium uppercase">Coupons</div>
          <div className="text-3xl font-bold text-primary mt-2">{stats.totalCoupons}</div>
        </div>
      </div>
      
      <div className="bg-surface rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4 text-text">Activity Trend</h3>
        <TrendChart data={sampleTrend} title="Completions (Last 7 Days)" />
      </div>
    </div>
  );
}
