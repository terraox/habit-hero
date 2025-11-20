import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/admin/habits')
      .then(res => {
        setHabits(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-text">Loading habits...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-text">Habits</h2>
      <div className="bg-surface rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-muted/20">
          <thead className="bg-muted/10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Frequency</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">User ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Created At</th>
            </tr>
          </thead>
          <tbody className="bg-surface divide-y divide-muted/10">
            {habits.map((habit) => (
              <tr key={habit.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-text">{habit.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-muted">{habit.frequency}</td>
                <td className="px-6 py-4 whitespace-nowrap text-muted">{habit.userId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-muted">
                  {habit.createdAt ? new Date(habit.createdAt).toLocaleDateString() : '-'}
                </td>
              </tr>
            ))}
            {habits.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-muted">No habits found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
