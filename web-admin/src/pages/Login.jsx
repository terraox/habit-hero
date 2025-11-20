import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('help.habithero@gmail.com');
  const [password, setPassword] = useState('shipDock123*');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const success = await login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid credentials or backend unreachable');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg transition-colors duration-300">
      <div className="bg-surface p-8 rounded-lg shadow-md w-96 border border-muted/10">
        <h2 className="text-2xl font-bold mb-6 text-center text-text">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-text text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border border-muted rounded w-full py-2 px-3 text-text bg-transparent leading-tight focus:outline-none focus:border-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-text text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border border-muted rounded w-full py-2 px-3 text-text bg-transparent mb-3 leading-tight focus:outline-none focus:border-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              className="bg-primary hover:opacity-90 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
