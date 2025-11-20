import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/admin/users')
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-text">Loading users...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-text">Users</h2>
      <div className="bg-surface rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-muted/20">
          <thead className="bg-muted/10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Created At</th>
            </tr>
          </thead>
          <tbody className="bg-surface divide-y divide-muted/10">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-text">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-muted">{user.name || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-muted">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.admin ? 'bg-accent/20 text-accent' : 'bg-muted/20 text-muted'}`}>
                    {user.admin ? 'Admin' : 'User'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-muted">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-muted">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
